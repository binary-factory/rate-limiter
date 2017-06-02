export interface ThrottleOptions {
    channel: string;
    cost?: number;
    ttl?: number;
}

export const defaultThrottleOptions: ThrottleOptions = {
    channel: '',
    cost: 1,
    ttl: 0
};