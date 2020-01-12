import 'dart:io';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/services/channel.dart';

class MeteorCreateChannelScreen extends StatefulWidget {
  MeteorCreateChannelScreen({Key key}) : super(key: key);

  @override
  _MeteorCreateChannelScreenState createState() => _MeteorCreateChannelScreenState();
}

class _MeteorCreateChannelScreenState extends State<MeteorCreateChannelScreen> {

  final _nameInputController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  StorageUploadTask _uploadTask;
  File _icon;
  
  bool _loading = false;

  String nameValidator(String value) {
    if(value.length == 0) {
      return 'Channel name must be more than 0 characters';
    }
    return null;
  }

  Future< void > _create() async {
    setState(() {
      _loading = true;
    });
    Channel createdChannel = await createChannel(_nameInputController.text, _icon != null);
    if(_icon != null) {
      StorageReference videoRef = FirebaseStorage.instance.ref().child('channelAssets/${createdChannel.id}/icon');
      StorageUploadTask uploadTask = videoRef.putFile(_icon);
      setState(() {
        _uploadTask = uploadTask;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: 20.0,
          ),
          child: Column(
            children: <Widget>[
              Align(
                alignment: Alignment.centerLeft,
                child: IconButton(
                  icon: Icon(Icons.cancel),
                  tooltip: 'Go Back',
                  onPressed: () {
                    Navigator.pop(context, false);
                  },
                ),
              ),
              Form(
                key: _formKey,
                child: TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Name',
                    hintText: 'Best Channel Ever'
                  ),
                  controller: _nameInputController,
                  validator: nameValidator,
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(
                  vertical: 20.0
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: <Widget>[
                      Text('Channel Icon',
                        style: TextStyle(
                          fontSize: 20.0,
                        ),
                      ),
                      Text('(optional)',
                        style: TextStyle(
                          fontSize: 10.0,
                          fontStyle: FontStyle.italic,
                          color: Colors.grey
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              buildChannelIconSection(),
              buildProgressIndicator(),
            ],
          )
        )
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          if(!_formKey.currentState.validate()) {
            return;
          }
          if(_loading) {
            return;
          }
          _create();
        },
        icon: Icon(Icons.check),
        label: Text('Create'),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget buildChannelIconSection() {
    if(_icon == null) {
      return RaisedButton(
        onPressed: () {
          _chooseImage();
        },
        child: Text('Choose Image'),
      );
    }
    return GestureDetector(
      onTap: () {
        _chooseImage();
      },
      child: CircleAvatar(
        radius: 50.0,
        backgroundImage: FileImage(_icon),
      ),
    );
  }

  Future< void > _chooseImage() async {
    File image = await ImagePicker.pickImage(source: ImageSource.gallery);
    setState(() {
      _icon = image;
    });
  }

  Widget buildProgressIndicator() {
    if(_uploadTask == null) {
      return Container();
    }
    return StreamBuilder(
      stream: _uploadTask.events,
      builder: (BuildContext context, AsyncSnapshot<StorageTaskEvent> snap) {
        if(snap.hasError) {
          return Text('error');
        }
        if(snap.hasData) {
          switch(snap.data.type) {
            case StorageTaskEventType.resume:
            case StorageTaskEventType.progress:
            case StorageTaskEventType.pause:
              return CircularProgressIndicator();
            case StorageTaskEventType.success:
              Navigator.pop(context, true);
              return Icon(Icons.check);
            case StorageTaskEventType.failure:
              _loading = false;
              return Icon(Icons.cancel);
          }
        }
        return Container();
      }
    );
  }
}