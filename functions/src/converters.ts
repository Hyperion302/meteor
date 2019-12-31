import { IVideo, IChannel, IMuxData, IAlgoliaVideoObject, IAlgoliaChannelObject } from "./definitions";

export function channelFromFirestore(data: FirebaseFirestore.DocumentData): IChannel {
    return {
        id: data['id'],
        name: data['name'],
        owner: data['owner'],
    }
}

export function videoFromFirestore(data: FirebaseFirestore.DocumentData): IVideo {
    const channel: IChannel = {
        id: data['channel']['id'],
        owner: data['channel']['owner'],
        name: data['channel']['name'],
    };
    const muxData: IMuxData = {
        status: data['muxData']['status'],
        assetID: data['muxData']['assetID'],
        playbackID: data['muxData']['playbackID'],
    };
    return {
        id: data['id'],
        title: data['title'],
        author: data['author'],
        channel: channel,
        muxData: muxData,
    };
}

export function algoliaFromVideo(video: IVideo): IAlgoliaVideoObject {
    const channel: IAlgoliaChannelObject = {
        id: video.channel.id,
        name: video.channel.name,
        owner: video.channel.owner,
    };
    return {
        id: video.id,
        title: video.title,
        author: video.author,
        channel: channel,
    };
}

export function algoliaFromChannel(channel: IChannel): IAlgoliaChannelObject {
    return {
        id: channel.id,
        name: channel.name,
        owner: channel.owner,
    };
}