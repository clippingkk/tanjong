import { CachedImage } from '@georstat/react-native-image-cache'
import { Link } from '@react-navigation/native'
import { Center, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData } from 'react-native'
import { RouteKeys } from '../../routes'
import { WenquBook } from '../../service/wenqu'

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
    return <View height={250} />
  }
  return (
    <Center height={250} shadow='6'>
      <Link
        to={{
          screen: RouteKeys.BookDetail,
          params: {
            book: props.book
          }
        }}>
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
            height: 250,
            // width: '80%'
          }}
          resizeMode='cover'
        />
        {/* <Text>{props.book.title}</Text> */}
      </Link>
    </Center>
  )
}

export default BookCell