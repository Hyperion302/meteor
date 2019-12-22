//
//  VideoUploadStatus.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoUploadStatus: View {
    @ObservedObject var videoService: VideoServiceObservableWrapper
    
    var body: some View {
        VStack(spacing: 20) {
            // Text($uploadData.statusMessage)
            ZStack {
                LoadingCircle(value: $videoService.videoUploadData.uploadProgress)
            }
        }
        .onAppear {
            self.videoService.runUpload()
        }
    }
}

struct VideoUploadStatus_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadStatus(videoService: VideoServiceObservableWrapper())
    }
}
