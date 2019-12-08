//
//  VideoWatch.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI
import AVFoundation

struct VideoWatch: View {
    let video: Video
    let player: AVPlayer
    
    init(video: Video) {
        self.video = video
        self.player = AVPlayer(url: URL(string: "https://stream.mux.com/\(video.muxPlaybackId ?? "").m3u8")!)
        self.player.play()
    }
    
    var body: some View {
        PlayerView(player: player)
            .onDisappear {
                self.player.pause()
            }
            .onAppear {
                self.player.play()
            }
    }
}

struct VideoWatch_Previews: PreviewProvider {
    static var previews: some View {
        VideoWatch(video: Video(id: "", author: "John Doe", title: "Good Video", muxPlaybackId: "", muxAssetId: ""))
    }
}
