function(user, context, callback) {
  context.idToken['http://swish.tv/swishflake'] = user.app_metadata.swishflake

  callback(null, user, context);
}
