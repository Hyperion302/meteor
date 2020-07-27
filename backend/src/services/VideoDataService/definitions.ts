import { IVideoContent } from '../VideoContentService/definitions';
import { tID } from '@/definitions';
import { IChannel } from '@services/ChannelDataService/definitions';

/**
 * A fully retrieved video including the "joined" fields such as channel and content
 */
export interface IVideo {
  id: tID;
  author: string;
  channel: IChannel;
  title: string;
  description: string;
  content: IVideoContent;
}

/**
 * A "flat" video record with only ids for deep fields
 */
export interface IVideoSchema {
  id: tID;
  author_id: tID;
  channel_id: tID;
  title: string;
  description: string;
  content_id: tID;
  created_at: number;
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

/**
 * Video update object
 */
export interface IVideoUpdate {
  title?: string;
  description?: string;
}
