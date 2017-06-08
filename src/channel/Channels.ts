import { Channel } from './Channel';
import { TokenBucketOptions } from '../token-bucket/TokenBucketOptions';

export namespace Channels {
    export const channels: Map<string, Channel> = new Map();

    export function create(id: string, bucketOptions: TokenBucketOptions): Channel {
        let channel = new Channel(bucketOptions);
        channels.set(id, channel);

        return channel;
    }

    export function createSimple(id: string, requests: number, interval: number | string): Channel {
        let intervalValue: number;
        if (typeof interval === 'string') {
            if (interval === 'second') {
                intervalValue = 1000;
            } else if (interval === 'minute') {
                intervalValue = 60000;
            } else if (interval === 'hour') {
                intervalValue = 3600000;
            } else if (interval === 'day') {
                intervalValue = 86400000;
            } else {
                throw new Error('unknow interval literal.');
            }
        } else {
            intervalValue = interval;
        }

        let bucketOptions: TokenBucketOptions = {
            tokensPerInterval: requests,
            interval: intervalValue,
            bucketSize: requests,
            tokens: requests
        };

        return create(id, bucketOptions);
    }
}