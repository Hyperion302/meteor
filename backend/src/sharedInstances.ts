import { Firestore } from '@google-cloud/firestore';
import { Storage, StorageOptions } from '@google-cloud/storage';
import { PubSub } from '@google-cloud/pubsub';
import algoliasearch from 'algoliasearch';
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub';
import { IAppConfiguration } from './definitions';

const runtimeEnv = process.env.RUNTIMEENV;

console.log(`Running in: ${runtimeEnv}`);

// #region App Configuration
export const appConfig: IAppConfiguration = {
    environment: runtimeEnv,
    searchIndex:
        runtimeEnv == 'prod' ? process.env.PROD_INDEX : process.env.DEV_INDEX,
    bucket:
        runtimeEnv == 'prod' ? process.env.PROD_BUCKET : process.env.DEV_BUCKET,
    dbPrefix:
        runtimeEnv == 'prod'
            ? process.env.PROD_DBPREFIX
            : process.env.DEV_DBPREFIX,
    muxSubscription:
        runtimeEnv == 'prod'
            ? process.env.PROD_MUXEVENTSUBSCRIPTION
            : process.env.DEV_MUXEVENTSUBSCRIPTION,
};
// //#endregion App Configuration

// #region Firestore
export const firestoreInstance = new Firestore({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// #endregion Firestore

// #region Storage
export const storageInstance = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
// #endregion Storage

// #region Algolia
export const algoliaClientInstance = algoliasearch(
    process.env.ALGOLIAID,
    process.env.ALGOLIASECRET,
);
export const algoliaIndexInstance = algoliaClientInstance.initIndex(
    appConfig.searchIndex,
);
// #endregion Algolia

// #region PubSub
export const pubsubClient = new PubSub({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
export const pubsubSubscription = pubsubClient.subscription(
    appConfig.muxSubscription,
);
// #endregion PubSub
