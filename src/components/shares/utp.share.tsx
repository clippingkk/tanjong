import { CachedImage } from '@georstat/react-native-image-cache'
import { Button, Center, ScrollView, Text, Toast, View } from 'native-base'
import React, { useCallback, useMemo, useState } from 'react'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { ImageLoadEventData, ActivityIndicator, Share, PermissionsAndroid, Platform } from 'react-native'
import { getUTPLink, KonzertThemeMap, UTPService } from '../../service/utp'
import Page from '../page'

type BookShareViewProps = {
  kind: UTPService
  bookID: number
  cid?: number
  bookDBID: number
  uid: number | null
}

async function hasAndroidPermission() {
  const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE

  const hasPermission = await PermissionsAndroid.check(permission)
  if (hasPermission) {
    return true
  }

  const status = await PermissionsAndroid.request(permission)
  return status === 'granted'
}

function UTPShareView(props: BookShareViewProps) {
  const [currentTheme, setCurrentTheme] = useState(KonzertThemeMap.light.id)

  const shareImageUrl = useMemo(() => {
    if (!props.uid) {
      return
    }
    return getUTPLink(
      props.kind,
      {
        uid: props.uid,
        bid: props.bookID,
        cid: props.cid,
        theme: currentTheme
      })
  }, [props.uid, props.kind, props.bookID, currentTheme])

  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])

  const onSaveImage = useCallback(async () => {
    if (!loadedImage?.uri) {
      return
    }
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return
    }
    try {
      await CameraRoll.save(loadedImage.uri)
      Toast.show({
        title: 'Saved to album'
      })
    } catch (err: any) {
      Toast.show({ title: err.toString() })
    }
  }, [loadedImage])

  const onShareLinkClick = useCallback(() => {
    const prefix = `https://clippingkk.annatarhe.com`
    const distUrl = props.kind === UTPService.book ? `/dash/${props.uid}/book/${props.bookDBID}` : `/dash/${props.uid}/clippings/${props.cid}`
    Share.share({
      url: prefix + distUrl
    })
  }, [props.kind, props.uid, props.bookDBID, props.cid])

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
                  <Text>
                    {v.name}
                  </Text>
                </Button>
              ))}
            </Button.Group>
            <Button
              my={4}
              onPress={onSaveImage}>
              <Text>Save Image</Text>
            </Button>
            <Button
              onPress={onShareLinkClick}>
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

export default UTPShareView