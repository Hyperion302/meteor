import { tID, IError } from '../../../src/definitions';
import { firestoreInstance } from '../../../src/sharedInstances';
import { IVideoContent } from './definitions';

export async function getVideoContent(id: tID): Promise<IVideoContent> {
    const contentDoc = firestoreInstance.doc(`content/${id}`);
    const contentDocSnap = await contentDoc.get();
    if (!contentDocSnap.exists) {
        const error: IError = {
            resource: id,
            message: `Could not find content record ${id}`
        };
        throw error;
    }
    const contentData = contentDocSnap.data();

    return {
        id: id,
        assetID: contentData.assetID,
        playbackID: contentData.playbackID
    };
}
