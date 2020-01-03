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
