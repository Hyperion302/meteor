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
    @Binding var uploadViewState: UploadViewState
    
    var body: some View {
        VStack(spacing: 20) {
            Button(action: {
                print("set uploadViewState to cameraRoll")
                self.uploadViewState = .cameraRoll
            }) {
                LargeButton(text: "Select from camera roll")
            }
            Spacer()
            if(videoService.videoUploadData.fsUrl != nil) {
                Button(action: {
                    self.uploadViewState = .details
                }) {
                    LargeButton(text: "Next")
                }
                
            }
        }
    }
}

struct VideoUploadSelect_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadSelect(videoService: VideoServiceObservableWrapper(), uploadViewState: .constant(.select))
    }
}
