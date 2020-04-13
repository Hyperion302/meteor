import UIKit
import Flutter
import Auth0

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {

    let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
    let authChannel = FlutterMethodChannel(name: "swish/auth",
                                              binaryMessenger: controller.binaryMessenger)
    authChannel.setMethodCallHandler({
      (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
      // Note: this method is invoked on the UI thread.
        switch(call.method) {
        case "login":
            self.authLogin(result: result);
        case "logout":
            self.authLogout(result: result);
        case "loggedIn":
            self.authGetLoggedIn(result: result);
        case "token":
            self.authGetToken(result: result);
        default:
            result(FlutterMethodNotImplemented)
        }
    })

    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any]) -> Bool {
    return Auth0.resumeAuth(url, options: options)
  }

    // MARK: Swish Auth code

    let credentialsManager = CredentialsManager(authentication: Auth0.authentication())

    private func authGetToken(result: @escaping FlutterResult) {
        credentialsManager.credentials { error, credentials in
            guard error == nil, let credentials = credentials else {
                // Handle error
                print("Error: \(String(describing: error))")
                result(FlutterError(
                    code: "FAILURE",
                    message: "Failed to retrieve stored credentials",
                    details: nil
                ));
                return;
            }
            result(credentials.accessToken);
        }
    }

    private func authGetLoggedIn(result: FlutterResult) {
        result(credentialsManager.hasValid())
    }

    private func authLogin(result: @escaping FlutterResult) {
        Auth0
        .webAuth()
        .scope("openid offline_access")
        .audience("backend")
        .start {
            switch $0 {
                case .failure(let error):
                    // Handle the error
                    print("Error: \(error)");
                    result(FlutterError(
                        code: "FAILURE",
                        message: "Authentication Failed",
                        details: nil
                    ));
                case .success(let credentials):
                    // Do something with credentials e.g.: save them.
                    // Auth0 will automatically dismiss the hosted login page
                    self.credentialsManager.store(credentials: credentials)
                    result(nil);
                }
            }
    }

    private func authLogout(result: @escaping FlutterResult) {
        credentialsManager.revoke { error in
            guard error == nil else {
                // Handle error
                print("Error: \(String(describing: error))")
                result(FlutterError(
                    code: "FAILURE",
                    message: "Failed to revoke token",
                    details: nil
                ));
                return;
            }
            result(nil);
        }
    }
}


