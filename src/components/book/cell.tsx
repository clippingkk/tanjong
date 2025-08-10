import { CachedImage } from '@georstat/react-native-image-cache'
import { Link } from '@react-navigation/native'
import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ImageLoadEventData, useColorScheme } from 'react-native'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteKeys } from '../../routes'
import { WenquBook } from '../../service/wenqu'
import { FontLXGW } from '../../styles/font'
import { Blurhash } from 'react-native-blurhash'
import PulseBox from '../pulse-box/pulse-box'

type BookCellProps = {
  bookDoubanID: string
}

function BookCell(props: BookCellProps) {
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  const { data: books, isLoading } = useSingleBook(props.bookDoubanID)
  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 3 / 4
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <PulseBox height={180} width={135} radius={8} />
      </View>
    )
  }

  const book = books?.books ? books.books[0] : null

  if (!book) {
    return <View style={styles.emptyContainer} />
  }

  return (
    <Link
      screen={RouteKeys.BookDetail}
      params={{
        book: book
      }}
    >
      <View style={styles.cellContainer}>
        <View style={styles.imageContainer}>
          <CachedImage
            source={book.image}
            onLoad={e => {
              setLoadedImage(e.nativeEvent.source)
            }}
            loadingImageComponent={() => (
              <View style={styles.blurhashWrapper}>
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
          {book.author || 'Unknown Author'}
        </Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
  },
  emptyContainer: {
    height: 240,
    width: '100%',
  },
  cellContainer: {
    paddingBottom: 12,
  },
  imageContainer: {
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  bookImage: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurhashWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurhash: {
    height: 180,
    borderRadius: 12,
  },
  bookTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FontLXGW,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  bookAuthor: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '300',
    fontFamily: FontLXGW,
    opacity: 0.7,
  },
})

export default BookCell