import { GenericError } from './generic';
import { tServiceName } from './definitions';

export class InternalError extends GenericError {
  constructor(service: tServiceName, message: string) {
    super(service, message);
    this.name = this.constructor.name;
    this.status = 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
