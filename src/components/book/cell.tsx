import { CachedImage } from '@georstat/react-native-image-cache'
import { Link } from '@react-navigation/native'
import { Center, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData } from 'react-native'
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

  const { data: books, isLoading } = useSingleBook(props.bookDoubanID)
  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])

  if (isLoading) {
    return (
      <Center>
        <PulseBox height={250} width={200} radius={4} />
      </Center>
    )
  }

  const book = books?.books ? books.books[0] : null

  if (!book) {
    return <View height={250} width='100%' />
  }

  return (
    <Center height={250} shadow='6'>
      <Link
        to={{
          screen: RouteKeys.BookDetail,
          params: {
            book: book
          }
        }}
      >
        <View flexDirection='column' alignItems='center'>
          <CachedImage
            source={book.image}
            onLoad={e => {
              setLoadedImage(e.nativeEvent.source)
            }}
            loadingImageComponent={() => (
              <Center>
                <Blurhash
                  blurhash={book.edges?.imageInfo?.blurHashValue || 'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
                  style={{ height: 200, aspectRatio: ratio, borderRadius: 4 }}
                />
              </Center>
            )}
            style={{
              aspectRatio: ratio,
              height: 200,
              borderRadius: 4,
              overflow: 'hidden'
            }}
            resizeMode='cover'
          />
          <Text
            marginTop={2}
            fontFamily={FontLXGW}
            numberOfLines={2}
            fontSize='sm'
            textAlign='center'
          >
            {book.title}
          </Text>
        </View>
      </Link>
    </Center>
  )
}

export default BookCell