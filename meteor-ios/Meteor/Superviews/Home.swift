//
//  Home.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct Home: View {
    @ObservedObject var authService: AuthServiceObservableWrapper
    @State var videoService: VideoServiceObservableWrapper = VideoServiceObservableWrapper()
    
    var body: some View {
        Group {
            if(session.user != nil) {
                TabView {
                    VideoQuery(videoService: videoService)
                        .tabItem {
                            Image(systemName: "play.rectangle.fill")
                            Text("Watch")
                        }
                    VideoUploadSelect(videoService: videoService)
                        .tabItem {
                            Image(systemName: "plus.square.fill")
                            Text("Upload")
                        }
                    
                }
            }
            else {
                Authentication(authService: authService)
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
        Home(authService: AuthServiceObservableWrapper())
    }
}

#endif
