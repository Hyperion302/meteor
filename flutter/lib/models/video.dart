import 'dart:io';

class Video {
  final String videoId;
  final String author;
  final String title;
  final String channel;
  String muxPlaybackId;
  String muxAssetId;

  Video({this.channel, this.videoId, this.author, this.title});
}

class VideoUpload {
  final String title;
  final File video;
  final String channel;

  VideoUpload({this.title, this.video, this.channel});
}