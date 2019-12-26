import 'package:cloud_functions/cloud_functions.dart';
import 'package:meteor/models/channel.dart';

Future< Channel > createChannel(String name) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'createChannel',
  );
  // Call
  dynamic resp = await callable.call(<String, dynamic>{
    'name': name,
  });
  // return
  return resp.data;
}