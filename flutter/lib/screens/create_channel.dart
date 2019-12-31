import 'package:flutter/material.dart';
import 'package:meteor/services/channel.dart';

class MeteorCreateChannelScreen extends StatefulWidget {
  MeteorCreateChannelScreen({Key key}) : super(key: key);

  @override
  _MeteorCreateChannelScreenState createState() => _MeteorCreateChannelScreenState();
}

class _MeteorCreateChannelScreenState extends State<MeteorCreateChannelScreen> {

  final _nameInputController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _loading = false;

  String nameValidator(String value) {
    if(value.length == 0) {
      return 'Channel name must be more than 0 characters';
    }
    return null;
  }

  Future< void > create() async {
    setState(() {
      _loading = true;
    });
    await createChannel(_nameInputController.text);
    setState(() {
      _loading = false;
    });
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
                    Navigator.pop(context);
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
          create();
          Navigator.pop(context);
        },
        icon: Icon(Icons.check),
        label: Text('Create'),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}