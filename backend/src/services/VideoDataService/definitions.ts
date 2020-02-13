import { IVideoContent } from '../VideoContentService/definitions';
import { tID } from '../../../src/definitions';
import { IChannel } from '../ChannelDataService/definitions';

export interface IVideo {
    id: tID;
    author: string;
    channel: IChannel;
    title: string;
    description: string;
    uploadDate: number;
    content: IVideoContent;
}

export interface IVideoSchema {
    id: tID;
    author: string;
    channel: tID;
    title: string;
    description: string;
    uploadDate: number;
    content?: tID;
}

export interface IVideoQuery {
    author?: string;
    channel?: tID;
    before?: number;
    after?: number;
}
