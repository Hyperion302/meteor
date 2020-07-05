import { GenericError } from './generic';
import { IChannelQuery } from '@services/ChannelDataService/definitions';
import { IVideoQuery } from '@services/VideoDataService/definitions';
import { tServiceName } from './definitions';

export class InvalidQueryError extends GenericError {
  constructor(service: tServiceName, query: IChannelQuery | IVideoQuery) {
    super(service, `Invalid query ${query}`);
    this.name = this.constructor.name;
    this.status = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}
