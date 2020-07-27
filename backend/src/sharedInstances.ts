import { Storage } from '@google-cloud/storage';
import { PubSub } from '@google-cloud/pubsub';
import algoliasearch from 'algoliasearch';
import { IAppConfiguration } from './definitions';
import redis from 'redis';
import { SwishflakeGenerator } from '@/SwishflakeGenerator';

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
    runtimeEnv == 'prod' ? process.env.PROD_DBPREFIX : process.env.DEV_DBPREFIX,
  muxSubscription:
    runtimeEnv == 'prod'
      ? process.env.PROD_MUXEVENTSUBSCRIPTION
      : process.env.DEV_MUXEVENTSUBSCRIPTION,
  redisAddress:
    runtimeEnv == 'prod'
      ? process.env.PROD_REDIS_ADDR
      : process.env.DEV_REDIS_ADDR,
  redisPort:
    runtimeEnv == 'prod'
      ? parseInt(process.env.PROD_REDIS_PORT, 10)
      : parseInt(process.env.DEV_REDIS_PORT),
  redisDB:
    runtimeEnv == 'prod'
      ? parseInt(process.env.PROD_REDIS_DB, 10)
      : parseInt(process.env.DEV_REDIS_DB, 10),
  auth: {
    jwks_uri: process.env.JWKS_URI,
    jwt_audience: process.env.JWT_AUDIENCE,
    jwt_issuer: process.env.JWT_ISSUER,
  },
  sql: {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    pass: process.env.SQL_PASS,
    databases: {
      videoContent: process.env.SQL_VIDEO_CONTENT_DB,
      videoData: process.env.SQL_VIDEO_DATA_DB,
      channelData: process.env.SQL_CHANNEL_DATA_DB,
    },
  },
  nodeID: parseInt(process.env.NODE_ID),
};
// //#endregion App Configuration

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

// #region Redis
export const redisClient = redis.createClient({
  host: appConfig.redisAddress,
  port: appConfig.redisPort,
  db: appConfig.redisDB,
  detect_buffers: true,
});
// #endregion Redis

// #region Swishflake
// Meant to be used as a singleton per node
export const swishflakeGenerator = new SwishflakeGenerator(appConfig.nodeID);
// #endregion Swishflake
