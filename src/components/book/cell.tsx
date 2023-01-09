import { CachedImage } from '@georstat/react-native-image-cache'
import { Center, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData } from 'react-native'
import { WenquBook } from '../../service/wenqu'

type BookCellProps = {
  book: WenquBook
}

function BookCell(props: BookCellProps) {
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16/9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])
  if (!props.book) {
    return <View height={250} />
  }
  return (
    <Center height={250} shadow='6'>
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
    </Center>
  )
}

export default BookCell