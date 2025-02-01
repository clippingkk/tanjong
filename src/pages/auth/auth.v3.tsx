import React, { useCallback, useEffect } from 'react'
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
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
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View bgColor="gray.100" _dark={{ bgColor: 'gray.900' }}>
				<SafeAreaView>
					<View alignItems="center" justifyContent="center" height="100%">
						<Image
							source={require('../../assets/logo.png')}
							alt="logo"
							width={70}
							height={70}
							style={{
								borderRadius: 8,
								shadowOffset: {
									width: 4,
									height: 4,
								},
							}}
						/>
						<View my={4}>
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
								width={280}
								style={{
									textAlign: 'center',
									fontFamily: FontLXGW,
									fontSize: 14,
								}}
							>
								{t('app.slogan')}
							</Text>
						</View>

						<Divider width={'90%'} my={8} />

						<AuthClassicPage onPostAuth={onPostAuth} />

						<Divider width={'90%'} my={8} />

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
	)
}

export default AuthV3Page
