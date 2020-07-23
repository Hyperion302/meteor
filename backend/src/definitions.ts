export type tID = string;
export type tTimestamp = number;

export interface IServiceInvocationContext {
  auth: {
    userID: string;
    userIDInt: BigInt;
    elevated: boolean;
    token: IJWTToken;
  };
}

export interface IJWTToken {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  azp: string;
  gty: string;
  'https://swish.tv/swishflake': string;
}

/**
 * Generic error interface
 */
export interface IError {
  statusCode: number;
  service:
    | 'Gateway'
    | 'ChannelContent'
    | 'ChannelData'
    | 'Search'
    | 'VideoContent'
    | 'VideoData';
  message: string;
  longMessage?: string;
}

/**
 * Holder interface for our app configuration
 */
export interface IAppConfiguration {
  environment: string;
  searchIndex: string;
  bucket: string;
  dbPrefix: string;
  redisAddress: string;
  redisPort: number;
  redisDB: number;
  muxSubscription: string;
  auth: {
    jwks_uri: string;
    jwt_audience: string;
    jwt_issuer: string;
  };
  sql: {
    host: string;
    user: string;
    pass: string;
    databases: {
      channelData: string;
      videoContent: string;
      videoData: string;
    };
  };
  nodeID: number;
}
