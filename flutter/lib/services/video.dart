import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:meteor/models/video.dart';



Future< StorageUploadTask > uploadVideo(VideoUpload video) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'video_createVideo',
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
    functionName: 'video_getVideo',
  );
  // Allocate ID
  dynamic resp = await callable.call(<String, dynamic>{
    'video': id,
  });
  return Video.fromFirestore(resp.data);
}

Future< void > deleteVideo(Video video) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'video_deleteVideo',
  );
  // Call
  await callable.call(<String, dynamic>{
    'video': video.id,
  });
}

Future< void > updateVideo(Video oldVideo, Video newVideo) async {
  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'video_updateVideo',
  );

  // Determine what fields changed
  Map< String, dynamic > args = {
    'video': oldVideo.id,
  };
  if(oldVideo.title != newVideo.title) {
    args['title'] = newVideo.title;
  }

  // Call
  await callable.call(args);

}