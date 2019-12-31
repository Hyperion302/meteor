import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/services/channel.dart';
import 'package:meteor/atomic_widgets/video_list_item.dart';

class MeteorChannelScreen extends StatefulWidget {
  final Channel channel;
  MeteorChannelScreen({Key key, this.channel}) : super(key: key);

  @override
  _MeteorChannelScreenState createState() => _MeteorChannelScreenState();
}

class _MeteorChannelScreenState extends State<MeteorChannelScreen> {
  Future< List< Video > > _videos;
  Future< FirebaseUser > _currentUser;

  @override
  void initState() {
    _currentUser = FirebaseAuth.instance.currentUser();
    _videos = getVideos(widget.channel);
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
                children: <Widget>[
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios),
                    tooltip: 'Go Back',
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                  Text('${widget.channel.name}',
                    style: TextStyle(
                      fontSize: 32.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 20.0
              ),
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Videos',
                  style: TextStyle(
                    fontSize: 20.0,
                  ),
                ),
              ),
              FutureBuilder(
                future: _videos,
                builder: (context, snapshot) {
                  if(snapshot.hasError) {
                    print(snapshot.error);
                    return Text('Error');
                  }
                  if(snapshot.hasData) {
                    if(snapshot.data.length == 0) {
                      return Text('This channel has no videos');
                    }
                    List< Widget > mappedVideos = <Widget>[...snapshot.data.map((Video video) {
                      return InkWell(
                        child: MeteorVideoListItem(video),
                        onTap: () {
                          Navigator.pushNamed(context, playerRoute, arguments: video);
                        }
                      );
                    })];
                    return Column(
                      children: mappedVideos,
                    );
                  }
                  return CircularProgressIndicator();
                }
              )
            ],
          ),
        ),
      ),
      floatingActionButton: FutureBuilder(
        future: _currentUser,
        builder: (BuildContext context, snap) {
          if(snap.hasError) {
            return Container(
              width: 0,
              height: 0,
            );
          }
          if(snap.hasData) {
            if(snap.data.uid == widget.channel.owner) {
              return FloatingActionButton(
                onPressed: () {
                  _navigateToCreateVideo();
                },
                child: Icon(Icons.add),
              );
            }
            return Container(
              width: 0,
              height: 0,
            );
          }
          return Container(
              width: 0,
              height: 0,
            );
        },
      ),
    );
  }

  _navigateToCreateVideo() async {
    var shouldRefresh = await Navigator.pushNamed(context, uploadRoute, arguments: widget.channel);
    if(shouldRefresh) {
      setState(() {
        _videos = getVideos(widget.channel);
      });
    }
  }
}