//
//  backend.swift
//  ClippingKKNext-ClippingExtension
//
//  Created by hele on 2021/9/23.
//

import Foundation

class BackendService {
    static let BACKEND_ENDPOINT = "https://clippingkk-api.annatarhe.com/api/v2/graphql";
//    static let BACKEND_ENDPOINT = "https://a2f1784f5c.endpoints.dev/api/v2/graphql";
    
    static let randomClippingsQuery = """
query publicData {
  public {
    clippings {
      id
      content
      bookID
      title
      createdAt
      pageAt
      creator {
        id
        name
        avatar
      }
    }
  }
}
"""
    static let profileClippingsQuery = """
query profile($id: Int!) {
  me(id: $id) {
    id
    name
    email
    phone
    avatar
    recents {
      id
      bookID
      title
      content
      createdAt
      pageAt
      creator {
        id
        name
        avatar
      }
    }
  }
}

"""
    
    static func LoadPublicRandomClipping(completion: @escaping (Result<[CKClippingItem], Error>) -> Void) {
        var request = URLRequest(url: URL(string: BACKEND_ENDPOINT)!)
        request.httpMethod = "POST"
        request.addValue("Bearer \(UserManager.shared.currentAuthToken)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let parameters: [String: Any] = [
            "query": randomClippingsQuery,
            "operationName": "publicData",
        ]
        request.httpBody = try! JSONSerialization.data(withJSONObject: parameters)
        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data else {
                completion(.failure(error!))
                return
            }
            guard let decodedResponse = try? JSONDecoder().decode(PublicDataResponse.self, from: data) else {
                completion(.failure(CKRuntimeError.runtimeError("decode failed")))
                return
            }
            DispatchQueue.main.async {
                let result = decodedResponse.data.dataPublic.clippings
                completion(.success(result))
            }
        }.resume()
    }
    static func LoadProfileClipping(uid: Int, completion: @escaping (Result<[CKClippingItem], Error>) -> Void) {
        var request = URLRequest(url: URL(string: BACKEND_ENDPOINT)!)
        request.httpMethod = "POST"
        request.addValue("Bearer \(UserManager.shared.currentAuthToken)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let parameters: [String: Any] = [
            "variables": [
                "id": UserManager.shared.currentUid
            ],
            "query": profileClippingsQuery,
            "operationName": "profile",
        ]
        request.httpBody = try! JSONSerialization.data(withJSONObject: parameters)
        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data else {
                completion(.failure(error!))
                return
            }
            guard let decodedResponse = try? JSONDecoder().decode(ProfileDataResponse.self, from: data) else {
                completion(.failure(CKRuntimeError.runtimeError("decode failed")))
                return
            }
            DispatchQueue.main.async {
                let result = decodedResponse.data.me.recents
                completion(.success(result))
            }
        }.resume()
    }
}
