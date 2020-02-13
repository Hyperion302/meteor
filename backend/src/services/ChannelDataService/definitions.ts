import { tID } from '../../../src/definitions';

export interface IChannel {
    id: tID;
    owner: string;
    name: string;
}

export interface IChannelQuery {
    owner?: string;
}
