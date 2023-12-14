import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { profileAtom, uidAtom } from "../atomic"
import { useBindIosDeviceTokenMutation, useProfileQuery } from "../schema/generated"
import { Linking, Platform } from "react-native"
import { useLinkTo } from "@react-navigation/native"
import { RouteKeys, RouteParamList } from "../routes"
import * as Sentry from "@sentry/react-native"
import RNBootSplash from "react-native-bootsplash"

import AV from 'leancloud-storage/core'
import * as adapters from '@leancloud/platform-adapters-react-native'
import { LEANCLOUD } from "../constants/config"
import PushNotificationIOS, { PushNotification } from "@react-native-community/push-notification-ios"
import { useStripe } from "@stripe/stripe-react-native"
import { Toast } from "native-base"
import DeviceInfo from 'react-native-device-info';

AV.setAdapters(adapters as any)

function useSetupIOSNotification() {
  const [doBindIOSDeviceToken, bindIOSDeviceTokenResult] = useBindIosDeviceTokenMutation()

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'macos') {
      return
    }
    if (__DEV__) {
      return
    }
    function onRemoteNotification(notification: PushNotification) {
      const isClicked = notification.getData().userInteraction === 1;

      if (isClicked) {
        console.log('is clicked')
        // Navigate user to another screen
      } else {
        console.log('do nothing with the click')
        // Do something else with push notification
      }
    }

    async function onRemoteNotificationRegister(deviceToken: string) {
      try {
        const [deviceId, deviceName, systemVersion, version] = await Promise.all([
          DeviceInfo.getUniqueId(),
          DeviceInfo.getDeviceId(),
          DeviceInfo.getSystemVersion(),
          DeviceInfo.getVersion()
        ])
        await doBindIOSDeviceToken({
          variables: {
            deviceId,
            deviceName,
            os: Platform.OS.toLowerCase(),
            osVersion: systemVersion,
            appVersion: version,
            iosDeviceToken: deviceToken,
          }
        })
      } catch (err: any) {
        Toast.show({
          title: err.message
        })
      }
    }

    PushNotificationIOS.addEventListener('notification', onRemoteNotification)
    PushNotificationIOS.addEventListener('register', onRemoteNotificationRegister)
    PushNotificationIOS.requestPermissions()
    return () => {
      PushNotificationIOS.removeEventListener('notification')
      PushNotificationIOS.removeEventListener('register')
    }
  }, []);
}

export function useOnInit() {
  // only run once
  useEffect(() => {
    AV.init({
      appId: LEANCLOUD.APP_ID,
      appKey: LEANCLOUD.APP_KEY,
      serverURL: LEANCLOUD.SERVER_URL
    })
  }, [])

  useSetupIOSNotification()

  const setProfile = useSetAtom(profileAtom)
  const uid = useAtomValue(uidAtom)

  const np = useProfileQuery({
    variables: {
      id: uid!,
    },
    skip: !uid
  })

  useEffect(() => {
    // 同步已登录用户数据
    if (!np.data?.me) {
      return
    }
    setProfile(np.data.me)
    Sentry.setUser({
      id: np.data.me.id.toString(),
      email: np.data.me.email,
      username: np.data.me.name
    })
  }, [np.data?.me])

  useDeeplinkHandler()

  useEffect(() => {
    RNBootSplash.hide({ fade: true })
  }, [])
}

function getInfoFromDeeplinkUrl(url: string): { uid: number, cid: number } | null {
  const regexp = /clippingkk:\/\/\/dash\/(\d+)\/clippings\/(\d+)/
  const matched = url.match(regexp)
  if (!matched || matched.length < 3) {
    return null
  }
  return {
    uid: ~~matched[1],
    cid: ~~matched[2],
  }
}

export function useDeeplinkHandler() {
  const lt = useLinkTo<any>()

  const { handleURLCallback } = useStripe();
  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (!url) {
        return
      }
      const stripeHandled = await handleURLCallback(url);
      if (stripeHandled) {
        // This was a Stripe URL - you can return or add extra handling here as you see fit
        return
      }

      const urlInfo = getInfoFromDeeplinkUrl(url)
      lt({
        screen: RouteKeys.Clipping,
        params: {
          clippingID: urlInfo?.cid
        }
      })
    },
    [handleURLCallback]
  );
  useEffect(() => {
    (async function () {
      const initialUrl = await Linking.getInitialURL()
      if (!initialUrl) {
        return
      }
      handleDeepLink(initialUrl)
    })()
  }, [])

  useEffect(() => {
    function onUrlChange(event: { url: string }) {
      handleDeepLink(event.url)
    }
    const listener = Linking.addEventListener('url', onUrlChange)
    return () => {
      listener.remove()
    }
  })
}

export function useHomeLoad() {
  // here are the debug code, just redirection
  const linkTo = useLinkTo<RouteParamList>()
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    setTimeout(() => {
      linkTo({
        screen: RouteKeys.SignUpOTP,
        params: {
          email: 'annatar.he+ck@gmail.com',
          password: '123456',
        }
      })
    }, 1000)
  }, [linkTo])
}