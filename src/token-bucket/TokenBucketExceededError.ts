import { ExtendableError } from '../ExtendableError';

export class TokenBucketExceededError extends ExtendableError {

    constructor(message: string) {
        super('Can not exeed bucketSize!');
    }
}