import { useNavigation } from "@react-navigation/native"
import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { tokenAtom, uidAtom } from "../atomic"
import { updateLocalToken } from "../utils/apollo"
// import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { SharedGroupPreferencesKey } from "../constants/config"
import WidgetKit from 'react-native-widgetkit'
import { Platform } from "react-native"
import { useApolloClient } from "@apollo/client"

const widgetAppIDKey = "app:my:id"
const widgetAppTokenKey = "app:token"

export function usePostAuth() {
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)
  const nav = useNavigation()
  const client = useApolloClient()

  return useCallback(async (token: string, uid: number) => {
    setToken(token)
    updateLocalToken(token)
    setUid(uid)
    if (Platform.OS === 'ios') {
      // await SharedGroupPreferences.setItem(widgetAppIDKey, uid, SharedGroupPreferencesKey)
      // await SharedGroupPreferences.setItem(widgetAppTokenKey, token, SharedGroupPreferencesKey)
      WidgetKit.setItem(widgetAppIDKey, uid.toString(), SharedGroupPreferencesKey)
      WidgetKit.setItem(widgetAppTokenKey, token, SharedGroupPreferencesKey)
      WidgetKit.reloadAllTimelines()
    }

    await client.resetStore()
    nav.goBack()
  }, [setToken, setUid, nav])
}
