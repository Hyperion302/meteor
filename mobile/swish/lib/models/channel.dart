class Channel {
  final String id;
  final String owner;
  final String name;
  Channel.fromJSON(Map<String, dynamic> json)
      : id = json['id'],
        owner = json['owner'],
        name = json['name'];
}
