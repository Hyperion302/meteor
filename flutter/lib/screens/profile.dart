import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class MeteorProfileScreen extends StatefulWidget {
  MeteorProfileScreen({Key key}) : super(key: key);

  @override
  _MeteorProfileScreenState createState() => _MeteorProfileScreenState();
}

class _MeteorProfileScreenState extends State<MeteorProfileScreen> {

  Future< FirebaseUser > _currentUser;

  @override void initState() {
    _currentUser = FirebaseAuth.instance.currentUser();
    super.initState();
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
                  FutureBuilder(
                    future: _currentUser,
                    builder: (context, snapshot) {
                      if(snapshot.hasData) {
                        return Text(snapshot.data.uid);
                      }
                      return Text('Loading...');
                    },
                  )
                ],
              )
            ],
          )
        )
      ),
    );
  }
}