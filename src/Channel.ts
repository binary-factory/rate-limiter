import { RateLimitOptions } from './RateLimitOptions';
import { Task } from './Task';
import { TokenBucket } from './TokenBucket';

export class Channel {

    private tasks: Map<Task, NodeJS.Timer> = new Map();

    private tokenBucket: TokenBucket;

    constructor(private rateLimitOptions: RateLimitOptions) {
        this.tokenBucket = new TokenBucket(rateLimitOptions);
    }

    async enqueueTask(task: Task) {

        let missingTokens: number;
        if (this.tasks.size === 0) {
            // Try to pay.
            if (!this.tokenBucket.pay(task.options.fee)) {
                missingTokens = task.options.fee - this.tokenBucket.tokens;
            }
        } else {
            missingTokens = task.options.fee;
            for (let key of this.tasks.keys()) {
                missingTokens += key.options.fee;
            }
        }
        console.log('missing tokens: ' + missingTokens);
        if (missingTokens > 0) {
            let waitTime = missingTokens / this.rateLimitOptions.tokensPerInterval * this.rateLimitOptions.interval;

            if ((task.options.ttl > 0)
                && (waitTime > task.options.ttl)) {
                throw new Error('throwing ttl too low ' + waitTime);
            }

            console.log('we have to wait ' + waitTime);
            await new Promise((resolve) => {
                let timeout = setTimeout(resolve, waitTime);
                // timeout.ref();
                this.tasks.set(task, timeout);
            });

            this.tokenBucket.pay(task.options.fee);
            this.tasks.delete(task);
        }

        return task.func();
    }
}