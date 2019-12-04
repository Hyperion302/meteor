//
//  UploadData.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import Combine
import Foundation
import Firebase
import FirebaseStorage
import Photos

class UploadData: ObservableObject {
    @Published var id: String?
    @Published var fsURL: URL?
    @Published var title: String?
    @Published var uploadProgress: CGFloat
    @Published var statusMessage: String
    lazy var functions = Functions.functions()
    lazy var createVideoCallable = functions.httpsCallable("createVideo")
    lazy var storage = Storage.storage(url: "gs://meteor-videos")
    
    init(id: String? = nil, fsURL: URL? = nil) {
        self.id = id
        self.fsURL = fsURL
        self.uploadProgress = 0
        self.statusMessage = "Preparing for upload"
    }
    func startUpload() -> Bool {
        // Assumes all we have is the file path, if not return false
        if(fsURL == nil) { return false }
        createVideoCallable.call([
            "title": title
        ]) { (result, error) in
            print("Video ID acquired")
            if let id = (result?.data as? [String: Any])?["id"] as? String {
                print("Created video \(id)")
                self.id = id
            }
            self.uploadProgress = 0.1
            
            // MARK: Video Upload Code
            let videoData = try! Data(contentsOf: self.fsURL!, options: .dataReadingMapped)
            
            
            let ref = self.storage.reference(forURL: "gs://meteor-videos/masters/\(Auth.auth().currentUser!.uid)/\(self.id!)")
            let uploadTask = ref.putData(videoData, metadata: nil)
            self.statusMessage = "Uploading to cloud"
            uploadTask.observe(.progress) { snapshot in
                // 0 -> 1 => 0 -> 0.9
                let ratio = (snapshot.progress!.fractionCompleted * 0.9) + 0.1
                print("Set progress to \(ratio)")
                self.uploadProgress = CGFloat(ratio)
            }
            
            uploadTask.observe(.failure) { snapshot in
                print(snapshot.error.debugDescription)
            }
            
            uploadTask.observe(.success) { snapshot in
                print("Success")
                self.statusMessage = "Complete"
                self.uploadProgress = 0
            }
        }
        return true;
    }
}
