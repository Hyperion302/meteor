//
//  VideoUploadPicker.swift
//  Meteor
//
//  Created by Joseph Shetaye on 11/30/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

import SwiftUI
import UIKit
import Photos

struct VideoUploadPickerController: UIViewControllerRepresentable {
    typealias UIViewControllerType = UIImagePickerController
    
    @ObservedObject var uploadData: UploadData
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<VideoUploadPickerController>) -> VideoUploadPickerController.UIViewControllerType {
        let controller = UIImagePickerController()
        controller.allowsEditing = false
        controller.mediaTypes = ["public.movie"]
        controller.delegate = context.coordinator
        return controller
    }
    
    func updateUIViewController(_ uiView: VideoUploadPickerController.UIViewControllerType, context: UIViewControllerRepresentableContext<VideoUploadPickerController>) {

    }
    
    // MARK: Coordinator / Delegate
    
    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        var parent: VideoUploadPickerController
    
        init(_ imagePickerController: VideoUploadPickerController) {
            self.parent = imagePickerController
        }
        
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            self.parent.presentationMode.wrappedValue.dismiss()
            picker.dismiss(animated: true, completion: nil)
            print("Cancelled")
        }
        
        func imagePickerController(_ picker: UIImagePickerController,
                                   didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            guard let url = info[UIImagePickerController.InfoKey.mediaURL] as? URL else {
                self.parent.presentationMode.wrappedValue.dismiss()
                picker.dismiss(animated: true, completion: nil)
                return
            }
            print(url.absoluteString)
            self.parent.uploadData.fsURL = url
            self.parent.presentationMode.wrappedValue.dismiss()
            picker.dismiss(animated: true, completion: nil)
        }
    }
    
}

struct VideoUploadPickerController_Previews: PreviewProvider {
    @State static var url: String = "/private/var/mobile/Containers/Data/PluginKitPlugin/088E4344-D8A2-4A55-8C18-3D11A7AE315E/tmp/trim.FBB04910-C420-4E52-9AA5-25AD25790F4E.MOV"
    static var previews: some View {
        VideoUploadPickerController(uploadData: UploadData())
    }
}
