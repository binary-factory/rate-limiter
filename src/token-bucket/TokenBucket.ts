import { TokenBucketExceededError } from './TokenBucketExceededError';
import { TokenBucketOptions } from './TokenBucketOptions';

export class TokenBucket {

    /** */
    private _options: TokenBucketOptions;

    private _tokens: number;

    private _lastDrip: Date;

    constructor(options: TokenBucketOptions) {
        this.setOptions(options);
    }

    take(amount: number): boolean {
        if (!this._options.bucketSize) {
            return true;
        }

        if (amount > this._options.bucketSize) {
            throw new TokenBucketExceededError(`Bucket limit exeeded! Can not take ${amount} of ${this._options.bucketSize} tokens.`);
        }

        // Drip tokens inside this bucket since last visit.
        this.drip();

        if (this._tokens < amount) {
            return false;
        }

        this._tokens = this.clampTokens(this._tokens - amount);
        return true;
    }

    private setOptions(options: TokenBucketOptions) {
        this.reset();

        this._options = options;
        if (this.options.tokens) {
            this._tokens = this.clampTokens(this.options.tokens);
        }
    }

    /**
     * Drips tokens into the bucket since the last visit.
     */
    private drip() {
        if (!(this._options.tokensPerInterval > 0)) {
          this._tokens = this._options.bucketSize;
          return;
        }

        let now = new Date();
        let delta = now.getTime() - this._lastDrip.getTime();
        let tokens = delta / this._options.interval * this._options.tokensPerInterval;

        this._tokens = this.clampTokens(this._tokens + tokens);
        this._lastDrip = now;
    }

    /**
     * Returns the tokens clamped against zero and the bucket size.
     * @param tokens The tokens which will be clamped.
     * @returns {number} Returns clamped tokens that will fit into this bucket.
     */
    private clampTokens(tokens: number): number {
        // Clamp against upper bucket size.
        let clamped = Math.min(tokens, this._options.bucketSize);
        // Clamp against zero.
        return Math.max(clamped, 0);
    }

    get options(): TokenBucketOptions {
        return this._options;
    }

    set options(value: TokenBucketOptions) {
        this.setOptions(value);
    }

    get tokens(): number {
        this.drip();
        return this._tokens;
    }

    set tokens(value: number) {
        this._tokens = value;
    }

    get lastDrip(): Date {
        return this._lastDrip;
    }

    get timePerToken(): number {
        return this.options.tokensPerInterval / this.options.interval;
    }

    reset() {
        this._tokens = 0;
        this._lastDrip = new Date();
    }

    wipe() {
        this.tokens = 0;
    }
}