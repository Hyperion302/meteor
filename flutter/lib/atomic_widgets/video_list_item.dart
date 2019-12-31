import 'package:flutter/material.dart';
import 'package:meteor/atomic_widgets/custom_card.dart';
import 'package:meteor/models/video.dart';

class MeteorVideoListItem extends StatelessWidget {
  final Video video;

  MeteorVideoListItem(this.video);

  String formatTimestamp(int timestamp) {
    Duration age = Duration(milliseconds: DateTime.now().millisecondsSinceEpoch - timestamp*1000);
    // Less than an hour, minutes
    if(age < Duration(hours: 1)) {
      return '${age.inMinutes} minutes ago';
    }
    // Less than a day, hours
    if(age < Duration(days: 1)) {
      return '${age.inHours} hours ago';
    }
    // less than a week, days
    if(age < Duration(days: 7)) {
      return '${age.inDays} days ago';
    }
    // Less than a month, weeks
    if(age < Duration(days: 31)) {
      // Get days
      int days = age.inDays;
      return '${days ~/ 7} weeks ago';
    }
    // Less than a year, months
    if(age < Duration(days: 365)) {
      int days = age.inDays;
      return '${days ~/ 31} months ago';
    }
    // Years
    int days = age.inDays;
    return '${days ~/ 365} years ago';
  }
  
  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: Row(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20.0),
              color: Colors.black,
              boxShadow: <BoxShadow>[
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10.0,
                  offset: Offset(10.0, 0.0),
                )
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20.0),
              child: Image.network(
                'https://image.mux.com/${video.muxData.playbackID}/thumbnail.png',
                width: 128,
                height: 72,
              ),
            ),
          ),
          SizedBox(
            width: 10,
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(video.title),
              Text(formatTimestamp(video.uploadDate), 
                style: TextStyle(
                  color: Colors.black38,
                )
              ),
            ],
          )
        ],
      ),
    );
  }
}