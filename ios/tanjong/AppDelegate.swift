import UIKit
import React
import UserNotifications
import RNBootSplash

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
 
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
      let delegate = ReactNativeDelegate()
      let factory = RCTReactNativeFactory(delegate: delegate)
      delegate.dependencyProvider = RCTAppDependencyProvider()
  
      reactNativeDelegate = delegate
      reactNativeFactory = factory
  
      window = UIWindow(frame: UIScreen.main.bounds)
  
      factory.startReactNative(
        withModuleName: "tanjong",
        in: window,
        launchOptions: launchOptions
      )
      
        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        
        if let rootViewController = window?.rootViewController {
            RNBootSplash.initWithStoryboard("BootSplash", rootView: rootViewController.view)
        }
        
        // Define UNUserNotificationCenter
        let center = UNUserNotificationCenter.current()
        center.delegate = self
        
        return true
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
    override var sourceURL: URL? {
        return bundleURL
    }
    
    var bundleURL: URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
    
    // MARK: - Deep Linking
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return RCTLinkingManager.application(app, open: url, options: options)
    }
    
    // MARK: - Universal Links
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    // MARK: - Push Notifications
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        RNCPushNotificationIOS.didFailToRegisterForRemoteNotifications(withError: error)
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        RNCPushNotificationIOS.didReceive(userInfo, fetchCompletionHandler: completionHandler)
    }
    
    // MARK: - UNUserNotificationCenterDelegate
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        RNCPushNotificationIOS.didReceive(response)
        completionHandler()
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.sound, .alert, .badge])
    }
}