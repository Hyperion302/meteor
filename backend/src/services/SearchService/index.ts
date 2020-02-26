import { IVideo } from '../VideoDataService/definitions';
import { IChannel } from '../ChannelDataService/definitions';
import { tID } from '../../definitions';

// #region Video
/**
 * Adds a video to the search index
 * @param video Video to add
 */
export async function addVideo(video: IVideo) {}
/**
 * Updates a video in the search index
 * @param video
 */
export async function updateVideo(video: IVideo) {}
/**
 * Removes a video from the search index
 * @param id ID of index to delete
 */
export async function removeVideo(id: tID) {}
// #endregion

// #region Channel
/**
 * Adds a channel to the search index
 * @param channel Channel to add
 */
export async function addChannel(channel: IChannel) {}
// #endregion
