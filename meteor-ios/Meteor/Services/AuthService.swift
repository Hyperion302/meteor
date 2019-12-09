//
//  AuthService.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/8/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

// Big thanks to https://benmcmahen.com/authentication-with-swiftui-and-firebase/

import Foundation
import Combine
import Firebase

class AuthService {
    var handle: AuthStateDidChangeListenerHandle?
    var user: User?
    
    func bind() {
        handle = Auth.auth().addStateDidChangeListener { (auth, user) in
            self.handleUserEvent(user)
        }
    }
    
    func handleUserEvent(_ user: FirebaseAuth.User?) {
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
    
    func unbind() {
        if let handle = handle {
            Auth.auth().removeStateDidChangeListener(handle)
        }
    }
}

class AuthServiceObservableWrapper: ObservableObject {
    @Published var user: User?
    
    private var authService: AuthService
    
    init(user: User? = nil) {
        self.user = user
        self.authService = AuthService()
    }
    
    deinit {
        authService.unbind()
    }
    
    func listen() {
        authService.bind()
    }
    
    func unbind() {
        authService.unbind()
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
