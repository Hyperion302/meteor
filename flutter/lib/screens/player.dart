import 'package:flutter/material.dart';
import 'package:meteor/atomic_widgets/channel_list_item.dart';
import 'package:meteor/models/video.dart';
import 'package:video_player/video_player.dart';

class MeteorPlayerScreen extends StatefulWidget {
  final Video video;

  MeteorPlayerScreen({Key key, this.video}) : super(key: key);

  @override
  _MeteorPlayerScreenState createState() => _MeteorPlayerScreenState();
}

class _MeteorPlayerScreenState extends State<MeteorPlayerScreen>{

  VideoPlayerController _playerController;
  bool _paused = true;
  
  @override
  void initState() {
    _playerController = VideoPlayerController.network('https://stream.mux.com/${widget.video.muxData.playbackID}.m3u8');
    _playerController.initialize().then((_) {
      setState(() {
        // Display first frame...
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: <Widget>[
            Row(
                children: <Widget>[
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios),
                    tooltip: 'Go Back',
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                  Flexible(
                    child: Text(widget.video.title,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 32.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            buildPlayer(),
            buildVideoInfo(),
          ],
        )
      ),
    );
  }

  Widget buildVideoInfo() {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: 12.0
      ),
      child: Column(
        children: <Widget>[
          Align(
            alignment: Alignment.centerLeft,
            child: Text('Uploaded On',
              style: TextStyle(
                fontSize: 20.0,
              ),
            ),
          ),
          MeteorChannelListItem(widget.video.channel),
        ],
      )
    );
  }

  Widget buildPlayer() {
    if(_playerController.value.initialized) {
      return buildInitializedPlayer();
    }
    else {
      return CircularProgressIndicator();
    }
  }

  Widget buildInitializedPlayer() {
    return GestureDetector(
      onTap: () {
        setState(() {
          if(_paused) {
            _playerController.play();
          }
          else {
            _playerController.pause();
          }
          _paused = _paused ? false : true;
        });
      },
      child: Container(
        child: AspectRatio(
          aspectRatio: 16.0/9.0,
          child: VideoPlayer(_playerController),
        ),
      ),
    );
  }
}