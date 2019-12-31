import 'package:flappy_search_bar/flappy_search_bar.dart';
import 'package:flutter/material.dart';
import 'package:meteor/atomic_widgets/video_search_item.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/services/search.dart';

class MeteorSearchScreen extends StatefulWidget {
  MeteorSearchScreen({Key key}) : super(key: key);

  @override
  _MeteorSearchScreenState createState() => _MeteorSearchScreenState();
}

class _MeteorSearchScreenState extends State<MeteorSearchScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: 20.0,
          ),
          child: SearchBar<AlgoliaVideo>(
            onSearch: searchVideos,
            onItemFound: (AlgoliaVideo result, int index) {
              return MeteorVideoSearchItem(searchResult: result);
            },
          ),
        )
      ),
    );
  }
  
}