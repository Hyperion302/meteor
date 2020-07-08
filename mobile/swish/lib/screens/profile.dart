import 'package:flutter/material.dart';
import 'package:swish/atomic_widgets/channel_tile.dart';
import 'package:swish/models/channel.dart';
import 'package:swish/services/auth.dart';
import 'package:swish/routes.dart';
import 'package:swish/services/channel.dart';

class SwishProfileScreen extends StatefulWidget {
  SwishProfileScreen({Key key}) : super(key: key);

  @override
  _SwishProfileScreenState createState() => _SwishProfileScreenState();
}

class _SwishProfileScreenState extends State<SwishProfileScreen> {
  Future<String> _currentUser;
  Future<List<Channel>> _channels;

  @override
  void initState() {
    _currentUser = AuthService.token;
    _channels = _currentUser.then((user) {
      return ChannelService.queryChannels(owner: user);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Padding(
              padding: EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Profile',
                          style: TextStyle(
                            fontSize: 32.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          AuthService.logout().then((_) {
                            Navigator.pushNamedAndRemoveUntil(context,
                                splashRoute, (Route<dynamic> route) => false);
                          });
                        },
                        tooltip: 'Logout',
                        icon: Icon(Icons.exit_to_app),
                      )
                    ],
                  ),
                  SizedBox(height: 20.0),
                  Expanded(
                    child: RefreshIndicator(
                      onRefresh: () async {
                        String currentUser = await _currentUser;
                        List<Channel> channels =
                            await ChannelService.queryChannels(
                                owner: currentUser);
                        setState(() {
                          _channels = Future.value(channels);
                        });
                        return channels;
                      },
                      child: ListView(
                        physics: AlwaysScrollableScrollPhysics(),
                        children: <Widget>[
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              'Channels',
                              style: TextStyle(
                                fontSize: 20.0,
                              ),
                            ),
                          ),
                          FutureBuilder(
                            future: _channels,
                            builder: (context, snapshot) {
                              if (snapshot.hasError) {
                                return Text(snapshot.error.toString());
                              }
                              if (snapshot.hasData) {
                                print(snapshot.data);
                                List<Widget> mappedChannels = snapshot.data.map<Widget>((Channel channel) =>
                                  SwishChannelTile(
                                    channel: channel,
                                    trailingAction: Container(),
                                    onTap: () {
                                      Navigator.pushNamed(
                                        context,
                                        channelRoute,
                                        arguments: channel
                                      );
                                    }
                                  )
                                ).toList();
                                return Column(
                                  children: mappedChannels,
                                );
                              }
                              return CircularProgressIndicator();
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ))),
    );
  }
}
