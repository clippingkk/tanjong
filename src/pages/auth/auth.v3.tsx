import React, { useCallback, useEffect } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
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
import { useColorMode } from '@gluestack-style/react'
import { ChevronRightIcon, Icon } from '@gluestack-ui/themed'
import toast from 'react-hot-toast/headless'
import { LinearGradient } from 'react-native-linear-gradient'
import { BlurView } from '@react-native-community/blur'

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
              className="flex-row items-center justify-center"
              style={{
                color: cm === 'light' ? '#111111' : '#ffffff'
              }}>
              <Text>{t('app.auth.signup')}</Text>
              <Icon as={ChevronRightIcon} w={'$4'} h={'$4'} />
            </Link>
          )}
        </>
      )
    })
  }, [navigation])

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
    []
  )
  const signinWithAppleOnError = useCallback((err: any) => {
    toast.error(err.toString())
  }, [])

  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#60a5fa', '#3b82f6', '#2563eb']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <SafeAreaView className='flex-1'>
            <View style={styles.logoContainer} className='mt-4'>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/logo.png')}
                  alt="logo"
                  style={styles.logo}
                />
              </View>

              <Text style={styles.appName}>
                ClippingKK
              </Text>

              <Text style={styles.slogan}>
                {t('app.slogan')}
              </Text>
            </View>

            <View style={styles.formContainer}>
              {Platform.OS === 'ios' && (
                <BlurView
                  style={StyleSheet.absoluteFillObject}
                  blurType={cm === 'dark' ? 'dark' : 'light'}
                  blurAmount={20}
                />
              )}

              <View style={styles.formContent}>
                <AuthClassicPage onPostAuth={onPostAuth} />

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialLoginContainer}>
                  <SigninWithApple
                    loading={appleAuthResp.loading}
                    onSuccess={signinWithAppleOnSuccess}
                    onError={signinWithAppleOnError}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slogan: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: FontLXGW,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  formContainer: {
    borderRadius: 30,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  formContent: {
    padding: 30,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    fontWeight: '600',
    color: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)',
  },
  socialLoginContainer: {
    alignItems: 'center',
  },
})

export default AuthV3Page
