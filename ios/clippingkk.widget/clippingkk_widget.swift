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
      return placeholderImage
    }
  }
  
  var lineLimit: Int {
    get {
      switch family {
      case .systemExtraLarge:
        return 12
      case .systemLarge:
        return 10
      case .systemMedium:
        return 5
      case .systemSmall:
        return 3
      default:
        return 10
      }
    }
  }
  
  var fontSize: CGFloat {
    get {
      switch family {
      case .systemSmall:
        return entry.clipping.content.count > 40 ? 13 : 15
      case .systemMedium:
        return entry.clipping.content.count > 60 ? 15 : 17
      case .systemLarge:
        return entry.clipping.content.count > 100 ? 16 : 19
      case .systemExtraLarge:
        return entry.clipping.content.count > 120 ? 17 : 20
      default:
        return 16
      }
    }
  }
  
  var titleFontSize: CGFloat {
    get {
      switch family {
      case .systemSmall:
        return 11
      case .systemMedium:
        return 12
      case .systemLarge, .systemExtraLarge:
        return 13
      default:
        return 12
      }
    }
  }
  
  var padding: EdgeInsets {
    get {
      switch family {
      case .systemSmall:
        return EdgeInsets(top: 14, leading: 14, bottom: 14, trailing: 14)
      case .systemMedium:
        return EdgeInsets(top: 18, leading: 18, bottom: 18, trailing: 18)
      case .systemLarge, .systemExtraLarge:
        return EdgeInsets(top: 22, leading: 22, bottom: 22, trailing: 22)
      default:
        return EdgeInsets(top: 18, leading: 18, bottom: 18, trailing: 18)
      }
    }
  }
  
  var glassMorphismOverlay: some View {
    get {
      ZStack {
        if colorScheme == .dark {
          // Dark mode: Deep blues and purples with hints of cyan
          LinearGradient(
            gradient: Gradient(colors: [
              Color(red: 0.05, green: 0.1, blue: 0.3).opacity(0.85),
              Color(red: 0.15, green: 0.05, blue: 0.35).opacity(0.7),
              Color(red: 0.1, green: 0.2, blue: 0.4).opacity(0.6),
              Color(red: 0.05, green: 0.15, blue: 0.35).opacity(0.75)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
          )
          
          // Additional gradient layer for depth
          LinearGradient(
            gradient: Gradient(colors: [
              Color(red: 0.2, green: 0.3, blue: 0.5).opacity(0.3),
              Color(red: 0.1, green: 0.4, blue: 0.6).opacity(0.2),
              Color.clear
            ]),
            startPoint: .top,
            endPoint: .bottom
          )
          
          // Subtle material effect
          RoundedRectangle(cornerRadius: 0)
            .fill(
              LinearGradient(
                gradient: Gradient(colors: [
                  Color(red: 0.1, green: 0.15, blue: 0.25).opacity(0.3),
                  Color(red: 0.05, green: 0.1, blue: 0.2).opacity(0.2)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
              )
            )
            .background(.ultraThinMaterial)
        } else {
          // Light mode: Soft pastels with warm tones
          LinearGradient(
            gradient: Gradient(colors: [
              Color(red: 0.95, green: 0.95, blue: 1.0).opacity(0.85),
              Color(red: 0.85, green: 0.9, blue: 1.0).opacity(0.7),
              Color(red: 0.9, green: 0.85, blue: 0.95).opacity(0.65),
              Color(red: 0.95, green: 0.9, blue: 0.85).opacity(0.75)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
          )
          
          // Additional gradient for luminosity
          LinearGradient(
            gradient: Gradient(colors: [
              Color(red: 0.7, green: 0.85, blue: 1.0).opacity(0.25),
              Color(red: 0.9, green: 0.75, blue: 0.95).opacity(0.15),
              Color.clear
            ]),
            startPoint: .topTrailing,
            endPoint: .bottomLeading
          )
          
          // Soft material overlay
          RoundedRectangle(cornerRadius: 0)
            .fill(
              LinearGradient(
                gradient: Gradient(colors: [
                  Color(red: 1.0, green: 0.98, blue: 0.95).opacity(0.3),
                  Color(red: 0.95, green: 0.97, blue: 1.0).opacity(0.2)
                ]),
                startPoint: .top,
                endPoint: .bottom
              )
            )
            .background(.ultraThinMaterial)
        }
      }
    }
  }
  
  var quoteTextColor: Color {
    get {
      if colorScheme == .dark {
        return Color(white: 0.98)
      }
      return Color(white: 0.08)
    }
  }
  
  var titleTextColor: Color {
    get {
      if colorScheme == .dark {
        return Color(white: 0.85).opacity(0.9)
      }
      return Color(white: 0.25).opacity(0.85)
    }
  }
  
  var accentColor: Color {
    get {
      if colorScheme == .dark {
        return Color(red: 0.4, green: 0.7, blue: 1.0)
      }
      return Color(red: 0.2, green: 0.5, blue: 0.9)
    }
  }
  
  var body: some View {
    let clipping = entry.clipping
    let bookTitle = entry.book.title
    
    GeometryReader { geometry in
      ZStack {
        VStack(alignment: .leading, spacing: 0) {
          HStack(alignment: .top, spacing: 6) {
            Image(systemName: "quote.opening")
              .font(.system(size: family == .systemSmall ? 14 : 18, weight: .light))
              .foregroundColor(accentColor.opacity(0.6))
              .offset(y: -2)
            
            Spacer()
          }
          .padding(.bottom, family == .systemSmall ? 6 : 10)
          
          Text(clipping.content)
            .font(.custom("LXGWWenKai-Regular", size: fontSize))
            .fontWeight(.regular)
            .foregroundColor(quoteTextColor)
            .lineSpacing(fontSize * 0.4)
            .lineLimit(lineLimit)
            .multilineTextAlignment(.leading)
            .fixedSize(horizontal: false, vertical: true)
          
          Spacer(minLength: family == .systemSmall ? 8 : 12)
          
          HStack {
            Rectangle()
              .fill(accentColor.opacity(0.6))
              .frame(width: 3, height: family == .systemSmall ? 12 : 14)
              .cornerRadius(1.5)
            
            Text(bookTitle)
              .font(.custom("LXGWWenKai-Bold", size: titleFontSize))
              .fontWeight(.medium)
              .foregroundColor(titleTextColor)
              .lineLimit(1)
              .truncationMode(.tail)
            
            Spacer()
          }
        }
        .padding(padding)
      }
      .frame(width: geometry.size.width, height: geometry.size.height)
    }
    .containerBackground(for: .widget, content: {
      ZStack {
        Image(uiImage: UIImage(data: entry.bgImage)!)
          .resizable()
          .aspectRatio(contentMode: .fill)
          .blur(radius: colorScheme == .dark ? 20 : 25)
          .saturation(colorScheme == .dark ? 0.6 : 0.4)
        
        glassMorphismOverlay
      }
    })
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
    .containerBackgroundRemovable(false)
    .configurationDisplayName("widget title")
    .description("widget desc")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .systemExtraLarge])
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
