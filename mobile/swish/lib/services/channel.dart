import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import 'package:meta/meta.dart';
import 'package:swish/models/channel.dart';
import 'package:swish/services/auth.dart';

const baseURL = 'api.swish.tv';

class ChannelService {
  static Future<Channel> createChannel({@required String name}) async {}

  static Future<Channel> getChannel({@required String id}) async {
    // Get my token
    var token = await AuthService.token;

    // Craft my URI
    var uri = Uri.https(baseURL, '/channel/$id');

    // Make my request
    var response = await http.get(uri, headers: {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    });

    Map<String, dynamic> jsonChannel = json.decode(response.body);

    return Channel.fromJSON(jsonChannel);
  }

  static Future<Channel> updateChannel(
      {@required String id, String name}) async {}

  static Future<void> deleteChannel({@required String id}) async {}

  static Future<List<Channel>> queryChannels({String owner}) async {
    // Get my token
    var token = await AuthService.token;

    // Craft my URI
    var uri = Uri.https(baseURL, '/channel', {
      'owner': owner,
    });

    // Make my request
    var response = await http.get(uri, headers: {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    });

    List<dynamic> jsonChannels = json.decode(response.body);
    return jsonChannels.map((jsonChannel) {
      return Channel.fromJSON(jsonChannel as Map<String, dynamic>);
    }).toList();
  }

  static Future<void> uploadChannelIcon(
      {@required String id, @required File icon}) async {}
}
