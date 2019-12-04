//
//  SearchBar.swift
//  Meteor
//
//  Created by Joseph Shetaye on 12/1/19.
//  Copyright © 2019 Joseph Shetaye. All rights reserved.
//

// Big thanks to: https://gist.github.com/jstheoriginal/ebf298b33cdb4a88c3ac5f17f058aa1f

import SwiftUI


struct SearchBar : View {
    @Binding var searchText: String
    @State var searchCallback: (Bool) -> Void = { _ in return }
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass").foregroundColor(.secondary)
            TextField("Search", text: $searchText, onEditingChanged: searchCallback)
            Button(action: {
                self.searchText = ""
            }) {
                Image(systemName: "xmark.circle.fill").foregroundColor(.secondary).opacity(searchText == "" ? Double(0) : Double(1))
            }
        }.padding(.horizontal)
    }
}

extension UIApplication {
    func endEditing(_ force: Bool) {
        self.windows
            .filter{$0.isKeyWindow}
            .first?
            .endEditing(force)
    }
}

struct ResignKeyboardOnDragGesture: ViewModifier {
    var gesture = DragGesture().onChanged{_ in
        UIApplication.shared.endEditing(true)
    }
    func body(content: Content) -> some View {
        content.gesture(gesture)
    }
}

extension View {
    func resignKeyboardOnDragGesture() -> some View {
        return modifier(ResignKeyboardOnDragGesture())
    }
}

struct SearchBar_Previews: PreviewProvider {
    static var previews: some View {
        SearchBar(searchText: .constant(""))
    }
}
