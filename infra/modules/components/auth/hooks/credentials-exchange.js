module.exports = function (client, scope, audience, context, cb) {
  const access_token = {};
  access_token['https://swish.tv/swishflake'] = '73946096308584448';
  access_token.scope = scope;
  cb(null, access_token);
};
