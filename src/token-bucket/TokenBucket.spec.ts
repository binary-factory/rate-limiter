import { TokenBucket } from './TokenBucket';
import { useFakeTimers, SinonFakeTimers } from 'sinon';

describe('TokenBucket', function () {
    let bucketOptions = {
        interval: 1000,
        tokensPerInterval: 10,
        bucketSize: 50,
        tokens: 10
    };

    let clock: SinonFakeTimers;
    let bucket: TokenBucket;
    before(function () {
        clock = useFakeTimers();
        bucket = new TokenBucket(bucketOptions);
    });

    after(function () {
        clock.restore();
    });

    it('should respect starting tokens', function () {
        bucket.tokens.should.be.equals(bucketOptions.tokens);
    });

    it('should drip tokens inside the bucket', function () {
        let ms = 1111;
        let tokens = ms / bucketOptions.interval * bucketOptions.tokensPerInterval;

        clock.tick(ms);
        bucket.tokens.should.be.equals(bucketOptions.tokens + tokens);
    });

    it('should clamp against bucketSize', function() {
        let overflow = (bucketOptions.bucketSize - bucketOptions.tokens + 1) / bucketOptions.tokensPerInterval * bucketOptions.interval;
        clock.tick(overflow);
        bucket.tokens.should.be.equals(bucketOptions.bucketSize);
    });

    it ('should take tokens from the bucket', function() {
        // Just take half the tokens.
        let amount = bucketOptions.bucketSize / 2;
        bucket.take(amount).should.be.true;
        bucket.tokens.should.be.equals(amount);
    });

    it ('should take no more tokens from the bucket than it have', function() {
        let before = bucket.tokens;
        bucket.take(bucketOptions.bucketSize).should.be.false;
        bucket.tokens.should.be.equals(before);
    });
});