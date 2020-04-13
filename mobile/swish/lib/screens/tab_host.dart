import 'package:flutter/material.dart';
import 'package:swish/screens/home.dart';
import 'package:swish/screens/profile.dart';
import 'package:swish/screens/search.dart';

class SwishTabHost extends StatefulWidget {
  SwishTabHost({Key key}) : super(key: key);

  @override
  _SwishTabHostState createState() => _SwishTabHostState();
}

class _SwishTabHostState extends State<SwishTabHost> {
  final List<Widget> _subviews = <Widget>[
    SwishHomeScreen(),
    SwishSearchScreen(),
    SwishProfileScreen(),
  ];
  int _currentIndex;
  Widget _currentView;
  @override
  void initState() {
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
        items: <BottomNavigationBarItem>[
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
            title: Text('Profile'),
          ),
        ],
      ),
    );
  }
}
