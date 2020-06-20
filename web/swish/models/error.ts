export type TResource = 'channel' | 'video';

export class ResourceNotFoundError extends Error {
  constructor(resource: TResource, resourceID: string) {
    super(`Resource ${resource}:${resourceID} not found`);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super('Authorization Error');
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidInputError extends Error {
  constructor() {
    super('Invalid Arguments');
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ServerError extends Error {
  constructor() {
    super('Internal Server Error');
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PlatformError extends Error {
  constructor() {
    super(`${process.server ? 'Server' : 'Client'} platform not supported`);
    Error.captureStackTrace(this, this.constructor);
  }
}
