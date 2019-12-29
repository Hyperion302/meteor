import 'package:flutter/material.dart';
import 'package:meteor/router.dart';
import 'package:meteor/routes.dart';

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
      onGenerateRoute: generateRoute,
    );
  }
}