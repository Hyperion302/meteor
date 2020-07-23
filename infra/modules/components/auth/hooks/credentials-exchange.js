module.exports = function (client, scope, audience, context, cb) {
  const access_token = {};
  access_token['https://swish.tv/swishflake'] = client.metadata.swishflake;
  cb(null, access_token);
};
