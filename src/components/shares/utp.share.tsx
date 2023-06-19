import { CachedImage } from '@georstat/react-native-image-cache'
import { Button, Center, ScrollView, Text, Toast, View, Image } from 'native-base'
import React, { useCallback, useMemo, useState } from 'react'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { ImageLoadEventData, ActivityIndicator, Share, PermissionsAndroid, Platform, Image as NativeImage } from 'react-native'
import { getKonzertLink, getUTPLink, KonzertThemeMap, UTPService } from '../../service/utp'
import Page from '../page'
import { useTranslation } from 'react-i18next';
import UTPWebview from './utp-webview';

type BookShareViewProps = {
  kind: UTPService
  bookID: number
  cid?: number
  bookDBID: number
  uid: number | null
}

async function hasAndroidPermission() {
  const v = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version
  const permission = v >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE

  const hasPermission = await PermissionsAndroid.check(permission)
  if (hasPermission) {
    return true
  }

  const status = await PermissionsAndroid.request(permission)
  return status === 'granted'
}

function UTPShareView(props: BookShareViewProps) {
  const { t } = useTranslation()
  const [currentTheme, setCurrentTheme] = useState(KonzertThemeMap.light.id)

  const konzertUrl = useMemo(() => {
    if (!props.uid) {
      return
    }
    return getKonzertLink(
      props.kind,
      {
        uid: props.uid,
        bid: props.bookID,
        cid: props.cid,
        theme: currentTheme
      })
  }, [props.uid, props.kind, props.bookID, currentTheme])

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
  // const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>({
  //   uri: '/Users/bytedance/Library/Developer/CoreSimulator/Devices/88A39455-E66B-40BF-84F7-6163B5FCB022/data/Containers/Data/Application/4D934F46-8B6B-4F17-8657-4D67AFAE68BE/tmp/ReactNative/C62AACB9-1404-4EBE-9DB2-9B063F2BF266.png',
  //   width: 1089, height: 4500
  // })

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
              <Text>{t('app.clipping.save')}</Text>
            </Button>
            <Button
              onPress={onShareLinkClick}>
              <Text>{t('app.clipping.shares')}</Text>
            </Button>
          </View>

          {loadedImage ? (
            <View
              width={'100%'}
              // height={20}
            >
              <NativeImage
                source={loadedImage}
                alt={t('app.clipping.share') ?? ''}
                style={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  // TODO: calc
                  // aspectRatio: ratio,
                  width: 320,
                  height: 300,
                }}
                resizeMode='cover'
              />
            </View>
          ) : (
            <View flex={1} background={'red.300'}>
              <UTPWebview
                url={konzertUrl!}
                onGetImage={(file) => {
                  NativeImage.getSize(file, (width, height) => {
                    setLoadedImage({ uri: file, width, height })
                  })
                }}
              />
            </View>
          )}

        </Center>
      </ScrollView>
    </Page>
  )
}

export default UTPShareView