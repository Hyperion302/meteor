import 'package:flutter/material.dart';

// NOTE:
// "Channel" name used interchangably with "User" before phase 2


class MeteorChannelScreenArguments {
  String userId;

  MeteorChannelScreenArguments(this.userId);
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
                child: Text('Channel ${navigationArguments.userId}',
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
    );
  }
}