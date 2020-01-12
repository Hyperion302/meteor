class Channel {
  String id;
  String owner;
  String name;
  String iconStatus;

  Channel({this.id, this.owner, this.name, this.iconStatus});

  Channel.fromFirestore(dynamic data) {
    id = data['id'];
    owner = data['owner'];
    name = data['name'];
    iconStatus = data['iconStatus'];
  }
}
