import 'package:flutter/material.dart';
import 'package:meteor/screens/channel.dart';
import 'package:meteor/screens/create_channel.dart';
import 'package:meteor/screens/home.dart';
import 'package:meteor/screens/login.dart';
import 'package:meteor/screens/splash.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/screens/tab_host.dart';
import 'package:meteor/screens/upload.dart';

void main() => runApp(MeteorApp());

class MeteorApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Meteor',
      theme: ThemeData(
        primarySwatch: Colors.orange,
      ),
      initialRoute: splashRoute,
      routes: {
        homeRoute: (context) => MeteorHomeScreen(),
        splashRoute: (context) => MeteorSplashScreen(),
        loginRoute: (context) => MeteorLoginScreen(),
        channelRoute: (context) => MeteorChannelScreen(),
        uploadRoute: (context) => MeteorUploadScreen(),
        tabHostRoute: (context) => MeteorTabHostScreen(),
        createChannelRoute: (context) => MeteorCreateChannelScreen(),
      }
    );
  }
}