//
//  LoadingCircle.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/1/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct LoadingCircle: View {
    @Binding var value: CGFloat
    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0, to: value)
                .stroke(Color.blue, lineWidth:5)
                .frame(width:150)
                .rotationEffect(Angle(degrees:-90))
            if(value == 1) {
                Image(systemName: "checkmark")
                    .resizable()
                    .frame(width: 64, height: 64)
            }
        }
        
    }
}

struct LoadingCircle_Previews: PreviewProvider {
    static var previews: some View {
        LoadingCircle(value: .constant(0.5))
    }
}
