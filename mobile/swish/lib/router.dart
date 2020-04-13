import 'package:flutter/material.dart';
import 'package:swish/models/channel.dart';
import 'package:swish/routes.dart';
import 'package:swish/screens/channel.dart';
import 'package:swish/screens/player.dart';
import 'package:swish/screens/splash.dart';
import 'package:swish/screens/tab_host.dart';

import 'models/video.dart';

Route<dynamic> generateRoute(RouteSettings settings) {
  switch (settings.name) {
    case splashRoute:
      return MaterialPageRoute(
          builder: (BuildContext context) => SwishSplashScreen());
    case tabHostRoute:
      return MaterialPageRoute(
          builder: (BuildContext context) => SwishTabHost());
    case channelRoute:
      Channel displayedChannel = settings.arguments;
      return MaterialPageRoute(
          builder: (BuildContext context) =>
              SwishChannelScreen(channel: displayedChannel));
    case playerRoute:
      Video displayedVideo = settings.arguments;
      return MaterialPageRoute(
          builder: (BuildContext context) =>
              SwishPlayerScreen(video: displayedVideo));
    default:
      return MaterialPageRoute(builder: (context) => Container());
  }
}
