import React, { useCallback, useEffect } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
  StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  AppleVerifyPayload,
  useLoginByAppleLazyQuery
} from '../../schema/generated'
import { usePostAuth } from '../../hooks/auth'
import SigninWithApple from '../../components/signinWithApple/signinWithApple'
import {
  Link,
  useLinkBuilder,
  useLinkTo,
  useNavigation
} from '@react-navigation/native'
import { RouteKeys } from '../../routes'
import { useTranslation } from 'react-i18next'
import { FontLXGW } from '../../styles/font'
import AuthClassicPage from './auth.classic.page'
import { featureFlags } from '../../service/feature-flags'
import toast from 'react-hot-toast/headless'
import { LinearGradient } from 'react-native-linear-gradient'

function AuthV3Page() {
  const navigation = useNavigation()
  const { t } = useTranslation()

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerRight: featureFlags.enableSignUp ? () => (
        <Link
          screen={RouteKeys.SignUpEmail}
          className="px-4 py-2 rounded-full bg-white/20 mr-2">
          <Text className="text-white font-semibold text-sm">
            {t('app.auth.signup')}
          </Text>
        </Link>
      ) : undefined
    })
  }, [navigation, t])

  const [doAppleAuth, appleAuthResp] = useLoginByAppleLazyQuery()

  const onPostAuth = usePostAuth()
  const { buildHref } = useLinkBuilder()
  const linkTo = useLinkTo()

  const signinWithAppleOnSuccess = useCallback(
    async (data: AppleVerifyPayload) => {
      const authResp = await doAppleAuth({
        variables: {
          payload: data
        }
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
            idToken: data.idToken
          }
        })

        if (href) {
          linkTo(href)
        }
        return
      }
      // goto auth
      return onPostAuth(token, user.id)
    },
    [buildHref, doAppleAuth, linkTo, onPostAuth]
  )

  const signinWithAppleOnError = useCallback((err: any) => {
    toast.error(err.toString())
  }, [])

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={['#60a5fa', '#3b82f6', '#2563eb']}
        className="absolute inset-0"
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <SafeAreaView className="flex-1 px-6">
            {/* Logo Section */}
            <View className="items-center pt-12 pb-8">
              <View className="w-24 h-24 rounded-3xl bg-white/95 items-center justify-center mb-5 shadow-2xl">
                <Image
                  source={require('../../assets/logo.png')}
                  alt="ClippingKK Logo"
                  className="w-16 h-16 rounded-2xl"
                />
              </View>

              <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
                ClippingKK
              </Text>

              <Text
                className="text-base text-white/90 text-center px-8 leading-6"
                style={{ fontFamily: FontLXGW }}>
                {t('app.slogan')}
              </Text>
            </View>

            {/* Auth Form Card */}
            <View className="flex-1 justify-center pb-8">
              <View className="bg-white/95 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                {/* Welcome Text */}
                <View className="mb-6">
                  <Text className="text-2xl font-bold text-gray-900 mb-1">
                    {t('app.auth.welcome') || 'Welcome back'}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {t('app.auth.welcomeSubtitle') || 'Sign in to continue to your account'}
                  </Text>
                </View>

                {/* Email/Password Form */}
                <AuthClassicPage onPostAuth={onPostAuth} />

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-px bg-gray-200" />
                  <Text className="px-4 text-sm font-medium text-gray-400">
                    OR
                  </Text>
                  <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Social Login */}
                <View className="items-center">
                  <SigninWithApple
                    loading={appleAuthResp.loading}
                    onSuccess={signinWithAppleOnSuccess}
                    onError={signinWithAppleOnError}
                  />
                </View>

                {/* Footer Links */}
                <View className="mt-6 items-center">
                  <Text className="text-xs text-gray-500 text-center">
                    {t('app.auth.termsHint') || 'By continuing, you agree to our Terms & Privacy Policy'}
                  </Text>
                </View>
              </View>

              {/* Bottom spacing for safe area */}
              <View className="h-8" />
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default AuthV3Page
