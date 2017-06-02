import { ThrottleOptions } from './decorator/ThrottleOptions';

export interface Task {
    func: (...args: any[]) => PromiseLike<any>;
    options: ThrottleOptions;
}