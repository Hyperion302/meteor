import 'dart:io';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:meteor/models/channel.dart';
import 'package:meteor/models/video.dart';
import 'package:meteor/services/video.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:video_player/video_player.dart';

enum _UploadPhase {
  select,
  details,
  upload,
  uploaded,
}

class MeteorUploadScreen extends StatefulWidget {
  final Channel videoChannel;

  MeteorUploadScreen({Key key, this.videoChannel}) : super(key: key);

  @override
  _MeteorUploadScreenState createState() => _MeteorUploadScreenState();
}

class _MeteorUploadScreenState extends State<MeteorUploadScreen> {
  File _video;
  Stream<StorageTaskEvent> _uploadEventStream;
  VideoPlayerController _previewPlayerController;
  _UploadPhase _phase = _UploadPhase.select;

  final _titleInputController = TextEditingController();
  final _descriptionInputController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  
  @override
  void initState() {
    super.initState();
    _chooseVideo();
  }

  @override
  void dispose() {
    // TODO: Cancel upload if still running
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    List<Widget> currentStack;
    switch(_phase) {
      case _UploadPhase.select:
        currentStack = <Widget>[
          RaisedButton(
            onPressed: () {
              _chooseVideo();
            },
            child: Text('Choose Video'),
            color: Theme.of(context).primaryColor,
          ),
        ];
        break;
      case _UploadPhase.details:
        currentStack = videoDetailsWidget();
        break;
      case _UploadPhase.upload:
        currentStack = <Widget>[
          ...videoDetailsWidget(),
          progressIndicator(),
        ];
        break;
      case _UploadPhase.uploaded:
        currentStack = <Widget>[
          ...videoDetailsWidget(),
          progressIndicator(),
          RaisedButton(
            onPressed: () {
              Navigator.pop(context, true);
            },
            child: Text('Back'),
          ),
        ];
        break;
    }
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              Container(
                margin: EdgeInsets.only(
                  left: 20.0,
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    icon: Icon(Icons.cancel),
                    tooltip: 'Go Back',
                    onPressed: () {
                      Navigator.pop(context, false);
                    },
                  ),
                ),
              ),
              Center(
                child: Padding(
                  padding: EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    // If we're selecting, show the select button.  Else show the details widget
                    children: currentStack,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future< void > _chooseVideo() async {
    File video = await ImagePicker.pickVideo(source: ImageSource.gallery);
    setState(() {
      _video = video;
      _phase = _UploadPhase.details;
      _previewPlayerController = VideoPlayerController.file(video)
        ..initialize()
        .then((_) => {
          setState(() {}) // Render 1 frame for preview
        });
    });
  }

  Future< void > _uploadVideo() async {

    if(!_formKey.currentState.validate()) {
      return null;
    }
    setState(() {
      _phase = _UploadPhase.upload;
    });
    VideoUpload upload = VideoUpload(
      title: _titleInputController.text,
      description: _descriptionInputController.text,
      video: _video,
      channelID: widget.videoChannel.id
    );
    StorageUploadTask uploadTask = await uploadVideo(upload);
    setState(() {
      _uploadEventStream = uploadTask.events;
    });
    await uploadTask.onComplete;
    setState(() {
      _phase = _UploadPhase.uploaded;
    });
  }

  String titleValidator(String value) {
    if(value.length > 0) {
      return null;
    }
    else {
      return 'Invalid title';
    }
  }

  String descriptionValidator(String value) {
    if(value.length > 0 && value.length < 5000) {
      return null;
    }
    else {
      return 'Invalid description';
    }
  }

  Widget progressIndicator() {
    return StreamBuilder(
      stream: _uploadEventStream,
      builder: (BuildContext context, AsyncSnapshot<StorageTaskEvent> snapshot) {
        if(snapshot.hasError) {
          return Text('Error');
        }
        if(snapshot.hasData) {
          switch(snapshot.data.type) {
            case StorageTaskEventType.resume:
              // Set icon to none
              return CircularPercentIndicator(
                radius: 200.0,
                lineWidth: 13.0,
                progressColor: Theme.of(context).primaryColor,
                percent: snapshot.data.snapshot.bytesTransferred / snapshot.data.snapshot.totalByteCount,
              );
              break;
            case StorageTaskEventType.progress:
              // Update progress bar
              return CircularPercentIndicator(
                radius: 200.0,
                lineWidth: 13.0,
                progressColor: Theme.of(context).primaryColor,
                circularStrokeCap: CircularStrokeCap.round,
                percent: snapshot.data.snapshot.bytesTransferred / snapshot.data.snapshot.totalByteCount,
              );
              break;
            case StorageTaskEventType.pause:
              // Set icon to pause
              return CircularPercentIndicator(
                radius: 200.0,
                lineWidth: 13.0,
                progressColor: Theme.of(context).primaryColor,
                center: Icon(Icons.pause, size: 48.0),
                circularStrokeCap: CircularStrokeCap.round,
                percent: snapshot.data.snapshot.bytesTransferred / snapshot.data.snapshot.totalByteCount,
              );
              break;
            case StorageTaskEventType.success:
              // Set progress bar to full and change icon to check
              return CircularPercentIndicator(
                radius: 200.0,
                lineWidth: 13.0,
                progressColor: Theme.of(context).primaryColor,
                center: Icon(Icons.check, size: 48.0),
                circularStrokeCap: CircularStrokeCap.round,
                percent: 1,
              );
              break;
            case StorageTaskEventType.failure:
              // Set it to red and change icon to x
              return CircularPercentIndicator(
                radius: 200.0,
                lineWidth: 13.0,
                progressColor: Theme.of(context).primaryColor,
                center: Icon(Icons.cancel, size: 48.0),
                circularStrokeCap: CircularStrokeCap.round,
                percent: snapshot.data.snapshot.bytesTransferred / snapshot.data.snapshot.totalByteCount,
              );
              break;
          }
          return Container();
        }
        else {
          return CircularProgressIndicator();
        }
      },
    );
  }

  List<Widget> videoDetailsWidget() {
    if(_previewPlayerController.value.initialized) { // Make sure we're showing the video
      return <Widget>[
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20.0), // Clip container
            boxShadow: <BoxShadow> [
              BoxShadow(
                blurRadius: 0.0,
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20.0), // Clip video
            child: AspectRatio(
              aspectRatio: 16.0/9.0,
              child: VideoPlayer(_previewPlayerController),
            ),
          ),
        ),
        SizedBox(
          height: 40
        ),
        Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              TextFormField(
                enabled: _phase == _UploadPhase.details,
                decoration: InputDecoration(
                  labelText: 'Title',
                  hintText: 'My Favorite Video',
                ),
                validator: titleValidator,
                controller: _titleInputController,
              ),
              TextFormField(
                enabled: _phase == _UploadPhase.details,
                decoration: InputDecoration(
                  labelText: 'Description',
                  hintText: 'This video is my favorite kind of video',
                ),
                validator: descriptionValidator,
                controller: _descriptionInputController,
              ),
            ],
          ),
        ),
        SizedBox(
          height: 40
        ),
        RaisedButton(
          onPressed: () {
            _uploadVideo();
          },
          child: Text('Upload'),
          color: _phase == _UploadPhase.details ? Theme.of(context).primaryColor : Theme.of(context).disabledColor,
        )
      ];
    }
    else {
      return <Widget>[Container()];
    }
  }
  
}