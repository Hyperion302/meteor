import 'package:flutter/material.dart';
import 'package:swish/router.dart';
import 'package:swish/routes.dart';

void main() => runApp(SwishApp());

class SwishApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Swish',
      theme: ThemeData(primarySwatch: Colors.orange),
      initialRoute: splashRoute,
      onGenerateRoute: generateRoute,
    );
  }
}
