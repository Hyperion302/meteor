const util = require('util');
const crypto = require('crypto');
const pubsub = require('@google-cloud/pubsub');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.entry = (req, res) => {
  console.log(JSON.stringify(req.headers));
  if (!req.header('Mux-Signature')) {
    console.log('Missing header Mux-Signature');
    res.status(500).send('Invalid Header');
    return;
  }
  let muxSignature;
  if (util.isArray(req.header('Mux-Signature'))) {
    muxSignature = req.header('Mux-Signature')[0];
  } else {
    muxSignature = req.header('Mux-Signature');
  }
  const splitSignature = muxSignature.split(',');
  // Pulls the number after t=
  const signatureTimestamp = splitSignature[0].split('=')[1];
  // Pulls the hash after the v1=
  const signature = splitSignature[1].split('=')[1];
  const payload = `${signatureTimestamp}.${JSON.stringify(req.body)}`;
  const hmac = crypto.createHmac('sha256', process.env.MUXWEBHOOKSECRET);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  // Check expected signature against hashed body
  if (digest !== signature) {
    console.log('Mismatch error');
    console.log(`Digest: ${digest}`);
    console.log(`Signature: ${signature}`);
    res.status(500).send('Invalid Header');
    return;
  }
  // Check time for tolerance
  const tDiff = Math.abs(
    parseInt(signatureTimestamp) - Math.floor(Date.now() / 1000),
  );
  if (tDiff > parseInt(process.env.TIMETOLERANCE)) {
    console.log('Timestamp out of tolernace');
    console.log(`Timestamp difference: ${tDiff}`);
    res.status(500).send('Invalid Header');
    return;
  }
  console.log(`Successfully authenticated body: ${JSON.stringify(req.body)}`);

  // Send as pubsub message
  const topic = process.env.PUBSUBTOPIC || 'mux-events';
  const pubsubClient = new pubsub.PubSub();
  const pubsubTopic = pubsubClient.topic(topic);
  const pubsubPayload = Buffer.from(JSON.stringify(req.body));
  pubsubTopic
    .publish(pubsubPayload)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      // Don't retry
      res.sendStatus(200);
      console.error(e);
    });
};
