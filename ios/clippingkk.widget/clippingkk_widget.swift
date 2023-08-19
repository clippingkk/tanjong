//
//  clippingkk_widget.swift
//  clippingkk.widget
//
//  Created by AnnatarHe on 15/1/23.
//

import WidgetKit
import SwiftUI

let bgs: [String] = [ "https://ck-cdn.annatarhe.cn/lrYm87HbNXn7rU1vBdh4iC7dXUGB8St2/DSCF1642.jpg",
    "https://ck-cdn.annatarhe.cn/k0eLe3mUbrMrYqJw9HPFDmSWIBqmnLpX/DSCF1611.jpg",
    "https://ck-cdn.annatarhe.cn/UmzmeThtEhYvVewG5TkBmS8IEGiAGSwI/DSCF1609.jpg",
    "https://ck-cdn.annatarhe.cn/nwTvnaDfnzGR4axGYCMQ9my0Sq2MGk0c/DSCF1575.jpg",
    "https://ck-cdn.annatarhe.cn/aRHhsYQI9hg6aqDhFvAEiqyi1gJzJnca/DSCF1310.jpg",
    "https://ck-cdn.annatarhe.cn/41me0rLT3nU4pdv9PdSMSNPR2acAvbQ4/DSCF1109.jpg",
    "https://ck-cdn.annatarhe.cn/RhcWMEhdl9h6hJD7kO9UNN8mzIFDKRva/DSCF1069-HDR.jpg"
]

let placeholderImage = "https://picsum.photos/400/500"

fileprivate let emptyClipping = CKClippingItem(id: -1, content: "empty clipping", bookID: "", title: "", createdAt: "", pageAt: "", creator: CKClippingCreator(id: -1, name: "", avatar: ""))

fileprivate let holderClipping = CKClippingItem(id: -1, content: "Something awesome", bookID: "", title: "awesome", createdAt: "", pageAt: "", creator: CKClippingCreator(id: -1, name: "", avatar: ""))

fileprivate let emptyBook = WenquBook.init(
  id: -1, rating: 0, author: "widget example author", pubdate: "", translator: "", producer: "", totalPages: 1, series: "", originTitle: "", image: "", doubanID: 0, title: NSLocalizedString("widget example title", comment: ""), url: "", press: "", isbn: "", tags: [], authorIntro: "", summary: "", createdAt: "", updatedAt: "", catalog: ""
)


fileprivate let chineseAmongOthersBook = WenquBook.init(
  id: 260101, rating: 9, author: "[美] 孔飞力", pubdate: "", translator: "", producer: "", totalPages: 1, series: "", originTitle: "他者中的华人", image: "https://ck-cdn.annatarhe.cn/clippingkk/book/s29009238.jpg", doubanID: 0, title: "他者中的华人", url: "", press: "", isbn: "", tags: [], authorIntro: "", summary: "", createdAt: "", updatedAt: "", catalog: ""
)

struct Provider: TimelineProvider {
  func getSnapshot(in context: Context, completion: @escaping (AwesomeClippingEntry) -> Void) {
    
    let imgData = try! Data(
      contentsOf: URL(string: placeholderImage)!
    )
    
    if context.isPreview {
      let entry = AwesomeClippingEntry(
        date: Date(),
        clipping: emptyClipping,
        book: emptyBook,
        bgImage: imgData
      )
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
              book: books[0],
              bgImage: imgData
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
            book: books[0],
            bgImage: imgData
          )
          completion(entry)
        })
    })
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<AwesomeClippingEntry>) -> Void) {
    let widgetType = UserManager.ud.string(forKey: "app:widgetType")
    
    let imgData = try! Data(
      contentsOf: URL(string: placeholderImage)!
    )
    
    if UserManager.shared.currentAuthToken == "" || widgetType == "public" {
      BackendService.LoadPublicRandomClipping(completion: { result in
        guard case .success(let data) = result else {
          let entry = AwesomeClippingEntry(
            date: Date(),
            clipping: emptyClipping,
            book: emptyBook,
            bgImage: imgData
          )
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
              return AwesomeClippingEntry(
                date: Calendar.current.date(byAdding: .hour, value: index, to: now)!,
                clipping: c,
                book: b,
                bgImage: imgData
              )
            }
            let timeline = Timeline(entries: entries, policy: .atEnd)
            completion(timeline)
          })
      })
    } else {
      let uid = UserManager.shared.currentUid
      BackendService.LoadProfileClipping(uid: uid, completion: { result in
        guard case .success(let data) = result else {
          let entry = AwesomeClippingEntry(
            date: Date(),
            clipping: emptyClipping,
            book: emptyBook,
            bgImage: imgData
          )
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
              return AwesomeClippingEntry(
                date: Calendar.current.date(byAdding: .hour, value: index, to: now)!,
                clipping: c,
                book: b,
                bgImage: imgData
              )
            }
            let timeline = Timeline(entries: entries, policy: .atEnd)
            completion(timeline)
          })
      })
    }
  }
  
  func placeholder(in context: Context) -> AwesomeClippingEntry {
    AwesomeClippingEntry(
      date: Date(),
      clipping: emptyClipping,
      book: emptyBook,
      bgImage: try! Data(
        contentsOf: URL(string: placeholderImage)!
      )
    )
  }
}

struct AwesomeClippingEntry: TimelineEntry {
  var date: Date
  
  let clipping: CKClippingItem
  let book: WenquBook
  let bgImage: Data
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
      
      return placeholderImage
      
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
  
  var baseOverlayColor: some View {
    get {
      if (colorScheme == .dark) {
        return Color.black.opacity(0.7)
      }
      
      return Color.white.opacity(0.6)
    }
  }
  
  var textColor: Color {
    get {
      if (colorScheme == .dark) {
        return Color.white
      }
      return Color.black
    }
  }
  
  var body: some View {
    let clipping = entry.clipping
    let bookTitle = entry.book.title
    ZStack {
      Image(uiImage: UIImage(data: entry.bgImage)!)
        .resizable()
        .aspectRatio(contentMode: .fill)
        .blur(radius: 15)
        .overlay(
          baseOverlayColor
        )
      VStack {
        Text(clipping.content)
          .padding(.all, 10)
          .font(.custom("LXGWWenKai-Regular", size: CGFloat(self.fontSzie)))
          .lineSpacing(12 * 1.1)
          .foregroundColor(textColor)
          .lineLimit(self.lineLimit)
        Text(bookTitle)
          .foregroundColor(textColor)
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

struct ClippingKKNext_Clipping_Previews: PreviewProvider {
  static var previews: some View {
    clippingkkEntryView(
      entry: AwesomeClippingEntry(
        date: Date(),
        clipping: CKClippingItem(id: -1, content: "背景对故事的反讽表现在：世界越大，作者的知识便越被稀释，其创作选择也就越少，故事便越发充满陈词滥调。世界越小，作者的知识便越完善，其创作选择也就越多。结果是一个完全新颖的故事，以及对陈词滥调作战的胜利", bookID: "26736805", title: "故事：材质、结构、风格和银幕剧作的原理", createdAt: "", pageAt: "", creator: CKClippingCreator(id: -1, name: "", avatar: "")),
        book: chineseAmongOthersBook,
        bgImage: try! Data(
          contentsOf: URL(string: placeholderImage)!
        )
      )
    )
    .previewContext(WidgetPreviewContext(family: .systemLarge))
    .preferredColorScheme(.light)
  }
}
