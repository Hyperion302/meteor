import 'package:flutter/material.dart';
import 'package:swish/models/channel.dart';
import 'package:swish/atomic_widgets/custom_card.dart';
import 'package:swish/utils.dart';

class SwishChannelTile extends StatelessWidget {
  final Channel channel;
  final Widget trailingAction;
  final void Function() onTap;

  SwishChannelTile({this.channel, this.trailingAction, @required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SwishCustomCard(
      child: ListTile(
        leading: CircleAvatar(
          radius: 30,
          backgroundImage: NetworkImage(getChannelIconURL(channel.id, '64')),
        ),
        trailing: trailingAction,
        title: Text(channel.name),
        subtitle: Text('Lorem Ipsum'),
        onTap: onTap,
      ),
    );
  }
}
