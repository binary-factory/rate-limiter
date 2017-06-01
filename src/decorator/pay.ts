import { ChannelRepository } from '../ChannelRepository';
import { Task } from '../Task';
import { PayOptions } from './PayOptions';

export function pay(payOptions: PayOptions) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Get channel.
            let channel = ChannelRepository.instance.channels.get(payOptions.channel);
            if (!channel) {
                return Promise.reject('channel not found!');
            }

            let task: Task = {
                func: function () {
                    return originalMethod.apply(this, args);
                },
                options: payOptions
            };

            return channel.enqueueTask(task);
        };

        return descriptor;
    };
}