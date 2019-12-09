//
//  AuthModels.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/8/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import Foundation

struct User {
    var uid: String
    var email: String?
    
    static let `default` = Self(
        uid: "asdfa",
        email: "you@example.com"
    )
    
    init(uid: String, email: String?) {
        self.uid = uid
        self.email = email
    }
}
