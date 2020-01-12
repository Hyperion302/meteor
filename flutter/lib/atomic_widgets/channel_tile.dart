import 'package:flutter/material.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/routes.dart';
import 'package:meteor/atomic_widgets/custom_card.dart';

class MeteorChannelTile extends StatelessWidget {
  final Channel channel;
  final Widget trailingAction;
  final void Function() onTap;


  MeteorChannelTile({this.channel, this.trailingAction, @required this.onTap});

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: ListTile(
        leading: CircleAvatar(
          radius: 30,
          backgroundImage: NetworkImage('https://storage.googleapis.com/meteor-247517.appspot.com/channelAssets/${channel.id}/thumb128'),
        ),
        trailing: trailingAction,
        title: Text(channel.name),
        subtitle: Text('Lorem Ipsum'),
        onTap: onTap,
      ),
    );
  }
}