//
//  clippingkk_widget.swift
//  clippingkk.widget
//
//  Created by AnnatarHe on 15/1/23.
//

import WidgetKit
import SwiftUI

fileprivate let emptyClipping = CKClippingItem(id: -1, content: "empty clipping", bookID: "", title: "", createdAt: "", pageAt: "", creator: CKClippingCreator(id: -1, name: "", avatar: ""))

fileprivate let holderClipping = CKClippingItem(id: -1, content: "Something awesome", bookID: "", title: "awesome", createdAt: "", pageAt: "", creator: CKClippingCreator(id: -1, name: "", avatar: ""))

fileprivate let emptyBook = WenquBook.init(
    id: -1, rating: 0, author: "widget example author", pubdate: "", translator: "", producer: "", totalPages: 1, series: "", originTitle: "", image: "", doubanID: 0, title: NSLocalizedString("widget example title", comment: ""), url: "", press: "", isbn: "", tags: [], authorIntro: "", summary: "", createdAt: "", updatedAt: "", catalog: ""
)

struct Provider: TimelineProvider {
    func getSnapshot(in context: Context, completion: @escaping (AwesomeClippingEntry) -> Void) {
        if context.isPreview {
            let entry = AwesomeClippingEntry(date: Date(), clipping: emptyClipping, book: emptyBook)
            completion(entry)
            return
        }
        
        let widgetType = UserManager.ud.string(forKey: "app:widgetType")
        
        if UserManager.shared.currentAuthToken == "" || widgetType == "public" {
            BackendService.LoadPublicRandomClipping(completion: { result in
                guard case .success(let data) = result else {
                    return
                }
                
                WenquBook.loadBooks(
                    ids: data.map { Int($0.bookID)! },
                    completion: { books in
                        let entry = AwesomeClippingEntry(
                            date: Date(),
                            clipping: data[0],
                            book: books[0]
                        )
                        completion(entry)
                    })
            })
            return
        }
        
        
        let uid = UserManager.shared.currentUid
        BackendService.LoadProfileClipping(uid: uid, completion: { result in
            guard case .success(let data) = result else {
                return
            }
            
            WenquBook.loadBooks(
                ids: data.map { Int($0.bookID)! },
                completion: { books in
                    let entry = AwesomeClippingEntry(
                        date: Date(),
                        clipping: data[0],
                        book: books[0]
                    )
                    completion(entry)
                })
        })
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<AwesomeClippingEntry>) -> Void) {
        let widgetType = UserManager.ud.string(forKey: "app:widgetType")
        
        if UserManager.shared.currentAuthToken == "" || widgetType == "public" {
            BackendService.LoadPublicRandomClipping(completion: { result in
                guard case .success(let data) = result else {
                    let entry = AwesomeClippingEntry(date: Date(), clipping: emptyClipping, book: emptyBook)
                    let now = Date()
                    let nextUpdateDate = Calendar.current.date(byAdding: .hour, value: 1, to: now)!
                    let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
                    completion(timeline)
                    return
                }
                
                WenquBook.loadBooks(
                    ids: data.map { Int($0.bookID)! },
                    completion: { books in
                        let now = Date()
                        let entries = data.enumerated().map { (index, c) in
                            let b = books.first(where: { $0.doubanID == Int(c.bookID) }) ?? emptyBook
                            return AwesomeClippingEntry(date: Calendar.current.date(byAdding: .hour, value: index, to: now)!, clipping: c, book: b)
                        }
                        let timeline = Timeline(entries: entries, policy: .atEnd)
                        completion(timeline)
                    })
            })
        } else {
            let uid = UserManager.shared.currentUid
            BackendService.LoadProfileClipping(uid: uid, completion: { result in
                guard case .success(let data) = result else {
                    let entry = AwesomeClippingEntry(date: Date(), clipping: emptyClipping, book: emptyBook)
                    let now = Date()
                    let nextUpdateDate = Calendar.current.date(byAdding: .hour, value: 1, to: now)!
                    let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
                    completion(timeline)
                    return
                }
                
                WenquBook.loadBooks(
                    ids: data.map { Int($0.bookID)! },
                    completion: { books in
                        let now = Date()
                        let entries = data.enumerated().map { (index, c) in
                            let b = books.first(where: { $0.doubanID == Int(c.bookID) }) ?? emptyBook
                            return AwesomeClippingEntry(date: Calendar.current.date(byAdding: .hour, value: index, to: now)!, clipping: c, book: b)
                        }
                        let timeline = Timeline(entries: entries, policy: .atEnd)
                        completion(timeline)
                    })
            })
        }
    }
    
    func placeholder(in context: Context) -> AwesomeClippingEntry {
        AwesomeClippingEntry(date: Date(), clipping: emptyClipping, book: emptyBook)
    }
}

struct AwesomeClippingEntry: TimelineEntry {
    var date: Date
    
    let clipping: CKClippingItem
    let book: WenquBook
}

struct clippingkkEntryView : View {
    @Environment(\.widgetFamily)
    var family: WidgetFamily
    
    @Environment(\.colorScheme)
    var colorScheme
    
    var entry: Provider.Entry
    
    var randomBackgroundImage: String {
        get {
            //            var w = Int(UIScreen.main.bounds.width)
            //            var h = Int(UIScreen.main.bounds.height)
            //
            //            if w < 300 {
            //                w = 300
            //            }
            //            if h < 100 {
            //                h = 100
            //            }
            
            return "https://wx1.sinaimg.cn/large/b8861941gy1gjuy0vzev3j22c0340e82.jpg"
            
            //            return "https://picsum.photos/\(h)/\(w)?blur=10&random=\(Int.random(in: 0..<1<<12))"
        }
    }
    
    var lineLimit: Int {
        get {
            switch family {
            case .systemExtraLarge:
                return 11
            case .systemLarge:
                return 10
            case .systemMedium:
                return 4
            default:
                return 11
            }
        }
    }
    
    var fontSzie: Int {
        get {
            switch family {
            case .systemMedium:
                if entry.clipping.content.count > 50 {
                    return 14
                }
                return 18
            case .systemLarge:
                fallthrough
            case .systemExtraLarge:
                if entry.clipping.content.count > 100 {
                    return 14
                }
                return 18
            default:
                return 14
            }
        }
    }
    
    var body: some View {
        let clipping = entry.clipping
        let bookTitle = entry.book.title
        ZStack {
//                        KFImage(URL(string: randomBackgroundImage))
//                            .diskCacheExpiration(.never)
//                            .resizable()
//                            .scaledToFill()
//                            .aspectRatio(contentMode: .fill)
//                            .clipped()
//                            .blur(radius: 48)
//                            .mask(Color.blue.opacity(0.5))
            AsyncImage(url: URL(string: randomBackgroundImage))
            VStack {
                Text(clipping.content)
                    .padding(.all, 10)
                    .font(.custom("LXGWWenKai-Regular", size: CGFloat(self.fontSzie)))
                    .lineSpacing(12 * 1.1)
                    .lineLimit(self.lineLimit)
                Text(bookTitle)
                    .foregroundColor(.gray)
                    .font(.custom("LXGWWenKai-Regular", size: 12))
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .padding(EdgeInsets(top: 0, leading: 0, bottom: 10, trailing: 10))
                    .lineLimit(1)
            }
        }
        .widgetURL(URL(string: "clippingkk:///dash/\(clipping.creator.id)/clippings/\(clipping.id)"))
    }
}

struct clippingkk_widget: Widget {
    let kind: String = "ClippingKKNext_Clipping"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            clippingkkEntryView(entry: entry)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .configurationDisplayName("widget title")
        .description("widget desc")
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
    }
}
