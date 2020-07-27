import { NODE_BITS, NONCE_BITS, EPOCH_BITS, EPOCH } from '@/constants';
import { InternalError } from './errors';
// Inspired by https://github.com/twitter/snowflake/tree/snowflake-2010
export class SwishflakeGenerator {
  maxNode = Math.pow(2, NODE_BITS);
  maxNonce = Math.pow(2, NONCE_BITS);

  nonce: number = 0;
  node: number;
  lastTimestamp: number;
  lastID: string;

  constructor(nodeID: number) {
    if (nodeID < 0 || nodeID > this.maxNode) {
      // FIXME: Error handling
      this.node = 0;
      return;
    }
    this.node = nodeID;
  }

  nextID(): string {
    let currentTimestamp = this.timestamp();
    if (currentTimestamp < this.lastTimestamp) {
      return null;
    }
    if (currentTimestamp === this.lastTimestamp) {
      // Increment the nonce
      this.nonce++;
      if (this.nonce > this.maxNonce) {
        // Ran out of IDs in this ID space, must block until the next millisecond
        while (currentTimestamp === this.lastTimestamp) {
          currentTimestamp = this.timestamp();
        }
      }
    } else {
      // Reset the nonce to begin counting from 0 again
      this.nonce = 0;
    }
    this.lastTimestamp = currentTimestamp;
    const id = BigInt(
      `0b${currentTimestamp
        .toString(2)
        .padStart(EPOCH_BITS, '0')}${this.node
        .toString(2)
        .padStart(NODE_BITS, '0')}${this.nonce
        .toString(2)
        .padStart(NONCE_BITS, '0')}`,
    ).toString();
    // Sanity check
    if (id === this.lastID) {
      throw new InternalError('Gateway', `ID COLLISION @ ${id}`);
    }
    this.lastID = id;
    return id;
  }

  timestamp(): number {
    return new Date().getTime() - EPOCH;
  }
}
