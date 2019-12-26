import 'package:flutter/material.dart';
import 'package:meteor/screens/home.dart';
import 'package:meteor/screens/profile.dart';

class MeteorTabHostScreen extends StatefulWidget {
  MeteorTabHostScreen({Key key}) : super(key: key);

  @override
  _MeteorTabHostScreenState createState() => _MeteorTabHostScreenState();
}

class _MeteorTabHostScreenState extends State<MeteorTabHostScreen> {
  final List<Widget> _subviews = <Widget>[
    MeteorHomeScreen(),
    Container(),
    MeteorProfileScreen(),
  ];
  int _currentIndex;
  Widget _currentView;
  @override void initState() {
    _currentIndex = 0;
    _currentView = _subviews[_currentIndex];
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _currentView,
      bottomNavigationBar: BottomNavigationBar(
        onTap: (index) {
          setState(() {
            _currentView = _subviews[index];
            _currentIndex = index;
          });
        },
        currentIndex: _currentIndex,
        items: <BottomNavigationBarItem> [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            title: Text('Home'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            title: Text('Search'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle),
            title: Text('Me'),
          ),
        ],
      ),
    );
  }
}