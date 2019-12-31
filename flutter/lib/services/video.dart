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
  Video uploadedVideo = Video.fromFirestore(resp.data);
  print(uploadedVideo.uploadDate);
  StorageReference videoRef = FirebaseStorage.instance.ref().child('masters/${uploadedVideo.author}/${uploadedVideo.id}');
  StorageUploadTask uploadTask = videoRef.putFile(video.video);
  return uploadTask;
}

Future< Video > getVideoById(String id) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'getVideo',
  );
  // Allocate ID
  dynamic resp = await callable.call(<String, dynamic>{
    'video': id,
  });
  return Video.fromFirestore(resp.data);
}

Future< void > deleteVideo(Video video) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'deleteVideo',
  );
  // Call
  await callable.call(<String, dynamic>{
    'video': video.id,
  });
}