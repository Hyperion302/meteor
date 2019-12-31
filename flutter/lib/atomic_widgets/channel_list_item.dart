import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/atomic_widgets/custom_card.dart';

class MeteorChannelListItem extends StatelessWidget {
  final Channel channel;
  final Widget trailingAction;

  MeteorChannelListItem({this.channel, this.trailingAction});

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: ListTile(
        leading: FlutterLogo(),
        trailing: trailingAction,
        title: Text(channel.name),
        subtitle: Text('Lorem Ipsum'),
        onTap: () {
          Navigator.pushNamed(context, channelRoute, arguments: channel);
        }
      ),
    );
  }
}