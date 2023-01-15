//
//  types.swift
//  Runner
//
//  Created by hele on 2021/9/23.
//

import Foundation

enum CKRuntimeError: Error {
    case runtimeError(String)
}








// MARK: - PublicDataResponse
struct PublicDataResponse: Codable {
    let data: PublicDataResponseDataClass
}

// MARK: - DataClass
struct PublicDataResponseDataClass: Codable {
    let dataPublic: Public

    enum CodingKeys: String, CodingKey {
        case dataPublic = "public"
    }
}

// MARK: - Public
struct Public: Codable {
    let clippings: [CKClippingItem]
}


// MARK: - ProfileDataResponse
struct ProfileDataResponse: Codable {
    let data: ProfileDataResponseDataClass
}

struct ProfileDataResponseDataClass: Codable {
    let me: ProfileDataResponseMe
}

// MARK: - Me
struct ProfileDataResponseMe: Codable {
    let id: Int
    let name: String
    let email, phone: String
    let avatar: String
    let recents: [CKClippingItem]
}



// MARK: - Clipping
struct CKClippingItem: Codable {
    let id: Int
    let content, bookID, title, createdAt, pageAt: String
    let creator: CKClippingCreator
}

// MARK: - Creator
struct CKClippingCreator: Codable {
    let id: Int
    let name, avatar: String
}
