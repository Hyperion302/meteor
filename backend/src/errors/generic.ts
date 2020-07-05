import { tServiceName } from './definitions';

export class GenericError extends Error {
  status: number;

  constructor(service: tServiceName, message: string) {
    super(`[${service}] ${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}
