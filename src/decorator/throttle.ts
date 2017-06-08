import { Channels } from '../channel/Channels';
import { Task } from '../channel/Task';
import { ChannelNotFoundError } from './ChannelNotFoundError';
import { defaultThrottleOptions, ThrottleOptions } from './ThrottleOptions';

export function throttle(options: ThrottleOptions | string) {
    let optionsObject: ThrottleOptions;
    if (typeof options === 'string') {
        optionsObject = { channel: options };
    } else {
        optionsObject = options;
    }
    let mergedOptions = Object.assign(defaultThrottleOptions, optionsObject);

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            let channel = Channels.channels.get(mergedOptions.channel);
            if (!channel) {
                throw new ChannelNotFoundError(`Channel '${mergedOptions.channel}' not found!`);
            }

            let task: Task = {
                func: function () {
                    return originalMethod.apply(this, args);
                },
                options: mergedOptions
            };

            return channel.enqueueTask(task);
        };

        return descriptor;
    };
}