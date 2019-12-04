//
//  VideoQuery.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/1/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoQuery: View {
    @ObservedObject var videoQueryData: VideoQueryData
    
    var body: some View {
        NavigationView {
            VStack {
                SearchBar(searchText: $videoQueryData.query, searchCallback: { _ in
                    self.videoQueryData.runQuery()
                })
                    .padding()
                List {
                    ForEach(videoQueryData.queryResults) { video in
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
        VideoQuery(videoQueryData: VideoQueryData())
    }
}
