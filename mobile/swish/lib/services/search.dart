import 'package:algolia/algolia.dart';
import 'package:swish/models/search.dart';

class SearchService {
  static final Algolia algoliaInstance = Algolia.init(
    applicationId: 'VB80DMXNZ8',
    apiKey: 'f2145d2a9dfb20ecfd4355f01eb43065',
  );

  static Future<List<AlgoliaObject>> searcb(String queryString) async {
    AlgoliaQuery queryObject =
        algoliaInstance.instance.index('prod_swish').search(queryString);
    AlgoliaQuerySnapshot snap = await queryObject.getObjects();
    List<AlgoliaObject> videos =
        snap.hits.map((AlgoliaObjectSnapshot objectSnap) {
      var type = objectSnap.data['type'];
      switch (type) {
        case 'video':
          return AlgoliaVideo.fromAlgoliaData(
              objectSnap.data, objectSnap.objectID);
        case 'channel':
          return AlgoliaChannel.fromAlgoliaData(
              objectSnap.data, objectSnap.objectID);
        default:
          throw Exception('Algolia object type $type not supported');
      }
    }).toList();

    return videos;
  }
}
