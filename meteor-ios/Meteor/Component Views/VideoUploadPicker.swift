//
//  VideoUploadPicker.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI

struct VideoUploadPicker: View {
    @Binding var url: NSURL
    var body: some View {
        VideoUploadPickerController(url: $url)
    }
}

struct VideoUploadPicker_Previews: PreviewProvider {
    @State static var url = NSURL(fileURLWithPath: "/private/var/mobile/Containers/Data/PluginKitPlugin/088E4344-D8A2-4A55-8C18-3D11A7AE315E/tmp/trim.FBB04910-C420-4E52-9AA5-25AD25790F4E.MOV")
    static var previews: some View {
        VideoUploadPicker(url: $url)
    }
}
