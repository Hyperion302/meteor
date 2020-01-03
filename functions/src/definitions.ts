export type tID = string;
export type tMuxID = string;
export type tUser = string;
export type tTimestamp = number;

export interface IMuxData {
    status: 'upload-ready' | 'upload-complete' | 'transcoded',
    assetID: tMuxID | null,
    playbackID: tMuxID | null,
}

export interface ISchemaVideo {
    id: tID,
    author: tUser,
    channelID: tID,
    title: string,
    description: string,
    muxData: IMuxData,
    uploadDate: tTimestamp,
}

export interface IResolvedVideo {
    id: tID,
    author: tUser,
    channel: IResolvedChannel,
    title: string,
    description: string,
    muxData: IMuxData,
    uploadDate: tTimestamp,
}

export interface IAlgoliaVideo {
    channelID: tID,
    title: string,
    description: string,
    type: 'video',
    id: tID,
    author: tUser,
    uploadDate: tTimestamp
}

export interface IAlgoliaChannel {
    name: string,
    type: 'channel',
    id: tID,
    owner: tUser,
}

export interface ISchemaChannel {
    id: tID,
    name: string,
    owner: tID,
}

export interface IResolvedChannel {
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