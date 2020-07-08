import 'package:flutter/material.dart';
import 'package:swish/atomic_widgets/channel_tile.dart';
import 'package:swish/models/video.dart';
import 'package:swish/services/video.dart';
import 'package:swish/utils.dart';
import 'package:video_player/video_player.dart';

import '../routes.dart';

class SwishPlayerScreen extends StatefulWidget {
  final Video video;
  final double playerHeight = 200;

  SwishPlayerScreen({Key key, this.video}) : super(key: key);

  @override
  _SwishPlayerScreenState createState() => _SwishPlayerScreenState();
}

class _SwishPlayerScreenState extends State<SwishPlayerScreen> {
  VideoPlayerController _playerController;
  Stream<Duration> _playbackUpdateStream;
  double _position = 0.0;
  double _seekingBuffer = 0.0;
  bool _seeking = false;
  bool _paused = true;
  bool _hudUp = false;
  Future<int> _watchtime;

  @override
  void initState() {
    _playerController = VideoPlayerController.network(
        'https://stream.mux.com/${widget.video.content.playbackID}.m3u8');
    _playerController.initialize().then((_) {
      setState(() {
        // Display first frame...
      });
    });
    Duration playbackUpdateInterval = Duration(milliseconds: 10);
    _playbackUpdateStream = Stream<Duration>.periodic(playbackUpdateInterval, (int period) {
      // Poll player
      if (_playerController.value.initialized) {
        return _playerController.value.position;
      }
      return Duration();
    }).asBroadcastStream();
    _watchtime = VideoService.getWatchtime(id: widget.video.id);
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
                  Navigator.pop(context, false);
                },
              ),
            ],
          ),
          buildPlayer(),
          buildVideoInfo(),
        ],
      )),
    );
  }

  int evc(int duration, int wt) {
    return (wt / duration).round();
  }

  Widget buildVideoInfo() {
    return Container(
        margin: EdgeInsets.symmetric(
          horizontal: 12.0,
        ),
        child: Column(
          children: <Widget>[
            Container(
              margin: EdgeInsets.symmetric(
                vertical: 24.0,
              ),
              child: Column(
                children: <Widget>[
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      widget.video.title,
                      style: TextStyle(
                        fontSize: 24.0,
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: FutureBuilder(
                      future: _watchtime,
                      builder: (context, snapshot) {
                        if (snapshot.hasError) {
                          print(snapshot.error);
                          return Container();
                        }
                        if(snapshot.hasData) {
                          return Text('${formatEVC(snapshot.data, widget.video.content.duration)} · ${formatTimestamp(snapshot.data)} · ${formatAge(widget.video.uploadDate)}');
                        }
                        return Text(formatTimestamp(widget.video.uploadDate));
                      }
                    ),
                  ),
                  SizedBox(height: 24),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(widget.video.description),
                  )
                ],
              ),
            ),
            SwishChannelTile(
                channel: widget.video.channel,
                trailingAction: SizedBox(),
                onTap: () {
                  Navigator.pushNamed(context, channelRoute,
                      arguments: widget.video.channel);
                }),
          ],
        ));
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
                  if (_paused) {
                    _playerController.play();
                  } else {
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
      builder: (BuildContext context, AsyncSnapshot<Duration> snap) {
        if (snap.connectionState != ConnectionState.active) {
          return Container();
        }
        if (!_seeking) {
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
              _playerController
                  .seekTo(Duration(milliseconds: _seekingBuffer.toInt()));
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
    if (_playerController.value.initialized) {
      return buildInitializedPlayer();
    } else {
      return CircularProgressIndicator();
    }
  }

  bool landscape() {
    double ar = _playerController.value.size.width /
        _playerController.value.size.height;
    return ar > 1;
  }

  double getPlayerWidth() {
    if (landscape()) {
      // Landscape, device width
      return MediaQuery.of(context).size.width;
    } else {
      // Portrait
      double scaleFactor =
          widget.playerHeight / _playerController.value.size.height;
      return scaleFactor * _playerController.value.size.width;
    }
  }

  double getPlayerHeight() {
    if (landscape()) {
      // Landscape
      double scaleFactor = MediaQuery.of(context).size.width /
          _playerController.value.size.width;
      return scaleFactor * _playerController.value.size.height;
    } else {
      // Portrait, desired height
      return widget.playerHeight;
    }
  }

  double getBlackBarWidth() {
    double width;
    if (landscape()) {
      width = MediaQuery.of(context).size.width;
    } else {
      double screenWidth = MediaQuery.of(context).size.width;
      width = (screenWidth - getPlayerWidth()) / 2;
    }
    return width < 0 ? 0 : width;
  }

  double getBlackBarHeight() {
    double height;
    if (landscape()) {
      height = (widget.playerHeight - getPlayerHeight()) / 2;
    } else {
      height = widget.playerHeight;
    }
    return height < 0 ? 0 : height;
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
                landscape()
                    ? Column(
                        children: <Widget>[
                          Container(
                              width: getBlackBarWidth(),
                              height: getBlackBarHeight(),
                              decoration: BoxDecoration(
                                color: Colors.black,
                              )),
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
                              )),
                        ],
                      )
                    : Row(
                        children: <Widget>[
                          Container(
                              width: getBlackBarWidth(),
                              height: getBlackBarHeight(),
                              decoration: BoxDecoration(
                                color: Colors.black,
                              )),
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
                              )),
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
