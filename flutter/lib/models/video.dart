import 'dart:io';

class Video {
  final String videoId;
  final String author;
  final String title;
  final String channel;
  final String muxPlaybackId;
  final String muxAssetId;

  Video({this.channel, this.videoId, this.author, this.title, this.muxPlaybackId, this.muxAssetId});
}

class VideoUpload {
  final String title;
  final File video;
  final String channel;

  VideoUpload({this.title, this.video, this.channel});
}