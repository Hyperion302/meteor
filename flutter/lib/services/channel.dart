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

Future< void > updateChannel(Channel oldChannel, Channel newChannel) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'updateChannel',
  );

  // Determine what fields changed
  Map< String, dynamic > args = {
    'channel': oldChannel.id,
  };
  if(oldChannel.name != newChannel.name) {
    args['name'] = newChannel.name;
  }

  // Call
  await callable.call(args);

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