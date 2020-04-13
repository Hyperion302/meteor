import 'package:flutter/services.dart';
import 'dart:convert';

class AuthService {
  static const platformChannel = MethodChannel('swish/auth');

  static Future<String> get token async {
    return platformChannel.invokeMethod('token');
  }

  static Future<String> get userID async {
    final jwtToken = await token;
    final parts = jwtToken.split('.');
    // Assume valid token
    var normalized = base64Url.normalize(parts[1]);
    var resp = utf8.decode(base64Url.decode(normalized));
    var payloadMap = json.decode(resp);
    return payloadMap["sub"];
  }

  static Future<bool> get loggedIn async {
    return platformChannel.invokeMethod('loggedIn');
  }

  static Future<void> login() async {
    await platformChannel.invokeMethod('login');
  }

  static Future<void> logout() async {
    await platformChannel.invokeMethod('logout');
  }
}
