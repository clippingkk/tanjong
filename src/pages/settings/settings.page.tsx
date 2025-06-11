import React, {useCallback, useEffect, useState} from 'react'
import {
  Alert,
  Platform,
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Text
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import SettingsSection from './SettingsSection'
import SettingsItem from './SettingsItem'
import {useApolloClient} from '@apollo/client'
import {useAtomValue, useSetAtom} from 'jotai'
import {tokenAtom, uidAtom} from '../../atomic'
import {updateLocalToken} from '../../utils/apollo'
import {useDeleteMyAccountMutation} from '../../schema/generated'
import toast from 'react-hot-toast/headless'
import {
  setItem as WidgetKitSetItem,
  getItem as WidgetKitGetItem,
  reloadAllTimelines as WidgetKitReloadAllTimelines
} from 'react-native-widgetkit'
import {SharedGroupPreferencesKey} from '../../constants/config'
import {widgetAppWidgetType} from '../../hooks/auth'
import {CacheManager} from '@georstat/react-native-image-cache'
import LinearGradient from 'react-native-linear-gradient'
import {BlurView} from '@react-native-community/blur'
import {FontLXGW} from '../../styles/font'

type AppWidgetType = 'public' | 'own'

const lightColors = {
  gradient: ['#FFDAB9', '#FFA07A'],
  blur: 'light',
  headerText: '#333'
}

const darkColors = {
  gradient: ['#483D8B', '#8A2BE2'],
  blur: 'dark' as 'dark',
  headerText: '#fff'
}

function useAppWidgetType() {
  const [widgetType, setWidgetType] = useState<AppWidgetType>('public')

  useEffect(() => {
    ;(async function () {
      const t =
        ((await WidgetKitGetItem(
          widgetAppWidgetType,
          SharedGroupPreferencesKey
        )) as AppWidgetType) ?? 'public'
      setWidgetType(t)
    })()
  }, [])

  const toggleWidgetType = useCallback(
    async (v: AppWidgetType) => {
      setWidgetType(v)
      await WidgetKitSetItem(widgetAppWidgetType, v, SharedGroupPreferencesKey)
      WidgetKitReloadAllTimelines()
    },
    [setWidgetType]
  )

  return {widgetType, toggleWidgetType}
}

function SettingsPage() {
  const navigation = useNavigation()
  const {t, i18n} = useTranslation()
  const client = useApolloClient()
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)
  const uid = useAtomValue(uidAtom)
  const {widgetType, toggleWidgetType} = useAppWidgetType()
  const isDarkMode = useColorScheme() === 'dark'
  const colors = isDarkMode ? darkColors : lightColors

  const [cacheSize, setCacheSize] = useState(0)
  useEffect(() => {
    CacheManager.getCacheSize().then(res => {
      setCacheSize(res)
    })
  }, [])

  const onLogout = useCallback(() => {
    setToken(null)
    setUid(null)
    updateLocalToken(null)
    client.resetStore()
    toast.success(t('Logged out'))
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }, [client, navigation, setToken, setUid, t])

  const [doDelete, {loading: isDeleting}] = useDeleteMyAccountMutation()
  const onRemoveMyAccount = useCallback(async () => {
    Alert.alert(
      t('Remove Account'),
      t(
        'Are you sure you want to remove your account? This action cannot be undone.'
      ),
      [
        {text: t('Cancel'), style: 'cancel'},
        {
          text: t('Remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              await doDelete()
              setToken(null)
              setUid(null)
              updateLocalToken(null)
              client.resetStore()
              toast.success(t('Account Removed'))
              setTimeout(() => {
                if (navigation.canGoBack()) {
                  navigation.goBack()
                }
              }, 1000)
            } catch (err) {
              console.error(err)
              toast.error(t('Error removing account'))
            }
          }
        }
      ]
    )
  }, [doDelete, navigation, setToken, setUid, t, client])

  return (
    <LinearGradient colors={colors.gradient} style={styles.flexOne}>
      <SafeAreaView style={styles.flexOne}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerText, {color: colors.headerText}]}>
              ClippingKK
            </Text>
            <Text style={[styles.subHeaderText, {color: colors.headerText}]}>
              Crafted by @AnnatarHe
            </Text>
          </View>

          <SettingsSection title="General">
            {Platform.OS === 'ios' && (
              <SettingsItem
                label="WidgetType"
                value={widgetType}
                onPress={() =>
                  toggleWidgetType(widgetType === 'own' ? 'public' : 'own')
                }
              />
            )}
            <SettingsItem
              label="Language"
              value={i18n.language?.toUpperCase()}
              onPress={() => {
                // TODO: Implement language selection
              }}
            />
            <SettingsItem
              label="Cache"
              value={`${(cacheSize / 1024 / 1024).toFixed(2)} MB`}
              onPress={() => {
                CacheManager.clearCache()
                setCacheSize(0)
                toast.success(t('Cache cleared'))
              }}
              isLast
            />
          </SettingsSection>

          {uid && (
            <SettingsSection title="Account">
              <SettingsItem label={t('Logout')} onPress={onLogout} />
              <SettingsItem
                label={t('Remove Account')}
                onPress={onRemoveMyAccount}
                isLast
              />
            </SettingsSection>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  flexOne: {flex: 1},
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    paddingVertical: 32,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: FontLXGW
  },
  subHeaderText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: FontLXGW
  }
})

export default SettingsPage
