//
//  VideoUploadSelect.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoUploadSelect: View {
    @ObservedObject var videoService: VideoServiceObservableWrapper
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                NavigationLink(destination: VideoUploadPickerController(videoService: videoService)) {
                    LargeButton(text: "Select from camera roll")
                }
                Spacer()
                if(videoService.videoUploadData.fsUrl != nil) {
                    NavigationLink(destination: VideoUploadDetails(videoService: videoService)) {
                        LargeButton(text: "Next")
                    }
                }
            }
            .navigationBarTitle("Select Video")
        }
    }
}

struct VideoUploadSelect_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadSelect(videoService: VideoServiceObservableWrapper())
    }
}
