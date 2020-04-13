import 'package:flutter/material.dart';
import 'package:swish/models/channel.dart';
import 'package:swish/models/video.dart';
import 'package:swish/routes.dart';
import 'package:swish/services/auth.dart';
import 'package:swish/atomic_widgets/small_video_tile.dart';
import 'package:swish/services/video.dart';
import 'package:swish/utils.dart';

class SwishChannelScreen extends StatefulWidget {
  final Channel channel;
  SwishChannelScreen({Key key, this.channel}) : super(key: key);

  @override
  _SwishChannelScreenState createState() => _SwishChannelScreenState();
}

class _SwishChannelScreenState extends State<SwishChannelScreen> {
  Future<List<Video>> _videos;
  Future<String> _currentUser;

  @override
  void initState() {
    _currentUser = AuthService.token;
    _videos = VideoService.queryVideos(channel: widget.channel.id);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: 20.0,
          ),
          child: Column(
            children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios),
                    tooltip: 'Go Back',
                    onPressed: () {
                      Navigator.pop(context, false);
                    },
                  ),
                ],
              ),
              SizedBox(height: 20.0),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () async {
                    String currentUser = await _currentUser;
                    List<Video> videos = await VideoService.queryVideos(
                        channel: widget.channel.id);
                    setState(() {
                      _videos = Future.value(videos);
                    });
                    return videos;
                  },
                  child: ListView(
                    physics: AlwaysScrollableScrollPhysics(),
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          CircleAvatar(
                              backgroundImage: NetworkImage(
                                  getChannelIconURL(widget.channel.id, '128')),
                              radius: 64),
                          SizedBox(width: 20.0),
                          Flexible(
                            child: Text(
                              widget.channel.name,
                              overflow: TextOverflow.fade,
                              style: TextStyle(
                                fontSize: 32.0,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 20.0),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Videos',
                          style: TextStyle(
                            fontSize: 20.0,
                          ),
                        ),
                      ),
                      FutureBuilder(
                          future: _videos,
                          builder: (context, snapshot) {
                            if (snapshot.hasError) {
                              print(snapshot.error);
                              return Text('Error');
                            }
                            if (snapshot.hasData) {
                              if (snapshot.data.length == 0) {
                                return Text('This channel has no videos');
                              }
                              List<Widget> mappedVideos = <Widget>[
                                ...snapshot.data.map((Video video) {
                                  return InkWell(
                                      child: SwishSmallVideoTile(
                                          video: video,
                                          trailingAction: Container()),
                                      onTap: () {
                                        Navigator.pushNamed(
                                            context, playerRoute,
                                            arguments: video);
                                      });
                                })
                              ];
                              return Column(
                                children: mappedVideos,
                              );
                            }
                            return CircularProgressIndicator();
                          }),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
