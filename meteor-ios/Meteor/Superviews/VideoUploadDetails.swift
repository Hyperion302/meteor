//
//  VideoUploadDetails.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoUploadDetails: View {
    @ObservedObject var videoService: VideoServiceObservableWrapper
    @State var title: String = ""
    
    var body: some View {
            VStack() {
                TextField("Title", text: $title, onEditingChanged: { _ in
                    self.videoService.videoUploadData.title = self.title
                })
                    .padding()
                if(title.count > 0) {
                    NavigationLink(destination: VideoUploadStatus(videoService: videoService)) {
                        LargeButton(text: "Upload")
                    }
                }
            }
            .navigationBarTitle("Add Details")
    }
}

struct VideoUploadDetails_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadDetails(videoService: VideoServiceObservableWrapper())
    }
}
