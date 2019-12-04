//
//  AuthSession.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

// Big thanks to https://benmcmahen.com/authentication-with-swiftui-and-firebase/

import Foundation
import Combine
import Firebase

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

class AuthSession: ObservableObject {
    @Published var user: User?
    @Published var handle: AuthStateDidChangeListenerHandle?
    
    init(user: User? = nil) {
        self.user = user
    }
    
    deinit {
        unbind()
    }
    
    func listen() {
        handle = Auth.auth().addStateDidChangeListener { (auth, user) in
            if let user = user {
                print("Got user: \(user)")
                self.user = User(
                    uid: user.uid,
                    email: nil
                )
            }
            else {
                self.user = nil
            }
        }
    }
    
    func unbind() {
        if let handle = handle {
            Auth.auth().removeStateDidChangeListener(handle)
        }
    }
    
    func signUp(
        email: String,
        password: String,
        handler: @escaping AuthDataResultCallback
        ) {
        Auth.auth().createUser(withEmail: email, password: password, completion: handler)
    }

    func signIn(
        email: String,
        password: String,
        handler: @escaping AuthDataResultCallback
        ) {
        Auth.auth().signIn(withEmail: email, password: password, completion: handler)
    }

    func signOut () -> Bool {
        do {
            try Auth.auth().signOut()
            self.user = nil
            return true
        } catch {
            return false
        }
    }
}
