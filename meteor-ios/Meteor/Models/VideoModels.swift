//
//  VideoModels.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/5/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import Foundation
import CoreGraphics

struct Video: Identifiable {
    var id: String
    var author: String
    var title: String
    var muxPlaybackId: String?
    var muxAssetId: String?
    
    /*init() {
        self.id = ""
        self.author = ""
        self.title = ""
        self.muxPlaybackId = ""
        self.muxAssetId = ""
    }*/
}

struct VideoUpload {
    var id: String?
    var author: String?
    var title: String?
    var fsUrl: URL?
    var uploadProgress: CGFloat = 0
    var uploadedVideo: Video?
}

enum VideoUploadError: Error {
    case invalidParameter
    case invalidResponse
    case dataNotReachable
    case fbError(error: Error?)
}

enum VideoSearchError: Error {
    case fbError(error: Error?)
}
