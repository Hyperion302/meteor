import { IChannel } from './channel';

export interface IVideo {
  id: string;
  title: string;
  author: string;
  description: string;
  uploadDate: number;
  channel: IChannel;
  content?: IVideoContent;
}

export interface IVideoContent {
  id: string;
  assetID: string;
  playbackID: string;
  duration: number;
}

export interface IVideoUpdate {
  title?: string;
  description?: string;
}

export interface IVideoSearchObject {
  objectID: string;
  type: 'video';
  title: string;
  description: string;
  uploadDate: number;
}

export interface IVideoFragment {
  t1: number;
  t2: number;
}

export interface IVideoSegment {
  index: number;
}
