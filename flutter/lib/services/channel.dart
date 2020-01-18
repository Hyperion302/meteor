import 'package:cloud_functions/cloud_functions.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/models/video.dart';

Future< Channel > createChannel(String name, bool icon) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'channel_createChannel',
  );
  // Call
  dynamic resp = await callable.call(<String, dynamic>{
    'name': name,
    'iconStatus': icon ? 'expected' : 'none',
  });
  // return
  return Channel.fromFirestore(resp.data);
}

Future< void > deleteChannel(Channel channel) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'channel_deleteChannel',
  );
  // Call
  await callable.call(<String, dynamic>{
    'channel': channel.id,
  });
}

Future< void > updateChannel(Channel oldChannel, Channel newChannel, {bool newIcon = false}) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'channel_updateChannel',
  );

  // Determine what fields changed
  Map< String, dynamic > args = {
    'channel': oldChannel.id,
    'icon': newIcon,
  };
  if(oldChannel.name != newChannel.name) {
    args['name'] = newChannel.name;
  }

  // Call
  await callable.call(args);

}

// Variation that calls channel_updateChannel with proper args
Future< void > updateChannelIcon(Channel channel) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'channel_updateChannel',
  );
  await callable.call({
    'channel': channel.id,
    'icon': true,
  });
}

Future< Channel > getChannelById(String id) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'channel_getChannel',
  );
  // Allocate ID
  dynamic resp = await callable.call(<String, dynamic>{
    'channel': id,
  });
  return Channel.fromFirestore(resp.data);
}

Future< List< Video > > getVideos(Channel channel) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'channel_getVideos',
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