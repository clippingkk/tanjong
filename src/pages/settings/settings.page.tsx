import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Platform,
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Text,
  Linking
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import SettingsSection from './SettingsSection'
import SettingsItem from './SettingsItem'
import { useApolloClient } from '@apollo/client'
import { useAtomValue, useSetAtom } from 'jotai'
import { tokenAtom, uidAtom } from '../../atomic'
import { updateLocalToken } from '../../utils/apollo'
import { useDeleteMyAccountMutation } from '../../schema/generated'
import toast from 'react-hot-toast/headless'
import {
  setItem as WidgetKitSetItem,
  getItem as WidgetKitGetItem,
  reloadAllTimelines as WidgetKitReloadAllTimelines
} from 'react-native-widgetkit'
import { SharedGroupPreferencesKey } from '../../constants/config'
import { widgetAppWidgetType } from '../../hooks/auth'
import { CacheManager } from '@georstat/react-native-image-cache'
import { FontLXGW } from '../../styles/font'
import { GradientBackground } from '../../components/ui'

type AppWidgetType = 'public' | 'own'

const lightColors = {
  headerText: '#1E293B',
  subHeaderText: '#64748B',
  dangerText: '#EF4444'
}

const darkColors = {
  headerText: '#E0E7FF',
  subHeaderText: '#94A3B8',
  dangerText: '#F87171'
}

function useAppWidgetType() {
  const [widgetType, setWidgetType] = useState<AppWidgetType>('public')

  useEffect(() => {
    ; (async function () {
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

  return { widgetType, toggleWidgetType }
}

function SettingsPage() {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const client = useApolloClient()
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)
  const uid = useAtomValue(uidAtom)
  const { widgetType, toggleWidgetType } = useAppWidgetType()
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

  const [doDelete] = useDeleteMyAccountMutation()
  const openWebLink = useCallback((path: `/${string}`) => {
    const url = new URL(`https://shelltime.xyz${path}`)
    Linking.openURL(url.href).catch((err) => {
      console.error('Failed to open URL:', err)
      toast.error('Failed to open link')
    })
  }, [])

  const onRemoveMyAccount = useCallback(async () => {
    Alert.alert(
      t('Remove Account'),
      t(
        'Are you sure you want to remove your account? This action cannot be undone.'
      ),
      [
        { text: t('Cancel'), style: 'cancel' },
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
    <GradientBackground>
      <SafeAreaView style={styles.flexOne}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.appIconContainer}>
              <Text style={styles.appIcon}>📚</Text>
            </View>
            <Text style={[styles.appName, { color: colors.headerText }]}>
              ClippingKK
            </Text>
            <Text style={[styles.appVersion, { color: colors.subHeaderText }]}>
              Version 3.1.4 • By @AnnatarHe
            </Text>
          </View>

          <SettingsSection title="General" icon="⚙️">
            {Platform.OS === 'ios' && (
              <SettingsItem
                label="Widget Display"
                value={widgetType === 'own' ? 'Personal' : 'Public'}
                onPress={() =>
                  toggleWidgetType(widgetType === 'own' ? 'public' : 'own')
                }
                icon="🪟"
              />
            )}
            <SettingsItem
              label="Language"
              value={i18n.language?.toUpperCase()}
              onPress={() => {
                // TODO: Implement language selection
              }}
              icon="🌐"
            />
            <SettingsItem
              label="Storage"
              value={`${(cacheSize / 1024 / 1024).toFixed(2)} MB`}
              onPress={() => {
                Alert.alert(
                  'Clear Cache',
                  'This will remove all cached images. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: () => {
                        CacheManager.clearCache()
                        setCacheSize(0)
                        toast.success(t('Cache cleared'))
                      }
                    }
                  ]
                )
              }}
              icon="💾"
              isLast
            />
          </SettingsSection>

          {uid && (
            <SettingsSection title="Account" icon="👤">
              <SettingsItem
                label={t('Sign Out')}
                onPress={onLogout}
                icon="🚪"
                isDanger
              />
              <SettingsItem
                label={t('Delete Account')}
                onPress={onRemoveMyAccount}
                icon="⚠️"
                isDanger
                isLast
              />
            </SettingsSection>
          )}

          <SettingsSection title="About" icon="ℹ️">
            <SettingsItem
              label="Privacy Policy"
              onPress={() => openWebLink('/privacy')}
              icon="🔒"
            />
            <SettingsItem
              label="Terms of Service"
              onPress={() => openWebLink('/terms')}
              icon="📜"
            />
            <SettingsItem
              label="Support"
              onPress={() => openWebLink('/support')}
              icon="💬"
              isLast
            />
          </SettingsSection>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  appIcon: {
    fontSize: 40
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    // fontFamily: FontLXGW,
    letterSpacing: -0.3,
    marginBottom: 8
  },
  appVersion: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: FontLXGW,
    opacity: 0.6
  }
})

export default SettingsPage
