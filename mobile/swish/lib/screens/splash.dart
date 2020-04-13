import 'package:flutter/material.dart';
import 'package:swish/routes.dart';
import 'package:swish/services/auth.dart';
import 'package:swish/services/channel.dart';

class SwishSplashScreen extends StatefulWidget {
  SwishSplashScreen({Key key}) : super(key: key);

  @override
  _SwishSplashScreenState createState() => _SwishSplashScreenState();
}

class _SwishSplashScreenState extends State<SwishSplashScreen> {
  @override
  void initState() {
    checkAuthAndNavigate();
    super.initState();
  }

  Future<void> checkAuthAndNavigate() async {
    var loggedIn = await AuthService.loggedIn;
    if (loggedIn) {
      print('Already logged in');
    } else {
      print('Need to login');
      await AuthService.login();
      print('All done!');
    }
    Navigator.pushNamedAndRemoveUntil(
        context, tabHostRoute, (Route<dynamic> route) => false);
    /*var currentUser = await auth.authObject.currentUser();
    if(currentUser == null) {
      print('Login');
      Navigator.pushNamedAndRemoveUntil(context, loginRoute, (Route<dynamic> route) => false);
    }
    else {
      print('Already logged in');
      print(currentUser.accessToken);
      Navigator.pushNamedAndRemoveUntil(context, tabHostRoute, (Route<dynamic> route) => false);
    }*/
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
