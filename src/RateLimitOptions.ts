export interface RateLimitOptions {
    bucketSize: number;
    tokensPerInterval: number;
    interval: number;
}