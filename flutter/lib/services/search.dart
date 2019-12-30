import 'package:algolia/algolia.dart';
import 'package:meteor/models/video.dart';

class AlgoliaInstance {
  static final Algolia algolia = Algolia.init(
    applicationId: 'VB80DMXNZ8',
    apiKey: 'f2145d2a9dfb20ecfd4355f01eb43065',
  );
}

Future< List< VideoSearchResult > > searchVideos(String search) async {
  Algolia algolia = AlgoliaInstance.algolia;
  AlgoliaQuery query = algolia.instance.index('dev_videos').search(search);
  AlgoliaQuerySnapshot snap = await query.getObjects();
  List< VideoSearchResult > videos = snap.hits.map((AlgoliaObjectSnapshot objectSnap) {
    return VideoSearchResult(
      title: objectSnap.data['title'],
      channelId: objectSnap.data['channel']['objectId'],
      videoId: objectSnap.data['objectId'],
      channelName: objectSnap.data['channel']['name'],
    );
  }).toList();

  return videos;
}