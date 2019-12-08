//
//  VideoQuery.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/1/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoQuery: View {
    @ObservedObject var videoService: VideoServiceObservableWrapper
    
    var body: some View {
        NavigationView {
            VStack {
                SearchBar(searchText: $videoService.videoSearchTerm, searchCallback: { _ in
                    self.videoService.runSearch()
                })
                    .padding()
                List {
                    ForEach(videoService.videoSearchResults) { video in
                        NavigationLink(destination: VideoWatch(video: video)) {
                            VideoQueryRow(name: video.title)
                        }
                    }
                }
                .resignKeyboardOnDragGesture()
                Spacer()
            }
            .navigationBarTitle("Search")
        }
        
    }
}



struct VideoQuery_Previews: PreviewProvider {
    static var previews: some View {
        VideoQuery(videoService: VideoServiceObservableWrapper())
    }
}
