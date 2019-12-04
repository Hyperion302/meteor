//
//  LargeButton.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/1/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct LargeButton: View {
    var text: String
    var body: some View {
        Text(text)
            .fontWeight(.semibold)
            .font(.subheadline)
            .frame(minWidth: 0, maxWidth: .infinity)
            .padding()
            .foregroundColor(.black)
            .background(Color(.white))
            .cornerRadius(40)
            .padding(.horizontal, 20)
    }
}

struct LargeButton_Previews: PreviewProvider {
    static var previews: some View {
        LargeButton(text: "Click me")
    }
}
