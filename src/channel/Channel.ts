import { TokenBucket } from '../token-bucket/TokenBucket';
import { TokenBucketOptions } from '../token-bucket/TokenBucketOptions';
import { Task } from './Task';

export class Channel {

    private tasks: Map<Task, NodeJS.Timer> = new Map();

    private _bucket: TokenBucket;

    constructor(bucketOptions: TokenBucketOptions) {
        this._bucket = new TokenBucket(bucketOptions);
    }

    async enqueueTask(task: Task) {
        let missingTokens: number;
        if (this.tasks.size === 0) {
            // Try to take.
            if (!this._bucket.take(task.options.cost)) {
                missingTokens = task.options.cost - this._bucket.tokens;
            }
        } else {
            missingTokens = task.options.cost;
            for (let key of this.tasks.keys()) {
                missingTokens += key.options.cost;
            }
        }

        if (missingTokens > 0) {
            let delay = missingTokens / this._bucket.timePerToken;

            if ((task.options.ttl > 0)
                && (delay > task.options.ttl)) {
                throw new Error('throwing ttl too low ' + delay);
            }

            console.log('we have to wait ' + delay);
            await new Promise((resolve) => {
                let timer = setTimeout(resolve, delay);
                this.tasks.set(task, timer);
            });

            this._bucket.tokens = 0;
            this.tasks.delete(task);
        }

        return task.func();
    }

    // TODO: Maybe do not expose. Setting tokens will be useless whether we have a queue. It will be set to zero after waiting time.
    get bucket(): TokenBucket {
        return this._bucket;
    }
}