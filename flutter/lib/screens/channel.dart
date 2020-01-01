import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/services/channel.dart';
import 'package:meteor/atomic_widgets/small_video_tile.dart';
import 'package:meteor/services/video.dart';

class MeteorChannelScreen extends StatefulWidget {
  final Channel channel;
  MeteorChannelScreen({Key key, this.channel}) : super(key: key);

  @override
  _MeteorChannelScreenState createState() => _MeteorChannelScreenState();
}

class _MeteorChannelScreenState extends State<MeteorChannelScreen> {
  Future< List< Video > > _videos;
  Future< FirebaseUser > _currentUser;
  final _formKey = GlobalKey<FormState>();
  TextEditingController _updateFormNameController;

  @override
  void initState() {
    _currentUser = FirebaseAuth.instance.currentUser();
    _videos = getVideos(widget.channel);
    _updateFormNameController = TextEditingController(
      text: widget.channel.name,
    );
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
                  IconButton(
                    icon: Icon(Icons.settings),
                    tooltip: 'Edit channel settings',
                    onPressed: () {
                      _promptForUpdate(widget.channel);
                    },
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
                        child: MeteorSmallVideoTile(
                          video: video, 
                          trailingAction: FutureBuilder(
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
                                  return IconButton(
                                    onPressed: () {
                                      _promptForDelete(video);
                                    },
                                    icon: Icon(
                                      Icons.delete_forever,
                                      color: Colors.black38,
                                    ),
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
                        ),
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

  _promptForUpdate(Channel channel) async {
    // No reload since I can't reload a static channel argument, navigate back instead
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Channel Settings'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                TextFormField(
                  controller: _updateFormNameController,
                  decoration: InputDecoration(
                    labelText: 'Channel Name',
                  ),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            FlatButton(
              onPressed: () {
                Navigator.pop(context, false);
              },
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.0),
              ),
              child: Text('Cancel'),
            ),
            RaisedButton(
              onPressed: () {
                if(_formKey.currentState.validate()) {
                  // Send update
                  Channel newChannel = Channel(
                    id: null,
                    name: _updateFormNameController.value.text,
                    owner: null
                  );
                  updateChannel(widget.channel, newChannel)
                  .then((_) {
                    // Double pop and trigger refresh
                    Navigator.pop(context, false);
                  })
                  .then((_) {
                    Navigator.pop(context, true);
                  }); 
                }
              },
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.0),
              ),
              color: Theme.of(context).primaryColor,
              child: Text('Save'),
            ),
          ],
        );
      },
    );
  }

  _promptForDelete(Video video) async {
    bool shouldReload = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Delete \'${video.title}\'?'),
          content: Text('This will delete all of it\'s videos and can\'t be undone.'),
          actions: <Widget>[
            FlatButton(
              onPressed: () {
                Navigator.pop(context, false);
              },
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.0),
              ),
              child: Text('Cancel'),
            ),
            RaisedButton(
              onPressed: () {
                deleteVideo(video).then((_) {
                  Navigator.pop(context, true);
                });
              },
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.0),
              ),
              color: Theme.of(context).primaryColor,
              child: Text('Delete'),
            ),
          ],
        );
      },
    );
    if(shouldReload) {
      setState(() {
        _videos = getVideos(widget.channel);
      });
    }
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