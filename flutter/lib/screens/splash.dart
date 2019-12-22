import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meteor/routes.dart';

class MeteorSplashScreen extends StatefulWidget {
  MeteorSplashScreen({Key key}) : super(key: key);

  @override
  _MeteorSplashScreenState createState() => _MeteorSplashScreenState();
}

class _MeteorSplashScreenState extends State<MeteorSplashScreen> {
  @override
  void initState() {
    checkAuthAndNavigate();
    super.initState();
  }

  Future< void > checkAuthAndNavigate() async {
    var currentUser = await FirebaseAuth.instance.currentUser();
    if(currentUser == null) {
      print('Login');
      Navigator.pushNamedAndRemoveUntil(context, loginRoute, (Route<dynamic> route) => false);
    }
    else {
      print('Already logged in');
      print(currentUser.email);
      Navigator.pushNamedAndRemoveUntil(context, homeRoute, (Route<dynamic> route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          child: Text('Loading...'),
        ),
      ),
    );
  }
}