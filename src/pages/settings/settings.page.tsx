import { Button, Center, CheckIcon, Divider, Pressable, Select, Switch, Text, Toast, View, VStack } from 'native-base'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLinkTo } from '@react-navigation/native'
import { setItem as WidgetKitSetItem, getItem as WidgetKitGetItem, reloadAllTimelines as WidgetKitReloadAllTimelines } from 'react-native-widgetkit'
import { RouteKeys, RouteParamList } from '../../routes'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useApolloClient } from '@apollo/client'
import { useAtom, useSetAtom } from 'jotai'
import { tokenAtom, uidAtom } from '../../atomic'
import { updateLocalToken } from '../../utils/apollo'
import { SharedGroupPreferencesKey } from '../../constants/config'
import { widgetAppWidgetType } from '../../hooks/auth'
import { Platform, SafeAreaView } from 'react-native'
import Page from '../../components/page'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { CacheManager } from '@georstat/react-native-image-cache'

type SettingsPageProps = NativeStackScreenProps<RouteParamList, 'empty'>

type AppWidgetType = 'public' | 'own'

function useAppWidgetType() {
  const [widgetType, setWidgetType] = useState<AppWidgetType>('public')

  useEffect(() => {
    (async function () {
      const t = (await WidgetKitGetItem(widgetAppWidgetType, SharedGroupPreferencesKey) as AppWidgetType) ?? 'public'
      setWidgetType(t);
    })()
  }, [])

  const toggleWidgetType = useCallback(async (v: AppWidgetType) => {
    setWidgetType(v);
    await WidgetKitSetItem(widgetAppWidgetType, v, SharedGroupPreferencesKey)
    WidgetKitReloadAllTimelines()
  }, [setWidgetType])

  return {
    widgetType,
    toggleWidgetType
  }
}

function SettingsPage(props: SettingsPageProps) {
  const hh = useHeaderHeight()
  const linkTo = useLinkTo()

  const [count, setCount] = useState(0)
  const timer = useRef<number | null>(null)
  const { widgetType, toggleWidgetType } = useAppWidgetType()

  const onDebugClick = useCallback(() => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        timer.current = null
      }, 10000)
    }
    setCount(c => c + 1)
  }, [])

  const client = useApolloClient()
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)

  const onLogout = useCallback(() => {
    setToken(null)
    setUid(null)
    updateLocalToken(null)
    client.resetStore()
    Toast.show({
      title: 'logged out'
    })
    if (props.navigation.canGoBack()) {
      props.navigation.goBack()
    }
  }, [client])

  useEffect(() => {
    if (count < 10) {
      return
    }
    timer.current = null
    setCount(0)
    linkTo('/' + RouteKeys.ProfileDebug)
  }, [count])

  const { t, i18n } = useTranslation()

  const [cacheSize, setCacheSize] = useState(0)
  useEffect(() => {
    CacheManager.getCacheSize().then(res => {
      console.log(res)
      setCacheSize(res)
    })
  }, [])

  return (
    <Page>
      <SafeAreaView>
        <View height='100%'>
          <VStack
            paddingLeft={4}
            paddingRight={4}
            marginTop={8}
            paddingTop={4}
            paddingBottom={4}
            background='amber.100'
            _dark={{
              background: 'amber.900'
            }}
          >
            <Pressable onPress={onDebugClick}>
              <Text color='gray.900' _dark={{ color: 'amber.100' }}>created by @AnnatarHe</Text>
            </Pressable>

            {Platform.OS === 'ios' ? (
              <>
                <Divider my={6} />
                <View justifyContent='space-between' alignItems='center' width='100%' flexDir='row'>
                  <Text color='gray.900' _dark={{ color: 'amber.100' }}>
                    iOS Widget Type: {widgetType}
                  </Text>
                  <Switch
                    value={widgetType === 'own'}
                    onChange={() => { toggleWidgetType(widgetType === 'own' ? 'public' : 'own') }}
                  />
                </View>
              </>
            ) : null}
            <Divider my={6} />
            <View justifyContent='space-between' alignItems='center' width='100%' flexDir='row'>
              <Text color='gray.900' _dark={{ color: 'amber.100' }}>
                Language:
              </Text>
              <Select
                selectedValue={i18n.language ?? 'en'}
                minWidth="200"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={itemValue => i18n.changeLanguage(itemValue)}
              >
                <Select.Item label="English" value="en" />
                <Select.Item label="中文" value="zh" />
                <Select.Item label="한국인" value="ko" />
              </Select>
            </View>
          </VStack>
          <View flex={1} />
          <Button bg='red.500' mx={4} onPress={onLogout}>
            <Text color='white'>{t('app.menu.logout')}</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Page>
  )
}

export default SettingsPage