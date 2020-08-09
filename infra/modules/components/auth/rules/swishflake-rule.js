function(user, context, callback) {
  var namespace = 'https://swish.tv';
  var swishflake = user.app_metadata.swishflake;
  context.idToken[`${namespace}/swishflake`] = swishflake;
  context.accessToken[`${namespace}/swishflake`] = swishflake;

  callback(null, user, context);
}
