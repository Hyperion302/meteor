import 'dart:io';

class Video {
  final String videoId;
  final String author;
  final String title;
  String muxPlaybackId;
  String muxAssetId;

  Video({this.videoId, this.author, this.title});
}

class VideoUpload {
  final String title;
  final File video;

  VideoUpload({this.title, this.video});
}