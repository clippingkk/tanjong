import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Platform, SafeAreaView, View, StyleSheet } from 'react-native'
import { useNavigation, useLinkTo } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Page from '../../components/page'
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
	reloadAllTimelines as WidgetKitReloadAllTimelines,
} from 'react-native-widgetkit'

import { SharedGroupPreferencesKey } from '../../constants/config'

import { widgetAppWidgetType } from '../../hooks/auth'
import { CacheManager } from '@georstat/react-native-image-cache'

type AppWidgetType = 'public' | 'own'

const languages: Record<string, { name: string; icon: string }> = {
	en: {
		name: 'English',
		icon: '🇬🇧',
	},
	zh: {
		name: '中文',
		icon: '🇨🇳',
	},
	ko: {
		name: '한국',
		icon: '🇰🇷',
	},
}

function useAppWidgetType() {
	const [widgetType, setWidgetType] = useState<AppWidgetType>('public')

	useEffect(() => {
		;(async function () {
			const t =
				((await WidgetKitGetItem(
					widgetAppWidgetType,
					SharedGroupPreferencesKey,
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
		[setWidgetType],
	)

	return {
		widgetType,
		toggleWidgetType,
	}
}

function SettingsPage() {
	const navigation = useNavigation()
	const linkTo = useLinkTo()
	const { t, i18n } = useTranslation()
	const client = useApolloClient()
	const setToken = useSetAtom(tokenAtom)
	const setUid = useSetAtom(uidAtom)
	const uid = useAtomValue(uidAtom)
	const { widgetType, toggleWidgetType } = useAppWidgetType()

	const [cacheSize, setCacheSize] = useState(0)
	useEffect(() => {
		CacheManager.getCacheSize().then((res) => {
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

	const [doDelete, { loading: isDeleting }] = useDeleteMyAccountMutation()
	const onRemoveMyAccount = useCallback(async () => {
		try {
			await doDelete()
			setToken(null)
			setUid(null)
			updateLocalToken(null)
			client.resetStore()
			Alert.alert(t('Account Removed'), t('Your account has been removed.'))
			setTimeout(() => {
				if (navigation.canGoBack()) {
					navigation.goBack()
				}
			}, 3000)
		} catch (err) {
			console.error(err)
			toast.error(t('Error removing account'))
		}
	}, [doDelete, navigation, setToken, setUid, t, client])

	return (
		<Page>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Header with gradient and blur effect */}
					<View style={styles.header}>
						<View style={styles.headerGradient}>
							<View style={styles.headerContent}>
								<SettingsItem label="Created by" value="@AnnatarHe" />
							</View>
						</View>
					</View>
					{/* General Section */}
					<SettingsSection title="General">
						{Platform.OS === 'ios' && (
							<SettingsItem
								label="WidgetType"
								value={widgetType}
								onPress={() => {
									toggleWidgetType(widgetType === 'own' ? 'public' : 'own')
								}}
							/>
						)}
						<SettingsItem
							label="Language"
							value={i18n.language?.toUpperCase()}
							onPress={() => {
								// do the language change
							}}
						/>
						<SettingsItem
							label="Cache"
							value={`${cacheSize} B`}
							onPress={() => {
								CacheManager.clearCache()
								setCacheSize(0)
								toast.success(t('Cache cleared'))
							}}
						/>
					</SettingsSection>
					{/* Account Section */}
					{uid && (
						<SettingsSection title="Account">
							<SettingsItem label={t('Logout')} onPress={onLogout} />
							<SettingsItem
								label={t('Remove Account')}
								onPress={onRemoveMyAccount}
							/>
						</SettingsSection>
					)}
				</View>
			</SafeAreaView>
		</Page>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F2F2F2',
	},
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		marginBottom: 32,
		borderRadius: 12,
		overflow: 'hidden',
	},
	headerGradient: {
		padding: 16,
		// Placeholder for gradient and blur effect, replace with actual gradient if available
		backgroundColor: '#ff5f6d',
	},
	headerContent: {
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default SettingsPage
