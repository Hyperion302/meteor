import 'package:flutter/material.dart';
import 'package:meteor/atomic_widgets/custom_card.dart';
import 'package:meteor/models/video.dart';

import '../utils.dart';

class MeteorLargeVideoTile extends StatelessWidget {
  final Video video;
  final bool showChannelName;
  final bool showAge;
  final void Function() onTap;

  MeteorLargeVideoTile({Key key, this.video, this.showAge = false, this.showChannelName = false, @required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    int width = MediaQuery.of(context).size.width.toInt() - 40;
    return CustomCard(
      child: Column(
        children: <Widget>[
          GestureDetector(
            onTap: onTap,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20.0),
                color: Colors.black,
                boxShadow: <BoxShadow>[
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10.0,
                    offset: Offset(0.0, 10.0),
                  )
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20.0),
                child:Image.network('https://image.mux.com/${video.muxData.playbackID}/thumbnail.png?width=$width&height=200&fit_mode=pad'),
              ),
            ),
          ),
          ListTile(
            title: Text(video.title),
            subtitle: Text('${showChannelName ? video.channel.name + ' ' : ''}${showAge && this.showChannelName ? '•' : ''}${showAge ? ' ' + formatTimestamp(video.uploadDate) : ''}'),
            onTap: onTap,
          ),
        ],
      ),
    );
  }
}