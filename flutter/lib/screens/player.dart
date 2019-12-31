import 'package:flutter/material.dart';
import 'package:meteor/atomic_widgets/channel_tile.dart';
import 'package:meteor/models/video.dart';
import 'package:video_player/video_player.dart';

class MeteorPlayerScreen extends StatefulWidget {
  final Video video;
  final double playerHeight = 200;

  MeteorPlayerScreen({Key key, this.video}) : super(key: key);

  @override
  _MeteorPlayerScreenState createState() => _MeteorPlayerScreenState();
}

class _MeteorPlayerScreenState extends State<MeteorPlayerScreen>{

  VideoPlayerController _playerController;
  Stream< Duration > _playbackUpdateStream;
  double _position = 0.0;
  double _seekingBuffer = 0.0;
  bool _seeking = false;
  bool _paused = true;
  bool _hudUp = false;
  
  @override
  void initState() {
    _playerController = VideoPlayerController.network('https://stream.mux.com/${widget.video.muxData.playbackID}.m3u8');
    _playerController.initialize().then((_) {
      setState(() {
        // Display first frame...
      });
    });
    Duration interval = Duration(milliseconds: 10);
    _playbackUpdateStream = Stream< Duration >.periodic(interval, (int period) {
      // Poll player
      if(_playerController.value.initialized) {
        return _playerController.value.position;
      }
      return Duration();
    }).asBroadcastStream();
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
        horizontal: 12.0,
        vertical: 20.0
      ),
      child: Column(
        children: <Widget>[
          Align(
            alignment: Alignment.centerLeft,
            child: Text('Uploaded To',
              style: TextStyle(
                fontSize: 20.0,
              ),
            ),
          ),
          MeteorChannelTile(
            channel: widget.video.channel,
            trailingAction: SizedBox(),
          ),
        ],
      )
    );
  }

  Widget buildHUD() {
    return Container(
      decoration: BoxDecoration(
        color: Color.fromARGB(100, 0, 0, 0),
      ),
      height: widget.playerHeight,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          Padding(
            padding: EdgeInsets.all(8.0),
            child: InkWell(
              customBorder: new CircleBorder(),
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
              splashColor: Colors.red,
              child: new Icon(
                _paused ? Icons.play_arrow : Icons.pause,
                size: 48,
                color: Colors.white,
              ),
            ),
          ),
          buildSlider(),
        ],
      ),
    );
  }

  Widget buildSlider() {
    return StreamBuilder(
      initialData: Duration(),
      stream: _playbackUpdateStream,
      builder: (BuildContext context, AsyncSnapshot< Duration > snap) {
        if(snap.connectionState != ConnectionState.active) {
          return Container();
        }
        if(!_seeking) {
          _position = snap.data.inMilliseconds.toDouble();
        }
        return SliderTheme(
          data: SliderThemeData(
            thumbShape: RoundSliderThumbShape(
              enabledThumbRadius: 0.0,
            ),
          ),
          child: Slider(
            value: _seeking ? _seekingBuffer : _position,
            min: 0.0,
            max: _playerController.value.duration.inMilliseconds.toDouble(),
            onChangeStart: (double value) {
              // Pause
              _playerController.pause();
              setState(() {
                _paused = true;
              });
              _seeking = true;
            },
            onChanged: (double value) {
              _seekingBuffer = value;
            },
            onChangeEnd: (double value) {
              // Unpause
              _position = _seekingBuffer;
              _playerController.seekTo(Duration(milliseconds: _seekingBuffer.toInt()));
              _playerController.play();
              setState(() {
                _paused = false;
              });
              _seeking = false;
            },
          ),
        );
      },
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

  bool landscape() {
    double ar = _playerController.value.size.width / _playerController.value.size.height;
    return ar > 1;
  }

  double getPlayerWidth() {
    if(landscape()) {
      // Landscape, device width
      return MediaQuery.of(context).size.width;
    }
    else {
      // Portrait
      double scaleFactor = widget.playerHeight / _playerController.value.size.height;
      return scaleFactor * _playerController.value.size.width;
    }
  }

  double getPlayerHeight() {
    if(landscape()) {
      // Landscape
      double scaleFactor = MediaQuery.of(context).size.width / _playerController.value.size.width;
      return scaleFactor * _playerController.value.size.height;
    }
    else {
      // Portrait, desired height
      return widget.playerHeight;
    }
  }

  double getBlackBarWidth() {
    if(landscape()) {
      return MediaQuery.of(context).size.width;
    }
    else {
      double screenWidth = MediaQuery.of(context).size.width;
      return (screenWidth - getPlayerWidth()) / 2;
    }
  }

  double getBlackBarHeight() {
    if(landscape()) {
      return (widget.playerHeight - getPlayerHeight()) / 2;
    }
    else {
      return widget.playerHeight;
    }
  }

  Widget buildInitializedPlayer() {
    return GestureDetector(
      onTap: () {
        setState(() {
          _hudUp = _hudUp ? false : true;
        });
      },
      child: Container(
        child: Column(
          children: <Widget>[
            Stack(
              alignment: Alignment.bottomCenter,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Container(
                      width: getBlackBarWidth(),
                      height: getBlackBarHeight(),
                      decoration: BoxDecoration(
                        color: Colors.black,
                      )
                    ),
                    Container(
                      height: getPlayerHeight(),
                      width: getPlayerWidth(),
                      child: VideoPlayer(_playerController),
                    ),
                    Container(
                      width: getBlackBarWidth(),
                      height: getBlackBarHeight(),
                      decoration: BoxDecoration(
                        color: Colors.black,
                      )
                    ),
                  ],
                ),
                Visibility(
                  child: buildHUD(),
                  visible: _hudUp,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}