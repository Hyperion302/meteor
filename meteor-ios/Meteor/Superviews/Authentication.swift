//
//  Authentication.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct Authentication: View {
    @ObservedObject var session: AuthSession
    @State var email: String = ""
    @State var password: String = ""
    @State var loading: Bool = false
    @State var error: Bool = false
    
    func signIn() {
        loading = true
        session.signIn(email: email, password: password) { (result, error) in
            self.loading = false
            if(error != nil) {
                self.error = true
                
            }
            else {
                self.error = false
                self.email = ""
                self.password = ""
            }
        }
    }
    
    var body: some View {
        VStack {
            TextField("Email", text: $email)
                .textContentType(.username)
            SecureField("Password", text: $password)
                .textContentType(.password)
            if(error) {
                Text("Error")
            }
            Button(action: signIn) {
                Text("Sign In")
            }
        }
        
        
    }
}

struct Authentication_Previews: PreviewProvider {
    static var previews: some View {
        Authentication(session: AuthSession())
    }
}
