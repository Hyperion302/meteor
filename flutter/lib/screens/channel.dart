import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/routes.dart';

class MeteorChannelScreen extends StatefulWidget {
  final Channel channel;
  MeteorChannelScreen({Key key, this.channel}) : super(key: key);

  @override
  _MeteorChannelScreenState createState() => _MeteorChannelScreenState();
}

class _MeteorChannelScreenState extends State<MeteorChannelScreen> {

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