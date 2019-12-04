//
//  VideoQueryData.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/2/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import Foundation
import Firebase


class VideoQueryData: ObservableObject {
    @Published var query: String
    @Published var queryResults: [Video]
    lazy var db = Firestore.firestore()
    lazy var colRef = db.collection("videos")
    
    init() {
        self.queryResults = []
        self.query = ""
    }
    
    func runQuery() {
        // Basic query
        colRef.whereField("title", isEqualTo: query).whereField("status", isEqualTo: "transcoded").getDocuments() { (qs, error) in
            if error != nil {
                print("Error fetching search results")
            }
            else {
                self.queryResults = qs!.documents.map {
                    let data = $0.data()
                    return Video(
                        id: data["id"] as! String,
                        author: data["author"] as! String,
                        title: data["title"] as! String,
                        muxPlaybackId: data["muxPlaybackId"] as! String,
                        muxAssetId: data["muxAssetId"] as! String
                    )
                }
            }
        }
    }
}
