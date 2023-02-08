import { StackActions } from "@react-navigation/native"
import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { tokenAtom, uidAtom } from "../atomic"
import { updateLocalToken } from "../utils/apollo"
// import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { SharedGroupPreferencesKey } from "../constants/config"
import { setItem as WidgetKitSetItem, reloadAllTimelines as WidgetKitReloadAllTimelines } from 'react-native-widgetkit'
import { Platform } from "react-native"
import { useApolloClient } from "@apollo/client"
import { Toast } from "native-base"
import * as Sentry from '@sentry/react-native'
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteParamList } from "../routes"
export const widgetAppIDKey = "app:my:id"
export const widgetAppTokenKey = "app:token"
export const widgetAppWidgetType = "app:widgetType"

export function usePostAuth(nav: NativeStackNavigationProp<RouteParamList, any, undefined>) {
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)
  const client = useApolloClient()

  return useCallback(async (token: string, uid: number) => {
    setToken(token)
    updateLocalToken(token)
    setUid(uid)
    Sentry.setUser({
      id: uid.toString(),
    })
    if (Platform.OS === 'ios') {
      // await SharedGroupPreferences.setItem(widgetAppIDKey, uid, SharedGroupPreferencesKey)
      // await SharedGroupPreferences.setItem(widgetAppTokenKey, token, SharedGroupPreferencesKey)
      await Promise.all([
        WidgetKitSetItem(widgetAppIDKey, uid.toString(), SharedGroupPreferencesKey),
        WidgetKitSetItem(widgetAppTokenKey, token, SharedGroupPreferencesKey),
        WidgetKitSetItem(widgetAppWidgetType, "public", SharedGroupPreferencesKey),
      ])
      WidgetKitReloadAllTimelines()
    }

    Toast.show({
      title: 'Logged in'
    })
    await client.resetStore()
    nav.dispatch(StackActions.popToTop())
  }, [setToken, setUid, nav])
}
