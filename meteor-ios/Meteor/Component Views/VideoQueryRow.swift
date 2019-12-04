//
//  VideoQueryRow.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/2/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoQueryRow: View {
    @State var name: String
    var body: some View {
        Text(name)
    }
}

struct VideoQueryRow_Previews: PreviewProvider {
    static var previews: some View {
        VideoQueryRow(name: "Test Video")
    }
}
