import { IChannelQuery } from './services/ChannelDataService/definitions';
import { IVideoQuery } from './services/VideoDataService/definitions';

export type tServiceName =
  | 'Gateway'
  | 'ChannelContent'
  | 'ChannelData'
  | 'Search'
  | 'VideoContent'
  | 'VideoData';

export type tResourceName = 'channel' | 'video' | 'videoContent';

export class GenericError extends Error {
  status: number;

  constructor(service: tServiceName, message: string) {
    super(`[${service}] ${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthorizationError extends GenericError {
  constructor(service: tServiceName, action: string) {
    super(service, `User unauthorized to ${action}`);
    this.name == this.constructor.name;
    this.status = 403;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ResourceNotFoundError extends GenericError {
  constructor(
    service: tServiceName,
    resource: tResourceName,
    resourceID: string,
  ) {
    super(service, `Resource ${resource}:${resourceID} not found`);
    this.name == this.constructor.name;
    this.status = 404;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidQueryError extends GenericError {
  constructor(service: tServiceName, query: IChannelQuery | IVideoQuery) {
    super(service, `Invalid query ${query}`);
    this.name == this.constructor.name;
    this.status = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends GenericError {
  constructor(service: tServiceName, message: string) {
    super(service, message);
    this.name == this.constructor.name;
    this.status = 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidFieldError extends GenericError {
  constructor(service: tServiceName, field: string) {
    super(service, `Invalid field: ${field}`);
    this.name == this.constructor.name;
    this.status = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}
