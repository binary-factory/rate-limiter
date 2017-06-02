import { TokenBucket } from '../token-bucket/TokenBucket';
import { TokenBucketOptions } from '../token-bucket/TokenBucketOptions';
import { Task } from './Task';

export class Channel {

    private tasks: Map<Task, NodeJS.Timer> = new Map();

    private _bucket: TokenBucket;

    constructor(bucketOptions: TokenBucketOptions) {
        this._bucket = new TokenBucket(bucketOptions);
    }

    static createSimple(requests: number, literal: string): Channel {
        let interval: number;
        if (literal === 'second') {
            interval = 1000;
        } else if (literal === 'minute') {
            interval = 60000;
        } else if (literal === 'hour') {
            interval = 3600000;
        } else if (literal === 'day') {
            interval = 86400000;
        }

        return new Channel({
            tokensPerInterval: requests,
            interval,
            bucketSize: requests,
            tokens: requests
        });
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

            this._bucket.wipe();
            this.tasks.delete(task);
        }

        return task.func();
    }

    get bucket(): TokenBucket {
        return this._bucket;
    }
}