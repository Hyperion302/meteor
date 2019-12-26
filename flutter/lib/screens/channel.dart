import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/screens/upload.dart';

// NOTE:
// "Channel" name used interchangably with "User" before phase 2


class MeteorChannelScreenArguments {
  Channel channel;

  MeteorChannelScreenArguments(this.channel);
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
                  Text('${navigationArguments.channel.name}',
                    style: TextStyle(
                      fontSize: 32.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, uploadRoute, arguments: MeteorUploadScreenArguments(navigationArguments.channel));
        },
        child: Icon(Icons.add),
      ),
    );
  }
}