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
  String description;
  Channel channel;
  MuxData muxData;
  int uploadDate;

  Video({this.channel, this.id, this.author, this.title, this.muxData, this.uploadDate, this.description});

  Video.fromFirestore(dynamic data) {
    id = data['id'];
    author = data['author'];
    title = data['title'];
    channel = Channel.fromFirestore(data['channel']);
    muxData = MuxData.fromFirestore(data['muxData']);
    uploadDate = data['uploadDate'];
    description = data['description'];
  }

}

class VideoUpload {
  final String title;
  final File video;
  final String channelID;
  final String description;

  VideoUpload({this.title, this.video, this.channelID, this.description});
}