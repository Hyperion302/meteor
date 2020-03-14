import { IVideo } from '../VideoDataService/definitions';
import { IChannel } from '../ChannelDataService/definitions';
import { tID } from '../../definitions';
import { algoliaIndexInstance } from '../../sharedInstances';
import { IVideoSearchObject, IChannelSearchObject } from './definitions';

function algoliaFromVideo(video: IVideo): IVideoSearchObject {
    return {
        objectID: video.id,
        title: video.title,
        description: video.description,
        uploadDate: video.uploadDate,
        type: 'video',
    };
}

function algoliaFromChannel(channel: IChannel): IChannelSearchObject {
    return {
        objectID: channel.id,
        name: channel.name,
        type: 'channel',
    };
}

// #region Video
/**
 * Adds a video to the search index
 * @param video Video to add
 */
export async function addVideo(video: IVideo) {
    await algoliaIndexInstance.saveObject(algoliaFromVideo(video));
}
/**
 * Updates a video in the search index
 * @param video Video to update
 */
export async function updateVideo(video: IVideo) {
    await algoliaIndexInstance.saveObject(algoliaFromVideo(video));
}
/**
 * Removes a video from the search index
 * @param id ID of index to delete
 */
export async function removeVideo(id: tID) {
    await algoliaIndexInstance.deleteObject(id);
}
// #endregion

// #region Channel
/**
 * Adds a channel to the search index
 * @param channel Channel to add
 */
export async function addChannel(channel: IChannel) {
    await algoliaIndexInstance.saveObject(algoliaFromChannel(channel));
}
/**
 * Updates a channel in the search index
 * @param channel
 */
export async function updateChannel(channel: IChannel) {
    await algoliaIndexInstance.saveObject(algoliaFromChannel(channel));
}
/**
 * Removes a channel from the search index
 * @param id ID of channel to remove
 */
export async function removeChannel(id: tID) {
    await algoliaIndexInstance.deleteObject(id);
}
// #endregion
