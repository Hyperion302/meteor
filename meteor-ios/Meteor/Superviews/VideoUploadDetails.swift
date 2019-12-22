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
    @Binding var uploadViewState: UploadViewState
    @State var title: String = ""
    
    var body: some View {
            VStack() {
                TextField("Title", text: $title, onEditingChanged: { _ in
                    self.videoService.videoUploadData.title = self.title
                    print(self.title)
                })
                    .padding()
                if(title.count > 0) {
                    Button(action: {
                        print(self.title)
                        self.uploadViewState = .uploading
                        print(self.title)
                    }) {
                        LargeButton(text: "Upload")
                    }
                }
            }
            .navigationBarTitle("Add Details")
    }
}

struct VideoUploadDetails_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadDetails(videoService: VideoServiceObservableWrapper(), uploadViewState: .constant(.details))
    }
}
