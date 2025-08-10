import { CachedImage } from '@georstat/react-native-image-cache'
import { BlurView } from '@react-native-community/blur'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { useMemo, useState } from 'react'
import { ImageLoadEventData, View, Text, StyleSheet, useColorScheme } from 'react-native'
import { WenquBook } from '../../service/wenqu'
import { FontLXGW } from '../../styles/font'
import { Blurhash } from 'react-native-blurhash'

type BookHeadProps = {
  book: WenquBook
}

function BookHead(props: BookHeadProps) {
  const book = props.book
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const hh = useHeaderHeight()
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 3 / 4
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])
  
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { height: 280 + hh }]}>
        <CachedImage
          source={book.image}
          resizeMode='cover'
          style={StyleSheet.absoluteFillObject}
        />
        <BlurView
          style={StyleSheet.absoluteFillObject}
          blurType={isDarkMode ? 'dark' : 'light'}
          blurAmount={40}
          reducedTransparencyFallbackColor={isDarkMode ? 'black' : 'white'}
        />
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <View style={styles.bookCover}>
            <CachedImage
              source={book.image}
              onLoad={e => {
                setLoadedImage(e.nativeEvent.source)
              }}
              loadingImageComponent={() => (
                <View style={styles.blurhashContainer}>
                  <Blurhash
                    blurhash={book.edges?.imageInfo?.blurHashValue || 'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
                    style={[styles.blurhash, { aspectRatio: ratio }]}
                  />
                </View>
              )}
              style={[styles.bookImage, { aspectRatio: ratio }]}
              resizeMode='cover'
            />
          </View>
          <View style={styles.bookInfo}>
            <Text 
              style={[styles.bookTitle, { color: '#FFFFFF' }]}
              numberOfLines={2}
            >
              {book.title}
            </Text>
            <Text 
              style={[styles.bookAuthor, { color: 'rgba(255,255,255,0.9)' }]}
              numberOfLines={1}
            >
              {book.author}
            </Text>
            <View style={styles.divider} />
            <Text
              style={[styles.bookSummary, { color: 'rgba(255,255,255,0.8)' }]}
              numberOfLines={4}
            >
              {book.summary}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  headerContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'flex-start',
  },
  bookCover: {
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  bookImage: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurhashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurhash: {
    height: 180,
    borderRadius: 16,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 10,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '400',
    fontFamily: FontLXGW,
    letterSpacing: -0.3,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bookAuthor: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: FontLXGW,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
    width: '80%',
    borderRadius: 1,
  },
  bookSummary: {
    fontSize: 14,
    fontWeight: '300',
    fontFamily: FontLXGW,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
})

export default BookHead