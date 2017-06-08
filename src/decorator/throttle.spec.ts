import { Channels } from '../channel/Channels';
import { ChannelNotFoundError } from './ChannelNotFoundError';
import { throttle } from './throttle';
import { expect } from 'chai';
import { useFakeTimers, SinonFakeTimers, spy } from 'sinon';

describe('Decorator: throttle', function () {

    let clock: SinonFakeTimers;
    before(function () {
        clock = useFakeTimers();
    });

    after(function () {
        clock.restore();
    });

    beforeEach(function () {
        Channels.channels.clear();
    });

    it('should attach to async function', function () {
        let channelId = 'testChannel';
        let channel = Channels.createSimple(channelId, 1, 'second');

        let mock = spy(channel, 'enqueueTask');
        class A {
            @throttle(channelId)
            static async foo() {
            }
        }

        A.foo();
        mock.should.have.been.calledOnce;
    });

    it('should attach to Promise', function () {
        let channelId = 'testChannel';
        let channel = Channels.createSimple(channelId, 1, 'second');

        let mock = spy(channel, 'enqueueTask');
        class A {
            @throttle(channelId)
            static foo(): Promise<any> {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }
        }

        A.foo();
        mock.should.have.been.calledOnce;
    });

    it('should use the simple options', function () {

    });

    it('should use the advanced options', function () {

    });

    it('should throw if channel is not found', function () {
        class A {
            @throttle('unknown')
            static async foo() {
            }
        }

        A.foo().catch(function(err) {
            err.should.be.instanceof(ChannelNotFoundError);
        });
    });

    it('should allow burst', function () {

    });

    it('should delay on drain', function () {

    });

    it('should respect ttl', function () {
        
    });
});