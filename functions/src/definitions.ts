export type tID = string;
export type tMuxID = string;
export type tUser = string;

export interface IMuxData {
    status: 'upload-ready' | 'upload-complete' | 'transcoded',
    assetID: tMuxID | null,
    playbackID: tMuxID | null,
}

export interface IVideo {
    id: tID,
    author: tUser,
    channel: IChannel,
    title: string,
    muxData: IMuxData,
}

export interface IAlgoliaVideoObject {
    channel: IAlgoliaChannelObject,
    title: string,
    id: tID,
    author: tUser,
}

export interface IAlgoliaChannelObject {
    name: string,
    id: tID,
    owner: tUser,
}

export interface IChannel {
    id: tID,
    owner: tUser,
    name: string,
}

export interface ILog {
    // TODO: Better log types with subtypes for video, error, etc.
    eventSource: 'video' | 'error' | 'channel'
    value: any
    message: string
}