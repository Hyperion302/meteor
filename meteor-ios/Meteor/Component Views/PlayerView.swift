//
//  PlayerView.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/4/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import Foundation
import AVFoundation
import SwiftUI

struct PlayerView: UIViewRepresentable {
    let player: AVPlayer
    func updateUIView(_ uiView: UIView, context: UIViewRepresentableContext<PlayerView>) {
        
    }
    func makeUIView(context: Context) -> UIView {
        return PlayerUIView(player: player)
    }
}

class PlayerUIView: UIView {
    private let playerLayer = AVPlayerLayer()
    private let player: AVPlayer
    
    init(player: AVPlayer) {
        self.player = player
        super.init(frame: .zero)
        playerLayer.player = player
        layer.addSublayer(playerLayer)
        
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        playerLayer.frame = bounds
    }
    
    
}
