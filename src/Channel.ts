import { RateLimitOptions } from './RateLimitOptions';
import { Task } from './Task';
import { TokenBucket } from './TokenBucket';

export class Channel {

    private tasks: Map<Task, number> = new Map();

    private tokenBucket: TokenBucket;

    constructor(private rateLimitOptions: RateLimitOptions) {
        this.tokenBucket = new TokenBucket(rateLimitOptions);
    }

    async enqueueTask(task: Task) {

        if (!this.tokenBucket.pay(task.options.fee)) {
            let totalFee = task.options.fee;
            for (let key of this.tasks.keys()) {
                totalFee += key.options.fee;
            }

            /*
             if (this.tasks.size === 0) {
             totalFee-=this.tokenBucket.tokens;
             }

             let waitTime = totalFee / this.rateLimitOptions.tokensPerInterval * this.rateLimitOptions.interval;*/
            let waitTime = this.tokenBucket.waitTime(totalFee);
            if (task.options.ttl > 0 && waitTime > task.options.ttl) {
                throw new Error('throwing ttl too low ' + waitTime);
            }

            this.tasks.set(task, 0);
            console.log('we have to wait ' + waitTime);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            console.log('ext');
            this.tokenBucket.pay(task.options.fee);
            this.tasks.delete(task);
        }
        return task.func();
    }
}