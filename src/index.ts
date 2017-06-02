import 'reflect-metadata';
import { Channel } from './channel/Channel';
import { ChannelRepository } from './channel/ChannelRepository';
import { throttle } from './decorator/throttle';

class A {
    @throttle('test')
    static test(a: string) {
        return Promise.resolve(a);
    }

    @throttle({
        channel: 'test',
        cost: 1,
        ttl: 100000
    })
    static test2(a: string) {
        return Promise.resolve(a);
    }
}

let channel = new Channel({
    interval: 1000,
    bucketSize: 25,
    tokensPerInterval: 10,
    tokens: 25
});
ChannelRepository.instance.channels.set('test2', channel);

ChannelRepository.instance.channels.set('test', Channel.createSimple(2, 'second'));

for (let i = 0; i < 6; i++) {
    A.test(i.toString()).then((a) => console.log(channel.bucket.tokens)).catch((ex) => {
        console.log(ex);
    });
}
A.test2('test2').then((a) => console.log(a)).catch((ex) => {
    console.log(ex);
});
