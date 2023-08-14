import { CachedImage } from '@georstat/react-native-image-cache'
import { Button, Center, Text, Toast, View, ScrollView } from 'native-base'
import React, { useCallback, useMemo, useState } from 'react'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { ImageLoadEventData, ActivityIndicator, Share, PermissionsAndroid, Platform, Image as NativeImage, ScrollView as RNScrollView } from 'react-native'
import { getKonzertLink, getUTPLink, KonzertThemeMap, UTPService } from '../../service/utp'
import Page from '../page'
import { useTranslation } from 'react-i18next';
import UTPWebview from './utp-webview';
import { useScrollHandlers } from 'react-native-actions-sheet';

type BookShareViewProps = {
  kind: UTPService
  bookID: number
  cid?: number
  bookDBID: number
  uid: number | null
  scrollHandler: ReturnType<typeof useScrollHandlers<RNScrollView>>
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
  const { kind, bookID, cid, bookDBID, uid, scrollHandler } = props
  const { t } = useTranslation()
  const [currentTheme, setCurrentTheme] = useState(KonzertThemeMap.light.id)

  const konzertUrl = useMemo(() => {
    if (!uid) {
      return
    }
    return getKonzertLink(
      kind,
      {
        uid,
        bid: bookID,
        cid: cid,
        theme: currentTheme
      })
  }, [props.uid, props.kind, props.bookID, currentTheme])

  const shareImageUrl = useMemo(() => {
    if (!props.uid) {
      return
    }
    return getUTPLink(
      kind,
      {
        uid: uid || -1,
        bid: bookID,
        cid: cid,
        theme: currentTheme
      })
  }, [props.uid, props.kind, props.bookID, currentTheme])

  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)

  const [loading, setLoading] = useState(false)

  const onSaveImage = useCallback(async () => {
    if (!loadedImage?.uri) {
      return
    }
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return
    }
    try {
      setLoading(true)
      await CameraRoll.save(loadedImage.uri)
      Toast.show({
        title: 'Saved to album'
      })
    } catch (err: any) {
      Toast.show({ title: err.toString() })
    } finally {
      setLoading(false)
    }
  }, [loadedImage])

  const onShareLinkClick = useCallback(() => {
    const prefix = `https://clippingkk.annatarhe.com`
    const distUrl = props.kind === UTPService.book ? `/dash/${uid}/book/${bookDBID}` : `/dash/${uid}/clippings/${cid}`
    Share.share({
      url: prefix + distUrl
    })
  }, [kind, uid, bookDBID, cid])

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
    <ScrollView
      backgroundColor='gray.100'
      _dark={{ backgroundColor: 'gray.900' }}
      pt={4}
      {...scrollHandler}
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
            isLoading={loading}
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
            justifyContent={'center'}
            alignItems={'center'}
            paddingBottom={4}
          >
            <NativeImage
              source={loadedImage}
              alt={t('app.clipping.share') ?? ''}
              style={{
                borderRadius: 4,
                overflow: 'hidden',
                // TODO: calc
                aspectRatio: loadedImage.width / loadedImage.height,
                width: 320,
                height: loadedImage.height * 320 / loadedImage.width,
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
  )
}

export default UTPShareView