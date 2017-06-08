export interface ThrottleOptions {
    channel: string;
    cost?: number;
    ttl?: number;
}

export const DEFAULT_THROTTLE_OPTIONS: ThrottleOptions = {
    channel: '',
    cost: 1,
    ttl: 0
};