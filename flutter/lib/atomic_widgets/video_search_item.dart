import 'package:flutter/material.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/services/video.dart';

class MeteorVideoSearchItem extends StatefulWidget {
  final VideoSearchResult searchResult;

  MeteorVideoSearchItem({Key key, this.searchResult}) : super(key: key);

  @override
  _MeteorVideoSearchItemState createState() => _MeteorVideoSearchItemState();
}

class _MeteorVideoSearchItemState extends State<MeteorVideoSearchItem> {

  Future< Video > _video;

  @override
  void initState() {
    _video = getVideoById(widget.searchResult.videoId);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: FutureBuilder(
        future: _video,
        builder: (BuildContext context, snap) {
          if(snap.hasError) {
            print(snap.error.toString());
            return Text('error');
          }
          if(snap.hasData) {
            Video video = snap.data;
            return ListTile(
              title: Text(video.title),
              subtitle: Text(widget.searchResult.channelName),
              onTap: () {
                Navigator.pushNamed(context, playerRoute, arguments: video);
              }
            );
          }
          return ListTile(
            title: Text(widget.searchResult.title),
            subtitle: Text(widget.searchResult.channelName),
            leading: CircularProgressIndicator(),
          );
        }
      ),
    );
  }
}