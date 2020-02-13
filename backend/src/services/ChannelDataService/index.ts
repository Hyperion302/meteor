import { tID, IError } from '../../../src/definitions';
import * as uuid from 'uuid/v4';
import { IChannel, IChannelQuery } from './definitions';
import { addChannelIndex } from '../SearchService';
import { firestoreInstance } from '../../../src/sharedInstances';

async function getSingleChannelRecord(id: tID): Promise<IChannel> {
    // Get basic channel data
    const channelDoc = firestoreInstance.doc(`channels/${id}`);
    const channelDocSnap = await channelDoc.get();
    if (!channelDocSnap.exists) {
        const error: IError = {
            resource: id,
            message: `Could not find channel ${id}`
        };
        throw error;
    }
    const channelData = channelDocSnap.data();
    // Build channel object
    return {
        id: id,
        owner: channelData.owner,
        name: channelData.name
    };
}

export async function getChannelData(id: tID): Promise<IChannel> {
    return await getSingleChannelRecord(id);
}

export async function queryChannelData(
    query: IChannelQuery
): Promise<IChannel[]> {
    if (!query.owner) {
        // No query
        const error: IError = {
            resource: query,
            message: `No query provided`
        };
        throw error;
    }
    const collection = firestoreInstance.collection('channels');
    let fsQuery = undefined;
    if (query.owner) {
        fsQuery = (fsQuery ? fsQuery : collection).where(
            'owner',
            '==',
            query.owner
        );
    }
    if (!fsQuery) {
        const error: IError = {
            resource: query,
            message: 'An unexpected error occured',
            longMessage:
                'fsQuery was undefined when it should have been overwritten at *some* point'
        };
        throw error;
    }

    // Query FS
    const querySnap = await fsQuery.get();
    const queryPromises = querySnap.docs.map((doc) => {
        return getSingleChannelRecord(doc.id);
    });

    // Wait for all to run
    const channels = await Promise.all(queryPromises);
    return channels;
}

export async function createChannelData(
    name: string,
    owner: string
): Promise<IChannel> {
    // Build channel object
    const channelData: IChannel = {
        id: uuid.default(),
        owner: owner,
        name: name
    };

    // Add to search index
    await addChannelIndex(channelData);

    // Write to DB
    const channelDoc = firestoreInstance.doc(`channels/${channelData.id}`);
    await channelDoc.set(channelData);
    return channelData;
}
