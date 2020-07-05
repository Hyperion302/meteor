import { GenericError } from './generic';
import { tServiceName } from './definitions';

export class InvalidFieldError extends GenericError {
  constructor(service: tServiceName, field: string) {
    super(service, `Invalid field: ${field}`);
    this.name == this.constructor.name;
    this.status = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}
