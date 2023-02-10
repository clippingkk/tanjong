import { CachedImage } from '@georstat/react-native-image-cache'
import { useHeaderHeight } from '@react-navigation/elements'
import { Link } from '@react-navigation/native'
import { Center, Divider, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData } from 'react-native'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteKeys } from '../../routes'
import { WenquBook } from '../../service/wenqu'
import { FontLXGW } from '../../styles/font'

type BookHeroProps = {
  bookDoubanID: string | null
}

function BookHero(props: BookHeroProps) {
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const { data: books, isLoading } = useSingleBook(props.bookDoubanID)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])

  const book = books?.books ? books.books[0] : null

  const hh = useHeaderHeight()

  if (isLoading) {
    return (
      <Center height={250}>
        <ActivityIndicator />
      </Center>
    )
  }

  if (!book) {
    return <View height={hh + 200} bg='amber.300' />
  }

  return (
    <Center height={250} marginTop={5} shadow='6'>
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
                <ActivityIndicator />
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