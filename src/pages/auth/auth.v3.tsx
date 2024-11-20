import { Divider, Image, KeyboardAvoidingView, Text, useToast, View } from 'native-base'
import React, { useCallback, useEffect } from 'react'
import { Platform, SafeAreaView } from 'react-native';
import { AppleLoginPlatforms, AppleVerifyPayload, useLoginByAppleLazyQuery } from '../../schema/generated';
import { usePostAuth } from '../../hooks/auth';
import SigninWithApple from '../../components/signinWithApple/signinWithApple';
import { Link, useLinkBuilder, useLinkTo } from '@react-navigation/native';
import { RouteKeys, RouteParamList } from '../../routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import WalletConnectLoginButton from './walletconnect';
import { FontLXGW } from '../../styles/font';
import AuthClassicPage from './auth.classic.page';
import { featureFlags } from '../../service/feature-flags';
import { useColorMode } from '@gluestack-style/react';
import { Button, ChevronRightIcon, Icon } from '@gluestack-ui/themed';

type AuthV3PageProps = NativeStackScreenProps<RouteParamList, RouteKeys.AuthV3>

function AuthV3Page(props: AuthV3PageProps) {
  const cm = useColorMode()
  useEffect(() => {
    props.navigation.setOptions({
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
              <Text>
                {t('app.auth.signup')}
              </Text>
              <Icon as={ChevronRightIcon} w={'$4'} h={'$4'} />
            </Link>
          )}
        </>
      )
    })
  }, [props])

  const [doAppleAuth, appleAuthResp] = useLoginByAppleLazyQuery()
  const toast = useToast()

  const onPostAuth = usePostAuth(props.navigation)
  const { buildHref } = useLinkBuilder()
  const linkTo = useLinkTo()
  const signinWithAppleOnSuccess = useCallback(async (data: AppleVerifyPayload) => {
    const authResp = await doAppleAuth({
      variables: {
        payload: data
      }
    })
    if (authResp.error) {
      toast.show({
        title: authResp.error.message
      })
      toast.show({
        title: JSON.stringify(authResp.error)
      })
      return
    }
    if (!authResp.data) {
      toast.show({
        title: 'no data info'
      })
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
  }, [])
  const signinWithAppleOnError = useCallback((err: any) => {
    toast.show({
      title: err.toString()
    })
  }, [])

  const { t } = useTranslation()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View bgColor='gray.100' _dark={{ bgColor: 'gray.900' }}>
        <SafeAreaView>
          <View alignItems='center' justifyContent='center' height='100%'>
            <Image
              source={require('../../assets/logo.png')}
              alt='logo'
              width={70}
              height={70}
              style={{
                borderRadius: 8,
                shadowOffset: {
                  width: 4,
                  height: 4,
                }
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
              >ClippingKK</Text>
              <Text
                width={280}
                style={{
                  textAlign: 'center',
                  fontFamily: FontLXGW,
                  fontSize: 14,
                }}
              >{t('app.slogan')}</Text>
            </View>

            <Divider width={'90%'} my={8} />

            <AuthClassicPage onPostAuth={onPostAuth} />

            <Divider width={'90%'} my={8} />

            <SigninWithApple
              loading={appleAuthResp.loading}
              onSuccess={signinWithAppleOnSuccess}
              onError={signinWithAppleOnError}
            />
            <WalletConnectLoginButton
              onLoggedIn={(token, userId) => onPostAuth(token, userId)}
            />
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