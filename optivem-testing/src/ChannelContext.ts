import type { Optional } from '@optivem/common/util';

export class ChannelContext {
    private static channelThreadLocal: Optional<string>;

    static set(channel: string): void {
        this.channelThreadLocal = channel;
    }

    static get(): Optional<string> {
        return this.channelThreadLocal;
    }

    static clear(): void {
        this.channelThreadLocal = undefined;
    }
}
