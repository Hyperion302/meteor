import 'channel.dart';

class Content {
  final String assetID;
  final String playbackID;

  Content.fromJSON(Map<String, dynamic> json)
      : assetID = json['assetID'],
        playbackID = json['playbackID'];
}

class Video {
  final String id;
  final String author;
  final String title;
  final String description;
  final Channel channel;
  final Content content;
  final int uploadDate;

  Video.fromJSON(Map<String, dynamic> json)
      : id = json['id'],
        author = json['author'],
        title = json['title'],
        description = json['description'],
        uploadDate = json['uploadDate'],
        channel = Channel.fromJSON(json['channel']),
        content = Content.fromJSON(json['content']);
}
