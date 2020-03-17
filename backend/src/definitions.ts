export type tID = string;
export type tTimestamp = number;

export interface IServiceInvocationContext {
    auth: {
        userID: string;
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
