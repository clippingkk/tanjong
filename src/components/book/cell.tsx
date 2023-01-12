import { CachedImage } from '@georstat/react-native-image-cache'
import { Link } from '@react-navigation/native'
import { Center, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData } from 'react-native'
import { RouteKeys } from '../../routes'
import { WenquBook } from '../../service/wenqu'
import { FontLXGW } from '../../styles/font'

type BookCellProps = {
  book: WenquBook
}

function BookCell(props: BookCellProps) {
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])
  if (!props.book) {
    return <View height={250} width='100%' />
  }

  return (
    <Center height={250} shadow='6'>
      <Link
        to={{
          screen: RouteKeys.BookDetail,
          params: {
            book: props.book
          }
        }}
      >
        <View flexDirection='column' alignItems='center'>
          <CachedImage
            source={props.book.image}
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
            {props.book.title}
          </Text>
        </View>
      </Link>
    </Center>
  )
}

export default BookCell