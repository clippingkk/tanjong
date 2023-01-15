//
//  wenqu.swift
//  Runner
//
//  Created by hele on 2021/9/23.
//

import Foundation

// MARK: - WenquResponse
struct WenquResponse: Codable {
    let count: Int
    let books: [WenquBook]
}

// MARK: - WenquBook
struct WenquBook: Codable, Identifiable {
    let id: Int
    let rating: Double?
    let author: String
    let pubdate: String
    let translator, producer: String?
    let totalPages: Int
    let series: String?
    let originTitle: String
    let image: String
    let doubanID: Int
    let title: String
    let url: String
    let press, isbn: String
    let tags: [String]?
    let authorIntro: String
    let summary: String?
    let createdAt, updatedAt: String
    let catalog: String?

    enum CodingKeys: String, CodingKey {
        case id, rating, author, pubdate, translator, producer, totalPages, series, originTitle, image
        case doubanID = "doubanId"
        case title, url, press, isbn, tags, authorIntro, summary, createdAt, updatedAt, catalog
    }
    
    static func loadBooks(ids: [Int], completion: @escaping ([WenquBook]) -> Void) {
        guard ids.count > 0 else {
            completion([])
            return
        }
        
//        let headers: HTTPHeaders = [
//            "x-simple-check": ""
//        ]
        
        var query = ""
        
        for i in ids {
            query += "&dbIds=\(i)"
        }
        
        query.remove(at: query.startIndex)
        guard let url = URL(string: "https://wenqu.annatarhe.cn/api/v1/books/search?" + query) else {
            print("Invalid URL")
            return
        }
        var request = URLRequest(url: url)
        request.addValue("500ae25e22b5de1b6c44a7d78908e7b7cc63f97b55ea9cdc50aa8fcd84b1fcba", forHTTPHeaderField: "x-simple-check")
        URLSession.shared.dataTask(with: request) { data, response, error in
            if error != nil {
                print(error)
                return
            }
            if let data = data {
                if let decodedResponse = try? JSONDecoder().decode(WenquResponse.self, from: data) {
                    // we have good data – go back to the main thread
                    DispatchQueue.main.async {
                        // update our UI
                        let result = decodedResponse.books
                        completion(result)
                    }

                    // everything is good, so we can exit
                    return
                }
            }
        }.resume()

    }
}
