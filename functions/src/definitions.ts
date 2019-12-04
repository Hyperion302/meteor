
export interface IVideo {
    //  TODO: Collect far more metadata (original orientation, resolution, fr, etc.)
    id: string,
    author: string,
    title: string,
    titleKeys: string[],
    status: 'master-upload-ready' | 'master-upload-complete' | 'transcoded'
    muxAssetId?: string,
    muxPlaybackId?: string
}

export interface ILog {
    // TODO: Better log types with subtypes for video, error, etc.
    eventSource: 'video' | 'error'
    value: any
    message: string
}