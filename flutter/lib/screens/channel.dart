import 'dart:io';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
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
  File _newIcon;
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
                          Navigator.pop(context, false);
                        },
                      ),
                      
                    ],
                  ),
                  FutureBuilder(
                    future: _currentUser,
                    builder: (BuildContext context, snap) {
                      if(snap.hasError) {
                        return Container();
                      }
                      if(snap.hasData && snap.data.uid == widget.channel.owner) {
                        return IconButton(
                          icon: Icon(Icons.settings),
                          tooltip: 'Edit channel settings',
                          onPressed: () {
                            _promptForUpdate(widget.channel);
                          },
                        );
                      }
                      return Container();
                    },
                  )
                  
                ],
              ),
              SizedBox(
                height: 20.0
              ),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () async {
                    FirebaseUser currentUser = await _currentUser;
                    List< Video > videos = await getVideos(widget.channel);
                    setState(() {
                      _videos = Future.value(videos);
                    });
                    return videos;
                  },
                  child: SingleChildScrollView(
                    physics: AlwaysScrollableScrollPhysics(),
                    child: Column(
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            _buildIcon(),
                            SizedBox(
                              width: 20.0
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
                                    _navigateToPlayer(video);
                                  }
                                );
                              })];
                              return Column(
                                children: mappedVideos,
                              );
                            }
                            return CircularProgressIndicator();
                          }
                        ),
                      ],
                    ),
                  ),
                ),
              ),
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

  Widget _buildIcon() {
    return FutureBuilder(
      future: _currentUser,
      builder: (BuildContext context, snap) {
        if(snap.hasError) {
          return CircleAvatar(
            backgroundImage: NetworkImage('https://storage.googleapis.com/meteor-247517.appspot.com/channelAssets/${widget.channel.id}/thumb128'),
            radius: 64
          );
        }
        if(snap.hasData) {
          if(snap.data.uid == widget.channel.owner) {
            return GestureDetector(
              onTap: () {
                ImagePicker.pickImage(source: ImageSource.gallery).then((image) {
                  if(image != null) {
                    setState(() {
                      _newIcon = image;
                    });
                    _promptForNewIcon(widget.channel);
                  }
                });
              },
              child: Stack(
                alignment: Alignment.topRight,
                children: <Widget>[
                  CircleAvatar(
                    backgroundImage: NetworkImage('https://storage.googleapis.com/meteor-247517.appspot.com/channelAssets/${widget.channel.id}/thumb128'),
                    radius: 64
                  ),
                  ClipOval(
                    child: Container(
                      child: Icon(Icons.add_photo_alternate, 
                        size: 32.0,
                      ),
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            );
          }
          return CircleAvatar(
            backgroundImage: NetworkImage('https://storage.googleapis.com/meteor-247517.appspot.com/channelAssets/${widget.channel.id}/thumb128'),
            radius: 64
          );
        }
        return CircleAvatar(
          backgroundImage: NetworkImage('https://storage.googleapis.com/meteor-247517.appspot.com/channelAssets/${widget.channel.id}/thumb128'),
          radius: 64
        );
      },
    );
  }

  _promptForNewIcon(Channel channel) async {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Change Icon'),
          content: Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text('Old'),
                  CircleAvatar(
                    radius: 32,
                    backgroundImage: NetworkImage('https://storage.googleapis.com/meteor-247517.appspot.com/channelAssets/${channel.id}/thumb128'),
                  )
                ],
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text('New'),
                  CircleAvatar(
                    radius: 32,
                    backgroundImage: FileImage(_newIcon),
                  )
                ],
              ),
            ],
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
                updateChannelIcon(channel)
                .then((_) {
                  print('Started upload');
                  StorageReference videoRef = FirebaseStorage.instance.ref().child('channelAssets/${channel.id}/icon');
                  StorageUploadTask uploadTask = videoRef.putFile(_newIcon);
                  return uploadTask.onComplete;
                })
                .then((_) {
                  print('Upload finished');
                  Navigator.pop(context, false);
                })
                .then((_) {
                  Navigator.pop(context, true);
                });
              },
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.0),
              ),
              color: Theme.of(context).primaryColor,
              child: Text('Save'),
            ),

          ],
        );
      }
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

  _navigateToPlayer(Video video) async {
    var shouldRefresh = await Navigator.pushNamed(context, playerRoute, arguments: video);
    if(shouldRefresh) {
      setState(() {
        _videos = getVideos(widget.channel);
      });
    }
  }
}