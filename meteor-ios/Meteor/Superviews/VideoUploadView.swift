//
//  VideoUpload.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/8/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

enum UploadViewState {
    case select
    case cameraRoll
    case details
    case uploading
}

struct VideoUploadView: View {
    @ObservedObject var videoService: VideoServiceObservableWrapper
    @State var uploadViewState: UploadViewState = .select
    
    var body: some View {
        Group {
            if uploadViewState == .select {
                VideoUploadSelect(videoService: videoService, uploadViewState: $uploadViewState)
            }
            if uploadViewState == .cameraRoll {
                VideoUploadPickerControllerWrapper(videoService: videoService, uploadViewState: $uploadViewState)
            }
            if uploadViewState == .details {
                VideoUploadDetails(videoService: videoService, uploadViewState: $uploadViewState)
            }
            if uploadViewState == .uploading {
                VideoUploadStatus(videoService: videoService)
            }
        }
    }
}

struct VideoUploadView_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadView(videoService: VideoServiceObservableWrapper())
    }
}
