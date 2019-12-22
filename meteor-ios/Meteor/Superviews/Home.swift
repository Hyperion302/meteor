//
//  Home.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

enum HomeViewState {
    case videoSearch
    case videoUpload
}

struct Home: View {
    @ObservedObject var authService: AuthServiceObservableWrapper
    @State var videoService: VideoServiceObservableWrapper = VideoServiceObservableWrapper()
    @State var homeViewState: HomeViewState = .videoUpload
    
    var body: some View {
        Group {
            if authService.user != nil {
                if homeViewState == .videoSearch {
                    VideoQuery(videoService: videoService)
                        tabItem {
                            Image(systemName: "play.rectangle.fill")
                            Text("Watch")
                    }
                }
                if homeViewState == .videoUpload {
                    VideoUploadView(videoService: videoService)
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
            self.authService.listen()
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
