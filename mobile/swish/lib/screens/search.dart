import 'package:flappy_search_bar/flappy_search_bar.dart';
import 'package:flutter/material.dart';
import 'package:swish/atomic_widgets/channel_tile.dart';
import 'package:swish/atomic_widgets/large_video_tile.dart';
import 'package:swish/models/channel.dart';
import 'package:swish/models/search.dart';
import 'package:swish/models/video.dart';
import 'package:swish/routes.dart';
import 'package:swish/services/channel.dart';
import 'package:swish/services/search.dart';
import 'package:swish/services/video.dart';

class SwishSearchScreen extends StatefulWidget {
  SwishSearchScreen({Key key}) : super(key: key);

  @override
  _SwishSearchScreenState createState() => _SwishSearchScreenState();
}

class _SwishSearchScreenState extends State<SwishSearchScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: 20.0,
        ),
        child: SearchBar<AlgoliaObject>(
          onSearch: SearchService.searcb,
          onItemFound: (AlgoliaObject result, int index) {
            if (result.type == 'video') {
              return futureBuilderVideo(result);
            }
            if (result.type == 'channel') {
              return futureBuilderChannel(result);
            }
            return Container();
          },
        ),
      )),
    );
  }

  FutureBuilder<Video> futureBuilderVideo(AlgoliaVideo result) {
    return FutureBuilder(
      future: VideoService.getVideo(id: result.id),
      builder: (BuildContext context, snap) {
        if (snap.hasError) {
          return Text('');
        }
        if (snap.hasData) {
          return SwishLargeVideoTile(
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

  FutureBuilder<Channel> futureBuilderChannel(AlgoliaChannel result) {
    return FutureBuilder(
        future: ChannelService.getChannel(id: result.id),
        builder: (BuildContext context, snap) {
          if (snap.hasError) {
            return Text('');
          }
          if (snap.hasData) {
            print(snap.data.name);
            return SwishChannelTile(
                channel: snap.data,
                trailingAction: null,
                onTap: () {
                  Navigator.pushNamed(context, channelRoute,
                      arguments: snap.data);
                });
          }
          return ListTile(
              title: Text(result.name),
              subtitle: Text('Loading'),
              leading: CircularProgressIndicator());
        });
  }
}
