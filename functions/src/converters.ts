import { IResolvedVideo, IMuxData, ISchemaVideo, ISchemaChannel, IResolvedChannel, IAlgoliaVideo, IAlgoliaChannel } from "./definitions";


// FS -> Schema
export function channelSchemaFromFirestore(data: FirebaseFirestore.DocumentData): ISchemaChannel {
    return {
        id: data['id'],
        name: data['name'],
        owner: data['owner'],
    };
}

export function videoSchemaFromFirestore(data: FirebaseFirestore.DocumentData): ISchemaVideo {
    const muxData: IMuxData = {
        status: data['muxData']['status'],
        assetID: data['muxData']['assetID'],
        playbackID: data['muxData']['playbackID'],
    };
    return {
        id: data['id'],
        title: data['title'],
        description: data['description'],
        author: data['author'],
        channelID: data['channelID'],
        muxData: muxData,
        uploadDate: data['uploadDate'],
    };
}

// Schema -> Obj

export async function resolveChannel(db: FirebaseFirestore.Firestore, schema: ISchemaChannel): Promise<IResolvedChannel> {
    return {
        id: schema.id,
        name: schema.name,
        owner: schema.owner,
    };
}

export async function resolveVideo(db: FirebaseFirestore.Firestore, schema: ISchemaVideo): Promise<IResolvedVideo> {
    // Resolve channel
    const channelDoc = db.doc(`channels/${schema.channelID}`);
    const channelSnap = await channelDoc.get();
    const channelData = channelSnap.data();
    if(!channelData) {
        throw new Error();
    }
    const channelSchema = channelSchemaFromFirestore(channelData);
    const channel = await resolveChannel(db, channelSchema);

    // Build document
    return {
        id: schema.id,
        title: schema.title,
        description: schema.description,
        author: schema.author,
        channel: channel,
        muxData: schema.muxData,
        uploadDate: schema.uploadDate,
    };
}

// Obj -> Schema
export function videoSchemaFromResolved(video: IResolvedVideo): ISchemaVideo {
    return {
        id: video.id,
        title: video.title,
        author: video.author,
        description: video.description,
        channelID: video.channel.id,
        muxData: video.muxData,
        uploadDate: video.uploadDate,
    };
}

export function channelSchemaFromResolved(channel: IResolvedChannel): ISchemaChannel {
    return {
        id: channel.id,
        name: channel.name,
        owner: channel.owner,
    };
}



/*
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
        uploadDate: data['uploadDate'],
    };
}
*/
export function algoliaFromVideo(video: IResolvedVideo): IAlgoliaVideo {
    return {
        title: video.title,
        description: video.description,
        type: 'video',
        id: video.id,
        objectID: video.id,
        author: video.author,
        channelID: video.channel.id,
        uploadDate: video.uploadDate
    };
}

export function algoliaFromChannel(channel: IResolvedChannel): IAlgoliaChannel {
    return {
        id: channel.id,
        objectID: channel.id,
        name: channel.name,
        type: 'channel',
        owner: channel.owner,
    };
}