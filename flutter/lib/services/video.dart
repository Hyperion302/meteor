import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:meteor/models/video.dart';



Future< StorageUploadTask > uploadVideo(VideoUpload video) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'createVideo',
  );
  // Allocate ID
  dynamic resp = await callable.call(<String, dynamic>{
    'title': video.title,
    'channel': video.channel,
  });
  // Upload Video
  String authorId = resp.data['author'];
  String videoId = resp.data['id'];
  StorageReference videoRef = FirebaseStorage.instance.ref().child('masters/$authorId/$videoId');
  StorageUploadTask uploadTask = videoRef.putFile(video.video);
  return uploadTask;
}