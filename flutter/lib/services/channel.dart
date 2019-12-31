import 'package:cloud_functions/cloud_functions.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/models/video.dart';

Future< Channel > createChannel(String name) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'createChannel',
  );
  // Call
  dynamic resp = await callable.call(<String, dynamic>{
    'name': name,
  });
  // return
  return Channel.fromFirestore(resp.data);
}

Future< void > deleteChannel(Channel channel) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'deleteChannel',
  );
  // Call
  await callable.call(<String, dynamic>{
    'channel': channel.id,
  });
}

Future< List< Video > > getVideos(Channel channel) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'getVideos',
  );
  // Call
  dynamic resp = await callable.call(<String, dynamic>{
    'channel': channel.id,
  });
  // Map response data
  List rawVideos = resp.data;
  List< Video > videos = rawVideos.map((video) {
    return Video.fromFirestore(video);
  }).toList();
  return videos;
}