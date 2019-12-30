export interface IVideo {
    //  TODO: Collect far more metadata (original orientation, resolution, fr, etc.)
    id: string,
    author: string,
    channel: string,
    title: string,
    status: 'master-upload-ready' | 'master-upload-complete' | 'transcoded'
    muxAssetId?: string,
    muxPlaybackId?: string,
}

export interface IAlgoliaVideoObject {
    objectId: string,
    channel: IAlgoliaChannelObject,
    title: string,
}

export interface IAlgoliaChannelObject {
    objectId: string,
    name: string,
}

export interface IChannel {
    id: string,
    owner: string,
    name: string,
}

export interface ILog {
    // TODO: Better log types with subtypes for video, error, etc.
    eventSource: 'video' | 'error' | 'channel'
    value: any
    message: string
}