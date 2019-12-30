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

class VideoSearchResult {
  final String videoId;
  final String channelId;
  final String channelName;
  final String title;

  VideoSearchResult({this.videoId, this.channelId, this.title, this.channelName});
}

class VideoUpload {
  final String title;
  final File video;
  final String channel;

  VideoUpload({this.title, this.video, this.channel});
}