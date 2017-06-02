export interface TokenBucketOptions {
    /** The income per interval in milliseconds. */
    tokensPerInterval: number;

    /** The interval in milliseconds which the tokens drips in the bucket. */
    interval: number;

    /** The maximum amount of tokens the bucket can hold. */
    bucketSize: number;

    /** The amount of tokens the bucket will hold at creation. */
    tokens?: number;
}