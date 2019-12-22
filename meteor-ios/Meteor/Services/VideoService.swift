//
//  VideoService.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/4/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import Foundation
import Firebase
import FirebaseStorage
import Photos

class VideoService {
    lazy var db = Firestore.firestore()
    lazy var colRef = db.collection("videos")
    lazy var functions = Functions.functions()
    lazy var createVideoCallable = functions.httpsCallable("createVideo")
    lazy var storage = Storage.storage(url: "gs://meteor-videos")
    
    // MARK: Search Videos
    
    func searchVideos(query: String, _ completion: @escaping (_ results: [Video]?, _ error: VideoSearchError?) -> Void) {
        colRef.whereField("title", isEqualTo: query).whereField("status", isEqualTo: "transcoded").getDocuments() { (qs, error) in
            if error != nil {
                completion(nil, .fbError(error: error))
            }
            else {
                var results: [Video] = []
                for document in qs!.documents {
                    let data = document.data()
                    results.append(Video(
                        id: data["id"] as! String,
                        author: data["author"] as! String,
                        title: data["title"] as! String,
                        muxPlaybackId: data["muxPlaybackId"] as? String,
                        muxAssetId: data["muxAssetId"] as? String
                    ))
                }
                completion(results, nil)
            }
        }
    }
    
    // MARK: Get Video
    
    func getVideo(id: String, _ completion: @escaping (_ video: Video?, _ error: Error?) -> Void) {
        
    }
    
    // MARK: Upload Video
    
    func uploadVideo(upload: VideoUpload, _ progress: @escaping (_ count: CGFloat) -> Void, _ completion: @escaping (_ video: Video?, _ error: VideoUploadError?) -> Void) {
        guard let url = upload.fsUrl else {
            completion(nil, .invalidParameter)
            return
        }
        guard let title = upload.title else {
            completion(nil, .invalidParameter)
            return
        }
        print(title)
        createVideoCallable.call([
            "title": title
        ]) { (result, error) in
            // Check for error
            guard error == nil else {
                completion(nil, .fbError(error: error))
                return
            }
            
            // Get ID
            let optionalVId = (result?.data as? [String: Any])?["id"] as? String
            guard let vId = optionalVId else {
                completion(nil, .invalidResponse(response: optionalVId as Any))
                return
            }
            progress(0.1)
            
            // Get Data Object
            var videoData: Data
            do {
                videoData = try Data(contentsOf: url, options: .dataReadingMapped)
            } catch {
                completion(nil, .dataNotReachable)
                return
            }
            
            // Get Author
            let authorId = Auth.auth().currentUser!.uid
            
            // Start Upload
            let ref = self.storage.reference(forURL: "gs://meteor-videos/masters/\(authorId)/\(vId)")
            let uploadTask = ref.putData(videoData, metadata: nil)
            
            uploadTask.observe(.progress) { snapshot in
                // 0 -> 1 => 0 -> 0.9
                let ratio = (snapshot.progress!.fractionCompleted * 0.9) + 0.1
                progress(CGFloat(ratio))
            }
            
            uploadTask.observe(.failure) { snapshot in
                print("Failure")
                completion(nil, .fbError(error: snapshot.error))
            }
            
            uploadTask.observe(.success) { snapshot in
                print("Uploaded \(vId)")
                let video = Video(id: vId, author: authorId, title: title, muxPlaybackId: nil, muxAssetId: nil)
                completion(video, nil)
            }
            
        }
    }
}

class VideoServiceObservableWrapper: ObservableObject {
    @Published var videoSearchTerm: String = ""
    @Published var videoSearchResults: [Video] = []
    @Published var videoUploadData: VideoUpload
    
    private var videoService: VideoService
    
    init() {
        videoService = VideoService()
        videoUploadData = VideoUpload()
    }
    
    func runSearch() {
        videoService.searchVideos(query: videoSearchTerm) { (results, error) in
            guard results != nil else {
                // TODO: Error Handling
                print(error as Any)
                print("Error searching videos")
                return
            }
            self.videoSearchResults = results!
        }
    }
    
    func runUpload() {
        videoService.uploadVideo(upload: videoUploadData, { p in
            self.videoUploadData.uploadProgress = p
        }) { (results, error) in
            
            guard results != nil else {
                // TODO: Error Handling
                print(error as Any)
                print("Error uploading video")
                return
            }
            guard let video = results else {
                return
            }
            self.videoUploadData.uploadedVideo = video
            self.videoUploadData.author = video.author
            self.videoUploadData.title = video.title
            self.videoUploadData.id = video.id
        }
    }
    
}
