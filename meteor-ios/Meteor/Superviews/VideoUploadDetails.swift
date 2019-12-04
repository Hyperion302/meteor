//
//  VideoUploadDetails.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoUploadDetails: View {
    @ObservedObject var uploadData: UploadData
    @State var title: String = ""
    
    var body: some View {
            VStack(spacing: 20) {
                TextField("Title", text: $title, onEditingChanged: { _ in
                    self.uploadData.title = self.title
                })
                    .padding()
                if(title.count > 0) {
                    NavigationLink(destination: VideoUploadStatus(uploadData: uploadData)) {
                        LargeButton(text: "Upload")
                    }
                }
            }
            .navigationBarTitle("Add Details")
    }
}

struct VideoUploadDetails_Previews: PreviewProvider {
    static var previews: some View {
        VideoUploadDetails(uploadData: UploadData())
    }
}
