import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/screens/channel.dart';

class MeteorHomeScreen extends StatefulWidget {
  MeteorHomeScreen({Key key}) : super(key: key);

  @override
  _MeteorHomeScreenState createState() => _MeteorHomeScreenState();
}

class _MeteorHomeScreenState extends State<MeteorHomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text('Home',
                    style: TextStyle(
                      fontSize: 32.0,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      )
    );
  }
}