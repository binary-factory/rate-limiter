import { throttle } from './throttle';

describe('Decorator: throttle', function () {
    it('should attach to async function', function () {
        class A {
            @throttle('channel1')
            async foo() {
            }
        }
    });

    it('should attach to promise', function () {
        class A {
            @throttle('channel1')
            foo(): Promise<any> {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }
        }
    });

    it('should use the simple options', function() {

    });

    it('should use the advanced options', function() {

    });

    it('should throw if channel is not found', function() {

    });

    it('should allow burst', function() {

    });

    it('should delay on drain', function() {

    });

    it('should respect ttl', function() {

    });
});