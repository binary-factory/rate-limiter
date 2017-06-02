# rate-limiter
[![Build Status](https://travis-ci.org/binary-factory/rate-limiter.svg?branch=master)](https://travis-ci.org/binary-factory/rate-limiter)
[![Coverage Status](https://coveralls.io/repos/github/binary-factory/rate-limiter/badge.svg?branch=master)](https://coveralls.io/github/binary-factory/rate-limiter?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

A powerful rate-limiter with annotation and channel support written in TypeScript.

## Features
* Annotation support with `@throttle()`
* Implements the token-bucket-algorythm. Exported as `TokenBucket`
* Support of idependent configurable `Channels` that are isolated from each other.

## Installation
`npm install @binary-factory/rate-limiter`

## Usage

### Simple with default channel
```typescript
import { throttle, Channels } from '@binary-factory/rate-limiter';
class API {
    @throttle()
    static async request() {
        return 'OK';
    }
}
Channels.create(10, 'second');
```

### Simple with named channels
```typescript
import { Channels, throttle } from '@binary-factory/rate-limiter';
class API {
    @throttle('google-places')
    static async requestToPlaces() {
        return 'OK';
    }
    
    @throttle('google-translate')
    static async requestToAnother() {
        
    }
}
Channels.create('google-places', 10, 'second');
Channels.create('google-translate', 20, 'hour');
```

### Advanced
```typescript
import { Channel, Channels, throttle } from '@binary-factory/rate-limiter';
class API {
    
    @throttle({
        channel: 'google-places',
        cost: 5,
        ttl: 5000 // Drop whether we have to wait more than 5secs.
    })
    static async requestToPlaces() {
        return 'OK';
    }
    
    @throttle({
        channel: 'google-places',
        cost: 5,
        ttl: 5000 // Drop whether we have to wait more than 5secs.
    })
    static async requestToPlacesRich() {
        
    }
}

let channel = new Channel({
    interval: 1000,
    bucketSize: 25,
    tokensPerInterval: 10,
    tokens: 25
});
Channels.add(channel);
```
