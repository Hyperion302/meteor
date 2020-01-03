import 'package:flappy_search_bar/flappy_search_bar.dart';
import 'package:flutter/material.dart';
import 'package:meteor/atomic_widgets/channel_tile.dart';
import 'package:meteor/atomic_widgets/large_video_tile.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/models/search.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/services/channel.dart';
import 'package:meteor/services/search.dart';
import 'package:meteor/services/video.dart';

class MeteorSearchScreen extends StatefulWidget {
  MeteorSearchScreen({Key key}) : super(key: key);

  @override
  _MeteorSearchScreenState createState() => _MeteorSearchScreenState();
}

class _MeteorSearchScreenState extends State<MeteorSearchScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: 20.0,
          ),
          child: SearchBar<AlgoliaObject>(
            onSearch: searchVideos,
            onItemFound: (AlgoliaObject result, int index) {
              if(result.type == 'video') {
                return futureBuilderVideo(result);
              }
              if(result.type == 'channel') {
                return futureBuilderChannel(result);
              }
              return Container();
            },
          ),
        )
      ),
    );
  }
  FutureBuilder< Video > futureBuilderVideo(AlgoliaVideo result) {
    return FutureBuilder(
      future: getVideoById(result.id),
      builder: (BuildContext context, snap) {
        if(snap.hasError) {
          return Text('');
        }
        if(snap.hasData) {
          return MeteorLargeVideoTile(
            video: snap.data,
            showAge: true,
            showChannelName: true,
            onTap: () {
              Navigator.pushNamed(context, playerRoute, arguments: snap.data);
            },
          );
        }
        return ListTile(
          title: Text(result.title),
          subtitle: Text('Loading'),
          leading: CircularProgressIndicator(),
        );
      },
    );
  }

  FutureBuilder< Channel > futureBuilderChannel(AlgoliaChannel result) {
    return FutureBuilder(
      future: getChannelById(result.id),
      builder: (BuildContext context, snap) {
        if(snap.hasError) {
          return Text('');
        }
        if(snap.hasData) {
          return MeteorChannelTile(
            channel: snap.data,
            trailingAction: null,
            onTap: () {
              Navigator.pushNamed(context, channelRoute, arguments: snap.data);
            }
          );
        }
        return ListTile(
          title: Text(result.name),
          subtitle: Text('Loading'),
          leading: CircularProgressIndicator()
        );
      }
    );
  }
  
}