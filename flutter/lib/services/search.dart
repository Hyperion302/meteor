import 'package:algolia/algolia.dart';
import 'package:meteor/models/search.dart';

class AlgoliaInstance {
  static final Algolia algolia = Algolia.init(
    applicationId: 'VB80DMXNZ8',
    apiKey: 'f2145d2a9dfb20ecfd4355f01eb43065',
  );
}

Future< List< AlgoliaObject > > searchVideos(String search) async {
  Algolia algolia = AlgoliaInstance.algolia;
  AlgoliaQuery query = algolia.instance.index('dev_videos').search(search);
  AlgoliaQuerySnapshot snap = await query.getObjects();
  List< AlgoliaObject > videos = snap.hits.map((AlgoliaObjectSnapshot objectSnap) {
    var type = objectSnap.data['type'];
    switch(type) {
      case 'video':
        return AlgoliaVideo.fromAlgolia(objectSnap.data);
      case 'channel':
        return AlgoliaChannel.fromAlgolia(objectSnap.data);
      default:
        throw Exception('Algolia object type $type not supported');
    }
  }).toList();

  return videos;
}