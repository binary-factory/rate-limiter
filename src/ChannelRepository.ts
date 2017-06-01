import { Channel } from './Channel';

export class ChannelRepository {

    private static _instance: ChannelRepository;

    private _channels: Map<string, Channel> = new Map();

    private constructor() {

    }

    static get instance(): ChannelRepository {
        if (!this._instance) {
            this._instance = new ChannelRepository();
        }

        return this._instance;
    }

    get channels(): Map<string, Channel> {
        return this._channels;
    }
}