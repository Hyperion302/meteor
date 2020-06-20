export interface IChannel {
  id: string;
  owner: string;
  name: string;
}

export interface IChannelSearchObject {
  objectID: string;
  type: 'channel';
  name: string;
}
