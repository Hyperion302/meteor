//
//  Home.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct Home: View {
    @ObservedObject var session: AuthSession
    @State var uploadData: UploadData = UploadData()
    @State var videoQueryData: VideoQueryData = VideoQueryData()
    
    var body: some View {
        Group {
            if(session.user != nil) {
                TabView {
                    VideoQuery(videoQueryData: videoQueryData)
                        .tabItem {
                            Image(systemName: "play.rectangle.fill")
                            Text("Watch")
                        }
                    VideoUploadSelect(uploadData: uploadData)
                        .tabItem {
                            Image(systemName: "plus.square.fill")
                            Text("Upload")
                        }
                    
                }
            }
            else {
                Authentication(session: session)
            }
        }
        .onAppear {
            self.session.listen()
        }
        
    }
}

#if DEBUG

struct Home_Previews: PreviewProvider {
    static var previews: some View {
        Home(session: AuthSession())
    }
}

#endif
