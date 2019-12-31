class Channel {
  String id;
  String owner;
  String name;

  Channel({this.id, this.owner, this.name});

  Channel.fromFirestore(dynamic data) {
    id = data['id'];
    owner = data['owner'];
    name = data['name'];
  }
}

class AlgoliaChannel {
  String id;
  String name;
  String owner;

  AlgoliaChannel({this.id, this.name, this.owner});

  AlgoliaChannel.fromAlgolia(Map<String, dynamic> data) {
    id = data['id'];
    name = data['name'];
    owner = data['owner'];
  }
}