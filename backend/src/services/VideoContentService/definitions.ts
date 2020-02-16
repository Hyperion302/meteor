import { tID } from '../../../src/definitions';

/**
 * Describes a video content record.  Holds Mux ids required for playback and/or asset manipulation.
 */
export interface IVideoContent {
    id: tID;
    assetID: string;
    playbackID: string;
}
