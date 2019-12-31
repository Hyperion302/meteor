import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/material.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/services/video.dart';
import 'package:meteor/atomic_widgets/custom_card.dart';
import 'package:meteor/utils.dart';

class MeteorVideoSearchItem extends StatefulWidget {
  final AlgoliaVideo searchResult;

  MeteorVideoSearchItem({Key key, this.searchResult}) : super(key: key);

  @override
  _MeteorVideoSearchItemState createState() => _MeteorVideoSearchItemState();
}

class _MeteorVideoSearchItemState extends State<MeteorVideoSearchItem> {

  Future< Video > _video;

  @override
  void initState() {
    print(widget.searchResult.id);
    _video = getVideoById(widget.searchResult.id);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: FutureBuilder(
        future: _video,
        builder: (BuildContext context, snap) {
          if(snap.hasError) {
            CloudFunctionsException error = snap.error;
            print(error.message);
            return Text('error');
          }
          if(snap.hasData) {
            Video video = snap.data;
            return ListTile(
              title: Text(video.title),
              subtitle: Text('${video.channel.name} • ${formatTimestamp(video.uploadDate)}'),
              onTap: () {
                Navigator.pushNamed(context, playerRoute, arguments: video);
              }
            );
          }
          return ListTile(
            title: Text(widget.searchResult.title),
            subtitle: Text(widget.searchResult.channel.name),
            leading: CircularProgressIndicator(),
          );
        }
      ),
    );
  }
}