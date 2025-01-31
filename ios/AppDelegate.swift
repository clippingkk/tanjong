import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash // ⬅️ add this import

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
    
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        self.moduleName = "tanjong"
      
        self.dependencyProvider = RCTAppDependencyProvider()
        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        self.initialProps = [:]
        
        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)
        
        // Define UNUserNotificationCenter
        let center = UNUserNotificationCenter.current()
        center.delegate = self
        
        return result
    }
    
  
   override func sourceURL(for bridge: RCTBridge) -> URL? {
     self.bundleURL()
   }
  
   override func bundleURL() -> URL? {
 #if DEBUG
     RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
 #else
     Bundle.main.url(forResource: "main", withExtension: "jsbundle")
 #endif
   }
  
  override func customize(_ rootView: RCTRootView!) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView) // ⬅️ initialize the splash screen
  }
    
    // MARK: - Deep Linking
    
    override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return RCTLinkingManager.application(app, open: url, options: options)
    }
    
    // MARK: - Universal Links
    
    override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    // MARK: - Push Notifications
    
//    override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
//        RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
//    }
//    
//    override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
//        RNCPushNotificationIOS.didFailToRegisterForRemoteNotifications(withError: error)
//    }
//    
//    override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
//        RNCPushNotificationIOS.didReceive(userInfo, fetchCompletionHandler: completionHandler)
//    }
//    
//    // MARK: - UNUserNotificationCenterDelegate
//    
//    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
//        RNCPushNotificationIOS.didReceive(response)
//        completionHandler()
//    }
//    
//    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
//        completionHandler([.sound, .alert, .badge])
//    }
}
