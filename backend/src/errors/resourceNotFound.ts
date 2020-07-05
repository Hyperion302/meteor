import { GenericError } from './generic';
import { tServiceName, tResourceName } from './definitions';

export class ResourceNotFoundError extends GenericError {
  constructor(
    service: tServiceName,
    resource: tResourceName,
    resourceID: string,
  ) {
    super(service, `Resource ${resource}:${resourceID} not found`);
    this.name = this.constructor.name;
    this.status = 404;
    Error.captureStackTrace(this, this.constructor);
  }
}
