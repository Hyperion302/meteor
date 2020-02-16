export type tID = string;
export type tTimestamp = number;

/**
 * Generic error interface
 */
export interface IError {
    resource: any;
    message: string;
    longMessage?: string;
}
