import 'package:cloud_functions/cloud_functions.dart';
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

  @override
  void initState() {
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
                    CloudFunctionsException e = snapshot.error;
                    print(e.message);
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
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, uploadRoute, arguments: widget.channel);
        },
        child: Icon(Icons.add),
      ),
    );
  }
}