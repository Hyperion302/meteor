import { GenericError } from './generic';
import { tServiceName } from './definitions';

export class AuthorizationError extends GenericError {
  constructor(service: tServiceName, action: string) {
    super(service, `User unauthorized to ${action}`);
    this.name = this.constructor.name;
    this.status = 403;
    Error.captureStackTrace(this, this.constructor);
  }
}
