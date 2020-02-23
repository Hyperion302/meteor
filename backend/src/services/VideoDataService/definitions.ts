import { IVideoContent } from '../VideoContentService/definitions';
import { tID } from '../../definitions';
import { IChannel } from '../ChannelDataService/definitions';

/**
 * A fully retrieved video including the "joined" fields such as channel and content
 */
export interface IVideo {
    id: tID;
    author: string;
    channel: IChannel;
    title: string;
    description: string;
    uploadDate: number;
    content: IVideoContent;
}

/**
 * A "flat" video record with only ids for deep fields
 */
export interface IVideoSchema {
    id: tID;
    author: string;
    channel: tID;
    title: string;
    description: string;
    uploadDate: number;
    content?: tID;
}

/**
 * Video query object
 */
export interface IVideoQuery {
    author?: string;
    channel?: tID;
    before?: number;
    after?: number;
}
