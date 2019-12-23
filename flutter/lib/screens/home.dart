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
  
  Future< FirebaseUser > _currentUser;

  @override
  void initState() {
    super.initState();
    _currentUser = FirebaseAuth.instance.currentUser();
  }

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
                  ),
                  FutureBuilder<FirebaseUser>(
                    future: _currentUser,
                    builder: (context, snapshot) {
                      if(snapshot.hasData && snapshot.data != null) {
                        return IconButton(
                          icon: Icon(Icons.account_circle, size: 32.0),
                          tooltip: 'Go to my channel',
                          onPressed: () {
                            Navigator.pushNamed(context, channelRoute, arguments: MeteorChannelScreenArguments(snapshot.data));
                          },
                        );
                      }
                      else {
                        return IconButton(
                          icon: Icon(Icons.account_circle, size: 32.0),
                          tooltip: 'Go to my channel',
                          onPressed: () {},
                        );
                      }
                    }
                  ),
                ],
              )
            ],
          ),
        ),
      )
    );
  }
}