import { Firestore } from '@google-cloud/firestore';
import { Storage, StorageOptions } from '@google-cloud/storage';
import { PubSub } from '@google-cloud/pubsub';
import algoliasearch from 'algoliasearch';
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub';

const production: boolean = process.env.NODE_ENV === 'prod';

console.log(`Running in production: ${production}`);

// #region Firestore
let firestoreOptions: FirebaseFirestore.Settings;
if (production) {
    firestoreOptions = {};
} else {
    firestoreOptions = {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    };
}

export const firestoreInstance = new Firestore(firestoreOptions);

// #endregion Firestore

// #region Storage
let storageOptions: StorageOptions;
if (production) {
    storageOptions = {};
} else {
    storageOptions = {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    };
}
export const storageInstance = new Storage(storageOptions);
// #endregion Storage

// #region Algolia
export const algoliaClientInstance = algoliasearch(
    process.env.ALGOLIAID,
    process.env.ALGOLIASECRET,
);
export const algoliaIndexInstance = algoliaClientInstance.initIndex(
    'dev_videos',
);
// #endregion Algolia

// #region PubSub
let pubsubOptions: ClientConfig;
if (production) {
    pubsubOptions = {};
} else {
    pubsubOptions = {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    };
}
export const pubsubSubscriptionID =
    process.env.MUXEVENTSUBSCRIPTIONID || 'swish-api';
export const pubsubClient = new PubSub(pubsubOptions);
export const pubsubSubscription = pubsubClient.subscription(
    pubsubSubscriptionID,
);
// #endregion PubSub
