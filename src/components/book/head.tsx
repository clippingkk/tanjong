import { CachedImage } from '@georstat/react-native-image-cache'
import { BlurView } from '@react-native-community/blur'
import { useHeaderHeight } from '@react-navigation/elements'
import { Center, Divider, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ImageLoadEventData, ActivityIndicator, useColorScheme } from 'react-native'
import { WenquBook } from '../../service/wenqu'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'

type BookHeadProps = {
  book: WenquBook
}

function BookHead(props: BookHeadProps) {
  const book = props.book
  const cs = useColorScheme()
  const hh = useHeaderHeight()
  // const primaryColor = useImagePrimaryColor(book.image)
  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])
  return (
      <View marginBottom={-31}>
        <View height={300 + hh}>
          <CachedImage
            source={book.image}
            resizeMode='cover'
            style={basicStyles.absolute}
          />
          <BlurView
            style={basicStyles.absolute}
            blurType={cs!}
            blurAmount={30}
            reducedTransparencyFallbackColor="white"
          />
          <View
            alignItems='flex-start'
            justifyContent='space-around'
            flexDirection='row'
            marginLeft={2}
            marginRight={2}
            marginTop={hh + 50}
          >
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
              style={[{
                aspectRatio: ratio,
                height: 150,
                borderRadius: 8,
                // overflow: 'hidden'
              }, basicStyles.shadow]}
              resizeMode='cover'
            />
            <View maxWidth={240}>
              <Text
                fontFamily={FontLXGW}
                fontSize='xl'
              >{book.title}</Text>
              <Text
                fontFamily={FontLXGW}
                fontSize='sm'
              >{book.author}</Text>
              <Divider marginTop={2} marginBottom={2} />
              <Text
                fontFamily={FontLXGW}
                fontSize='sm'
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

export default BookHead