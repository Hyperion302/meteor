import 'package:meta/meta.dart';

class AlgoliaObject {
  final String type;

  AlgoliaObject({@required this.type});
}

class AlgoliaVideo extends AlgoliaObject {
  String id;
  String title;
  String description;
  int uploadDate;
  double watchtime;

  AlgoliaVideo({this.id, this.title, this.description, this.uploadDate})
      : super(type: 'video');

  AlgoliaVideo.fromAlgoliaData(Map<String, dynamic> json, String objectID)
      : super(type: 'video') {
    id = objectID;
    title = json['title'];
    description = json['description'];
    uploadDate = json['uploadDate'];
    watchtime = json['watchtime'];
  }
}

class AlgoliaChannel extends AlgoliaObject {
  String id;
  String name;

  AlgoliaChannel({this.id, this.name}) : super(type: 'channel');

  AlgoliaChannel.fromAlgoliaData(Map<String, dynamic> json, String objectID)
      : super(type: 'channel') {
    print(json);
    id = objectID;
    name = json['name'];
  }
}
