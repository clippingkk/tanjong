//
//  UserManager.swift
//  ClippingKKNext-ClippingExtension
//
//  Created by hele on 2021/9/23.
//

import Foundation
class UserManager {
    static let shared = UserManager()
    static let ud = UserDefaults(suiteName: "group.com.annatarhe.clippingkk")!
    static let CDN_DOMAIN = "https://clippingkk-cdn.annatarhe.com/"
    static let bgImage = "https://wx1.sinaimg.cn/large/b8861941gy1gjuy0vzev3j22c0340e82.jpg"
    
    var hasAuthenticatedUser: Bool {
        get {
            return true
        }
    }
    
    var currentUid: Int {
        get {
            return UserManager.ud.integer(forKey: "app:my:id")
        }
    }
    var currentAuthToken: String {
        get {
            return UserManager.ud.string(forKey: "app:token") ?? ""
        }
    }
}
