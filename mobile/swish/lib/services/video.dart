import 'dart:convert';
import 'dart:io';
import 'package:meta/meta.dart';

import 'package:swish/models/video.dart';

import 'package:http/http.dart' as http;
import 'package:swish/services/auth.dart';

const baseURL = 'api.swish.tv';

class VideoService {
  static Future<Video> uploadVideo(
      {String name, String description, String channelID, File file}) async {}

  static Future<Video> getVideo({@required String id}) async {
    // Get my token
    var token = await AuthService.token;

    // Craft my URI
    var uri = Uri.https(baseURL, '/video/$id');

    // Make my request
    var response = await http.get(uri, headers: {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    });

    Map<String, dynamic> jsonVideo = json.decode(response.body);

    return Video.fromJSON(jsonVideo);
  }

  static Future<int> getWatchtime({@required String id}) async {
    // Get my token
    var token = await AuthService.token;

    // Craft my URI
    var uri = Uri.https(baseURL, '/video/$id/watchtime');

    // Make my request
    var response = await http.get(uri, headers: {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    });

    Map<String, dynamic> jsonResponse = json.decode(response.body);

    var wt = int.parse(jsonResponse['wt'].toString());

    return wt;
  }

  static Future<void> submitFragment({@required String id, @required double t1, @required double t2}) async {
    // Get my token
    var token = await AuthService.token;

    // Craft my URI
    var uri = Uri.https(baseURL, '/video/$id/segments');

    // Make my request
    var response = await http.post(uri, body: {
      't1': t1.toStringAsFixed(2),
      't2': t2.toStringAsFixed(2),
    }, headers: {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    });
  }

  static Future<void> deleteVideo({@required String id}) async {}

  static Future<Video> updateVideo({String name, String description}) async {}

  static Future<List<Video>> queryVideos(
      {String author, String channel, int before, int after}) async {
    // Get my token
    var token = await AuthService.token;

    // Build search object
    Map<String, String> queryObject = new Map();
    if (author != null) {
      queryObject['author'] = author;
    }
    if (channel != null) {
      queryObject['channel'] = channel;
    }
    if (before != null) {
      queryObject['before'] = before.toString();
    }
    if (after != null) {
      queryObject['after'] = after.toString();
    }

    // Craft my URI
    var uri = Uri.https(baseURL, '/video', queryObject);

    // Make my request
    var response = await http.get(uri, headers: {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    });

    List<dynamic> jsonVideos = json.decode(response.body);
    return jsonVideos.map((jsonVideo) {
      return Video.fromJSON(jsonVideo as Map<String, dynamic>);
    }).toList();
  }
}
