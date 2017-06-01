import 'reflect-metadata';
import { Channel } from './Channel';
import { ChannelRepository } from './ChannelRepository';
import { pay } from './decorator/pay';

class A {
    @pay({
        channel: 'test',
        fee: 10,
        ttl: 100000
    })
    static test(a: string) {
        return Promise.resolve('yes');
    }

    @pay({
        channel: 'test',
        fee: 8,
        ttl: 100000
    })
    static test2(a: string) {
        return Promise.resolve('yes');
    }
}

let channel = new Channel({
    interval: 1000,
    bucketSize: 25,
    tokensPerInterval: 10
});
ChannelRepository.instance.channels.set('test', channel);

A.test2('').then((a) => console.log(a)).catch((ex) => {
    console.log(ex);
});
for (let i = 0; i < 6; i++) {
    A.test('').then((a) => console.log(a)).catch((ex) => {
        console.log(ex);
    });
}
