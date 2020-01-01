import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meteor/models/channel.dart';

Future< List< Channel > > getChannels(FirebaseUser user) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'user_getChannels',
  );
  // Call
  dynamic resp = await callable.call(<String, dynamic>{
    'user': user.uid,
  });
  // Map response data
  List< dynamic > rawChannels = resp.data;
  List< Channel > channels = rawChannels.map((channel) {
    return Channel.fromFirestore(channel);
  }).toList();
  return channels;
}