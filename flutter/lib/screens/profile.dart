import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/services/channel.dart';
import 'package:meteor/services/user.dart';
import 'package:meteor/atomic_widgets/channel_list_item.dart';

class MeteorProfileScreen extends StatefulWidget {
  MeteorProfileScreen({Key key}) : super(key: key);

  @override
  _MeteorProfileScreenState createState() => _MeteorProfileScreenState();
}

class _MeteorProfileScreenState extends State<MeteorProfileScreen> {

  Future< FirebaseUser > _currentUser;
  Future< List< Channel > > _channels;

  @override void initState() {
    _currentUser = FirebaseAuth.instance.currentUser();
    _channels = _currentUser.then(getChannels);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            children: <Widget>[
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Profile',
                  style: TextStyle(
                    fontSize: 32.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              SizedBox(
                height: 20.0
              ),
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Channels',
                  style: TextStyle(
                    fontSize: 20.0,
                  ),
                ),
              ),
              FutureBuilder(
                future: _channels,
                builder: (context, snapshot) {
                  if(snapshot.hasError) {
                    return Text(snapshot.error.toString());
                  }
                  if(snapshot.hasData) {
                    // Weird but sound way to go from List< Channel > to List< Widget >
                    List< Widget > mappedChannels = <Widget>[...snapshot.data.map((Channel channel) {
                      return MeteorChannelListItem(
                        channel: channel,
                        trailingAction: IconButton(
                          onPressed: () {
                            _promptForDelete(channel);
                          },
                          icon: Icon(Icons.delete_forever),
                        ),
                      );
                    }).toList()];
                    return Column(
                      children: [
                        Column(
                          children: mappedChannels,
                        ),
                        RaisedButton(
                          onPressed: () {
                            _navigateToChannelCreate();
                          },
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20.0),
                          ),
                          color: Theme.of(context).primaryColor,
                          child: Text('New Channel'),
                        ),
                      ]
                    );
                  }
                  return CircularProgressIndicator();
                },
              ),
            ],
          )
        )
      ),
    );
  }

  _navigateToChannelCreate() async {
    var shouldReload = await Navigator.pushNamed(context, createChannelRoute);
    if(shouldReload) {
      await Future.delayed(Duration(seconds: 1));
      setState(() {
        _channels = _currentUser.then(getChannels);
      });
    }
  }

  _promptForDelete(Channel channel) async {
    bool shouldReload = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Delete \'${channel.name}\'?'),
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
                deleteChannel(channel).then((_) {
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
        _channels = _currentUser.then(getChannels);
      });
    }
  }
}