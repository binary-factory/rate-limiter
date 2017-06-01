import { PayOptions } from './decorator/PayOptions';

export interface Task {
    func: (...args: any[]) => PromiseLike<any>;
    options: PayOptions;
}