import { CachedImage } from '@georstat/react-native-image-cache'
import { useHeaderHeight } from '@react-navigation/elements'
import { Link } from '@react-navigation/native'
import React, { useMemo, useState } from 'react'
import { ImageLoadEventData, View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteKeys } from '../../routes'
import { Blurhash } from 'react-native-blurhash'
import { FontLXGW } from '../../styles/font'
import PulseBox from '../pulse-box/pulse-box'

type BookHeroProps = {
  bookDoubanID: string | null
}

function BookHero(props: BookHeroProps) {
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const { data: books, isLoading } = useSingleBook(props.bookDoubanID)

  const ratio = useMemo(() => {
    const realRatio = book?.edges?.imageInfo?.ratio
    if (realRatio) {
      return realRatio
    }
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])

  const book = books?.books ? books.books[0] : null

  const hh = useHeaderHeight()
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <PulseBox height={220} width={150} radius={12} />
      </View>
    )
  }

  return (
    <Link
      screen={RouteKeys.BookDetail}
      params={{ book: book }}
    >
      <View style={styles.heroContainer}>
        <View style={styles.imageWrapper}>
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
            style={[
              styles.bookImage,
              { aspectRatio: ratio }
            ]}
            resizeMode='cover'
          />
        </View>
        <Text
          style={[
            styles.bookTitle,
            { color: isDarkMode ? '#E0E7FF' : '#1E293B' }
          ]}
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text
          style={[
            styles.bookAuthor,
            { color: isDarkMode ? '#94A3B8' : '#64748B' }
          ]}
          numberOfLines={1}
        >
          {book.author}
        </Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
  },
  heroContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  imageWrapper: {
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  bookImage: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurhashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurhash: {
    height: 220,
    borderRadius: 16,
  },
  bookTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: FontLXGW,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: -0.3,
  },
  bookAuthor: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '300',
    fontFamily: FontLXGW,
    textAlign: 'center',
    opacity: 0.7,
  },
})

export default BookHero