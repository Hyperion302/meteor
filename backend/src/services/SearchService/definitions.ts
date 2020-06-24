import { tID } from '../../definitions';

export interface IVideoSearchObject {
  objectID: tID;
  type: 'video';
  title: string;
  description: string;
  uploadDate: number;
}

export interface IChannelSearchObject {
  objectID: tID;
  type: 'channel';
  name: string;
}
