import { CachedImage } from '@georstat/react-native-image-cache'
import { useHeaderHeight } from '@react-navigation/elements'
import { Link } from '@react-navigation/native'
import { Center, Divider, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ImageLoadEventData } from 'react-native'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteKeys } from '../../routes'
import { Blurhash } from 'react-native-blurhash';
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

  if (!book) {
    return (
      <Center style={{ marginVertical: hh }}>
        <PulseBox height={250} width={200} radius={4} />
      </Center>
    )
  }

  return (
    <Center height={250} marginTop={5} shadow='6'>
      <Link
        screen={RouteKeys.BookDetail}
        params={{ book: book }}
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
              // width: 100
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
      <Divider />
    </Center>
  )
}

export default BookHero