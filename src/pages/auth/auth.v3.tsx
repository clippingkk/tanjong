import React, { useCallback, useEffect } from 'react'
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import {
	AppleLoginPlatforms,
	AppleVerifyPayload,
	useLoginByAppleLazyQuery,
} from '../../schema/generated'
import { usePostAuth } from '../../hooks/auth'
import SigninWithApple from '../../components/signinWithApple/signinWithApple'
import {
	Link,
	useLinkBuilder,
	useLinkTo,
	useNavigation,
} from '@react-navigation/native'
import { RouteKeys, RouteParamList } from '../../routes'
import { useTranslation } from 'react-i18next'
import WalletConnectLoginButton from './walletconnect'
import { FontLXGW } from '../../styles/font'
import AuthClassicPage from './auth.classic.page'
import { featureFlags } from '../../service/feature-flags'
import { useColorMode } from '@gluestack-style/react'
import { ChevronRightIcon, Icon } from '@gluestack-ui/themed'
import Toast from '../../components/toast/toast'
import toast from 'react-hot-toast/headless'
import { LinearGradient } from 'react-native-linear-gradient'

function Divider() {
	return <View />
}

function AuthV3Page() {
	const navigation = useNavigation()
	const cm = useColorMode()
	useEffect(() => {
		navigation.setOptions({
			title: 'Account',
			headerRight: () => (
				<>
					{featureFlags.enableSignUp && (
						<Link
							screen={RouteKeys.SignUpEmail}
							style={{
								alignItems: 'center',
								flexDirection: 'row',
								color: cm === 'light' ? '#111111' : '#ffffff',
							}}
						>
							<Text>{t('app.auth.signup')}</Text>
							<Icon as={ChevronRightIcon} w={'$4'} h={'$4'} />
						</Link>
					)}
				</>
			),
		})
	}, [navigation])

	const [doAppleAuth, appleAuthResp] = useLoginByAppleLazyQuery()

	const onPostAuth = usePostAuth(navigation)
	const { buildHref } = useLinkBuilder()
	const linkTo = useLinkTo()
	const signinWithAppleOnSuccess = useCallback(
		async (data: AppleVerifyPayload) => {
			const authResp = await doAppleAuth({
				variables: {
					payload: data,
				},
			})
			if (authResp.error) {
				toast.error(authResp.error.message)
				return
			}
			if (!authResp.data) {
				toast.error('no data info')
				return
			}

			const { noAccountFrom3rdPart, token, user } = authResp.data.loginByApple

			if (noAccountFrom3rdPart) {
				const href = buildHref(RouteKeys.AuthAppleBind, {
					params: {
						idToken: data.idToken,
					},
				})

				if (href) {
					linkTo(href)
				}
				return
			}
			// goto auth
			return onPostAuth(token, user.id)
		},
		[],
	)
	const signinWithAppleOnError = useCallback((err: any) => {
		toast.show({
			title: err.toString(),
		})
	}, [])

	const { t } = useTranslation()

	return (
		<LinearGradient
			colors={['#4c669f', '#3b5998', '#192f6a']}
			style={styles.gradient}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<View style={styles.container}>
					<SafeAreaView>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								height: '100%',
							}}
						>
							<Image
								source={require('../../assets/logo.png')}
								alt="logo"
								width={70}
								height={70}
								style={{
									height: 70,
									width: 70,
									borderRadius: 8,
									shadowOffset: {
										width: 4,
										height: 4,
									},
								}}
							/>
							<View style={{ margin: 16 }}>
								<Text
									style={{
										textAlign: 'center',
										fontSize: 20,
										fontWeight: 'bold',
										padding: 6,
									}}
								>
									ClippingKK
								</Text>
								<Text
									style={{
										width: 280,
										textAlign: 'center',
										fontFamily: FontLXGW,
										fontSize: 14,
									}}
								>
									{t('app.slogan')}
								</Text>
							</View>

							<View style={{ margin: 32, width: '90%' }} />

							<AuthClassicPage onPostAuth={onPostAuth} />

							<View style={{ margin: 32, width: '90%' }} />

							<SigninWithApple
								loading={appleAuthResp.loading}
								onSuccess={signinWithAppleOnSuccess}
								onError={signinWithAppleOnError}
							/>
							{/* <WalletConnectLoginButton
								onLoggedIn={(token, userId) => onPostAuth(token, userId)}
							/> */}
							{/* <Button
                height={45}
                bgColor={'blue.500'}
                width={180}
                color='gray.900'
                _dark={{
                  color: 'gray.100'
                }}
              >
                <Link
                  to={{ screen: RouteKeys.AuthQRCode }}>
                  {t('app.auth.loginByScanQRCode')}
                </Link>
              </Button> */}
						</View>
					</SafeAreaView>
				</View>
			</KeyboardAvoidingView>
			<View style={styles.blur} />
		</LinearGradient>
	)
}

const cm = 'dark'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: cm === 'dark' ? '#000' : '#fff',
	},
	header: {
		fontSize: 24,
		fontWeight: '700',
		color: cm === 'dark' ? '#fff' : '#222',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
	blur: {
		...Platform.select({
			ios: { backgroundColor: 'rgba(255,255,255,0.3)' },
			android: { backgroundColor: 'rgba(255,255,255,0.3)' },
			default: { backgroundColor: 'transparent' },
		}),
	},
	gradient: {
		flex: 1,
		...StyleSheet.absoluteFillObject,
	},
})

export default AuthV3Page
