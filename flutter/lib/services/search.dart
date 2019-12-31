import 'package:algolia/algolia.dart';
import 'package:meteor/models/video.dart';

class AlgoliaInstance {
  static final Algolia algolia = Algolia.init(
    applicationId: 'VB80DMXNZ8',
    apiKey: 'f2145d2a9dfb20ecfd4355f01eb43065',
  );
}

Future< List< AlgoliaVideo > > searchVideos(String search) async {
  Algolia algolia = AlgoliaInstance.algolia;
  AlgoliaQuery query = algolia.instance.index('dev_videos').search(search);
  AlgoliaQuerySnapshot snap = await query.getObjects();
  List< AlgoliaVideo > videos = snap.hits.map((AlgoliaObjectSnapshot objectSnap) {
    return AlgoliaVideo.fromAlgolia(objectSnap.data);
  }).toList();

  return videos;
}