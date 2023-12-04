// import { Button, Center, CheckIcon, Divider, Pressable, Select, Switch, Text, Toast, View, VStack } from 'native-base'
import { Toast } from 'native-base'
import { Button, Center, CheckIcon, ChevronDownIcon, Divider, HStack, Icon, Pressable, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger, Switch, Text, View, VStack } from '@gluestack-ui/themed'
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

type SettingsPageProps = NativeStackScreenProps<RouteParamList, RouteKeys.ProfileSettings>

type AppWidgetType = 'public' | 'own'

const languages: Record<string, { name: string, icon: string }> = {
  en: {
    name: 'English',
    icon: '🇬🇧'
  },
  zh: {
    name: '中文',
    icon: '🇨🇳'
  },
  ko: {
    name: '한국',
    icon: '🇰🇷'
  }
}

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
  const timer = useRef<NodeJS.Timeout | null>(null)
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
      setCacheSize(res)
    })
  }, [])

  return (
    <Page>
      <SafeAreaView>
        <View height='100%'>
          <VStack
            marginTop={'$4'}
            padding={'$2'}
          >
            <Pressable onPress={onDebugClick}>
              <Text color='$blueGray900' sx={{ _dark: { color: '$amber100' } }}>created by @AnnatarHe</Text>
            </Pressable>

            {Platform.OS === 'ios' ? (
              <>
                <Divider my={'$6'} />
                <HStack justifyContent='space-between' alignItems='center' width='100%'>
                  <Text color='$blueGray900' sx={{ _dark: { color: '$amber100' } }}>
                    iOS Widget Type: {widgetType}
                  </Text>
                  <Switch
                    value={widgetType === 'own'}
                    onChange={() => {
                      toggleWidgetType(widgetType === 'own' ? 'public' : 'own')
                    }}
                  />
                </HStack>
              </>
            ) : null}
            <Divider my={'$6'} />
            <HStack justifyContent='space-between' alignItems='center' width='100%'>  
              <Text color='$blueGray900' sx={{ _dark: { color: '$amber100' } }}>
                Cache:
              </Text>
              <HStack alignItems='center' gap={'$2'}>
              <Text color='$blueGray900' sx={{ _dark: { color: '$amber100' } }}>
                {cacheSize} B
              </Text>
              <Button
                bgColor='$red400'
                onPress={() => {
                  CacheManager.clearCache()
                  Toast.show({
                    title: 'cache cleared'
                  })
                }}
              >
                <Text>
                Clear
                </Text>
              </Button>
              </HStack>
            </HStack>
            <Divider my={'$6'} />
            <HStack justifyContent='space-between' alignItems='center' width='100%'>
              <Text color='$blueGray900' sx={{ _dark: { color: '$amber100' } }}>
                Language:
              </Text>
              <Select
                selectedValue={i18n.language ?? 'en'}
                selectedLabel={languages[i18n.language ?? 'en'].name}
                mt={'$1'}
                onValueChange={itemValue => i18n.changeLanguage(itemValue)}
              >
                <SelectTrigger variant="outline" size="md">
                  {/* <SelectInput placeholder="Select option" value={(i18n.language ?? 'en')} color='$red400' width={'$48'} /> */}
                  <Text mx='$4'>
                    {languages[i18n.language ?? 'en'].name}
                  </Text>
                  <SelectIcon mr="$3">
                    <Icon as={ChevronDownIcon} />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent paddingBottom={'$8'}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {Object.keys(languages).map(key => (
                      <SelectItem key={key} label={(languages as any)[key].name} value={key} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </HStack>
          </VStack>
          <View flex={1} />
          <Button bg='$red400' mx='$4' onPress={onLogout}>
            <Text color='$white'>{t('app.menu.logout')}</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Page>
  )
}

export default SettingsPage