import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { updateLocalToken } from "../utils/apollo"
import { profileAtom, tokenAtom, uidAtom } from "../atomic"
import { useProfileQuery } from "../schema/generated"
import { Linking } from "react-native"
import { useLinkTo } from "@react-navigation/native"
import { RouteKeys } from "../routes"
import * as Sentry from "@sentry/react-native";

import AV from 'leancloud-storage/core';
import * as adapters from '@leancloud/platform-adapters-react-native';
import { LEANCLOUD } from "../constants/config"
AV.setAdapters(adapters);

AV.init({
  appId: LEANCLOUD.APP_ID,
  appKey: LEANCLOUD.APP_KEY,
  serverURL: LEANCLOUD.SERVER_URL
})
// import SplashScreen from 'react-native-splash-screen'

export function useOnInit() {
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
    // SplashScreen.hide()
  }, [])
}

function getInfoFromDeeplinkUrl(url: string): { uid: number, cid: number } | null {
  const regexp = /clippingkk:\/\/\/dash\/(\d+)\/clippings\/(\d+)/
  const matched = url.match(regexp)
  console.log(matched)
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
  useEffect(() => {
    Linking.getInitialURL().then(res => {
      if (!res) {
        return
      }
      const urlInfo = getInfoFromDeeplinkUrl(res)
      lt({
        screen: RouteKeys.Clipping,
        params: {
          clippingID: urlInfo?.cid
        }
      })
    })
  }, [])

  useEffect(() => {
    function onUrlChange(event: { url: string }) {
      const urlInfo = getInfoFromDeeplinkUrl(event.url)
      lt({
        screen: RouteKeys.Clipping,
        params: {
          clippingID: urlInfo?.cid
        }
      })
    }
    const listener = Linking.addEventListener('url', onUrlChange)
    return () => {
      listener.remove()
    }
  })
}