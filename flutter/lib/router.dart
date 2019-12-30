import 'package:flutter/material.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/screens/channel.dart';
import 'package:meteor/screens/create_channel.dart';
import 'package:meteor/screens/login.dart';
import 'package:meteor/screens/player.dart';
import 'package:meteor/screens/search.dart';
import 'package:meteor/screens/splash.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/screens/tab_host.dart';
import 'package:meteor/screens/upload.dart';

Route< dynamic > generateRoute(RouteSettings settings) {
  switch(settings.name) {
    case loginRoute:
      return MaterialPageRoute(builder: (BuildContext context) => MeteorLoginScreen());
    case splashRoute:
      return MaterialPageRoute(builder: (BuildContext context) => MeteorSplashScreen());
    case channelRoute:
      Channel displayedChannel = settings.arguments;
      return MaterialPageRoute(builder: (BuildContext context) => MeteorChannelScreen(channel: displayedChannel));
    case uploadRoute:
      Channel videoChannel = settings.arguments;
      return MaterialPageRoute(builder: (BuildContext context) => MeteorUploadScreen(videoChannel: videoChannel));
    case tabHostRoute:
      return MaterialPageRoute(builder: (BuildContext context) => MeteorTabHostScreen());
    case createChannelRoute:
      return MaterialPageRoute(builder: (BuildContext context) => MeteorCreateChannelScreen());
    case playerRoute:
      Video displayedVideo = settings.arguments;
      return MaterialPageRoute(builder: (BuildContext context) => MeteorPlayerScreen(video: displayedVideo));
    case searchRoute:
      return MaterialPageRoute(builder: (BuildContext context) => MeteorSearchScreen());
    default:
      return MaterialPageRoute(builder: (context) => Container());
  }
}