export type tID = string;
export type tTimestamp = number;

export interface IServiceInvocationContext {
  auth: {
    userID: string;
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
}
