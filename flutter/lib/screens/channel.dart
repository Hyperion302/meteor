import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meteor/routes.dart';

// NOTE:
// "Channel" name used interchangably with "User" before phase 2


class MeteorChannelScreenArguments {
  FirebaseUser user;

  MeteorChannelScreenArguments(this.user);
}

class MeteorChannelScreen extends StatefulWidget {
  MeteorChannelScreen({Key key}) : super(key: key);

  @override
  _MeteorChannelScreenState createState() => _MeteorChannelScreenState();
}

class _MeteorChannelScreenState extends State<MeteorChannelScreen> {
  
  @override
  Widget build(BuildContext context) {
    MeteorChannelScreenArguments navigationArguments = ModalRoute.of(context).settings.arguments;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            children: <Widget>[
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Channel ${navigationArguments.user.uid}',
                  style: TextStyle(
                    fontSize: 32.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamedAndRemoveUntil(context, uploadRoute, (Route<dynamic> route) => false);
        },
        child: Icon(Icons.add),
      ),
    );
  }
}