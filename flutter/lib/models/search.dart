class AlgoliaObject {
  String type;

  AlgoliaObject({this.type});

  AlgoliaObject.fromAlgolia(Map<String, dynamic> data) {
    type = data['type'];
  }
}

class AlgoliaVideo extends AlgoliaObject {
  String id;
  String title;
  String author;
  int uploadDate;
  String channelID;
  String description;

  AlgoliaVideo({this.id, this.title, this.author, this.channelID, String type}) : super.fromAlgolia(null);

  AlgoliaVideo.fromAlgolia(Map<String, dynamic> data) : super.fromAlgolia(data) {
    id = data['id'];
    title = data['title'];
    author = data['author'];
    channelID = data['channelID'];
    uploadDate = data['uploadDate'];
    description = data['description'];
  }
}

class AlgoliaChannel extends AlgoliaObject {
  String id;
  String name;
  String owner;

  AlgoliaChannel({this.id, this.name, this.owner}) : super.fromAlgolia(null);

  AlgoliaChannel.fromAlgolia(Map<String, dynamic> data) : super.fromAlgolia(data) {
    id = data['id'];
    name = data['name'];
    owner = data['owner'];
  }
}