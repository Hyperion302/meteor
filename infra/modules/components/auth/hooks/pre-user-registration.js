const crypto = require('crypto');
const EPOCH_BITS = 42;
const NODE_BITS = 10;
const NONCE_BITS = 12;
// First millisecond of 2020
const EPOCH = 1577836800000;

// A greatly reduced version of the Swishflake generator since I can't maintain a state in a hook
function getID(node, nonce) {
  const currentTimestamp = new Date().getTime() - EPOCH;
  return BigInt(
    `0b${currentTimestamp.toString(2).padStart(EPOCH_BITS, '0')}${node
      .toString(2)
      .padStart(NODE_BITS, '0')}${nonce.toString(2).padStart(NONCE_BITS, '0')}`,
  ).toString();
}

module.exports = function (user, context, cb) {
  const response = { user };
  // Hash the webtask information to get 'unique' node and nonce bits
  const hash = crypto.createHash('sha256');
  hash.update(context.webtask.id);
  const hashBuf = hash.digest();
  // The node uses the first and second bytes of the hash
  // I shift the second byte by 6 to only get the 2 MSB.  I then shift it back by 8 to position it for ORing with the first byte
  // This leaves a maximum of 10 bits to the node
  const node = hashBuf[0] | ((hashBuf[1] >> 6) << 8);
  // I use a similar method on the 3rd and 4th bytes for the nonce
  const nonce = hashBuf[2] | ((hashBuf[3] >> 6) << 8);

  response.user.app_metadata = {
    // I need better nonce and node numbers, otherwise the IDs won't be sufficiently random
    swishflake: getID(node, nonce),
  };

  cb(null, response);
};
