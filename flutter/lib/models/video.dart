import 'dart:io';

import 'package:meteor/models/channel.dart';

class MuxData {
  String status;
  String assetID;
  String playbackID;

  MuxData({this.status, this.assetID, this.playbackID});

  MuxData.fromFirestore(dynamic data) {
    status = data['status'];
    assetID = data['assetID'];
    playbackID = data['playbackID'];
  }
}

class Video {
  String id;
  String author;
  String title;
  Channel channel;
  MuxData muxData;
  int uploadDate;

  Video({this.channel, this.id, this.author, this.title, this.muxData, this.uploadDate});

  Video.fromFirestore(dynamic data) {
    id = data['id'];
    author = data['author'];
    title = data['title'];
    channel = Channel.fromFirestore(data['channel']);
    muxData = MuxData.fromFirestore(data['muxData']);
    uploadDate = data['uploadDate'];
  }

}

class AlgoliaVideo {
  String id;
  String title;
  String author;
  int uploadDate;
  AlgoliaChannel channel;

  AlgoliaVideo({this.id, this.title, this.author, this.channel});

  AlgoliaVideo.fromAlgolia(Map<String, dynamic> data) {
    id = data['id'];
    title = data['title'];
    author = data['author'];
    channel = AlgoliaChannel.fromAlgolia(data['channel']);
    uploadDate = data['uploadDate'];
  }
}

class VideoUpload {
  final String title;
  final File video;
  final String channel;

  VideoUpload({this.title, this.video, this.channel});
}