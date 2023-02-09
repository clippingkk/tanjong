import { CachedImage } from '@georstat/react-native-image-cache'
import { Button, Center, ScrollView, Text, View } from 'native-base'
import React, { useMemo, useState } from 'react'
import { ImageLoadEventData, ActivityIndicator, Share } from 'react-native'
import { getUTPLink, KonzertThemeMap, UTPService } from '../../service/utp'
import Page from '../page'

type BookShareViewProps = {
  bookID: number
  bookDBID: number
  uid: number | null
}

function BookShareView(props: BookShareViewProps) {

  const [currentTheme, setCurrentTheme] = useState(KonzertThemeMap.young.id)

  const shareImageUrl = useMemo(() => {
    if (!props.uid) {
      return
    }
    return getUTPLink(
      UTPService.book,
      {
        uid: props.uid,
        bid: props.bookID,
        theme: currentTheme
      })
  }, [props.uid, props.bookID, currentTheme])

  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])
  if (!props.uid) {
    return (
      <Center>
        <Text>please login...</Text>
      </Center>
    )
  }

  if (!shareImageUrl) {
    return (
      <Center>
        <ActivityIndicator />
      </Center>
    )
  }

  return (
    <Page>
      <ScrollView
        pt={4}
      >
        <Center>

          <View pb={4}>
            <Button.Group>
              {Object.values(KonzertThemeMap).map(v => (
                <Button
                  key={v.id}
                  variant={v.id === currentTheme ? 'solid' : 'outline'}
                  onPress={() => setCurrentTheme(v.id)}>
                  {v.name}
                </Button>
              ))}
            </Button.Group>
            <Button
              my={4}
              onPress={() => {
                // TODO: save image to alublm
              }}>
              <Text>Save Image</Text>
            </Button>
            <Button
              onPress={() => {
                Share.share({
                  url: `https://clippingkk.annatarhe.com/dash/${props.uid}/book/${props.bookDBID}`
                })
              }}>
              <Text>Share Link</Text>
            </Button>
          </View>

          <CachedImage
            source={shareImageUrl}
            onLoad={e => {
              setLoadedImage(e.nativeEvent.source)
            }}
            loadingImageComponent={() => (
              <Center>
                <ActivityIndicator />
              </Center>
            )}
            style={{
              borderRadius: 4,
              overflow: 'hidden',
              aspectRatio: ratio,
              width: '80%',
            }}
            resizeMode='cover'
          />
        </Center>
      </ScrollView>
    </Page>
  )
}

export default BookShareView