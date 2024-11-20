import { Button, Divider, Image, Input, KeyboardAvoidingView, Pressable, Text, useToast, View } from 'native-base'
import AV from 'leancloud-storage/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PhoneInput from "react-native-phone-number-input"
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteKeys, RouteParamList } from '../../../routes'
import { ActivityIndicator, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'
import * as Sentry from "@sentry/react-native";
import { useLinkBuilder, useLinkTo } from '@react-navigation/native'
import SignupSkipButton from './signup-skip-button'
import { useTranslation } from 'react-i18next'

type AuthApplePhoneBindProps = NativeStackScreenProps<RouteParamList, 'AuthAppleBind'>

function AuthApplePhoneBind(props: AuthApplePhoneBindProps) {
  const { t } = useTranslation()
  const phoneInput = useRef<PhoneInput>(null)
  const [pn, setPn] = useState('')
  const [capture, setCapture] = useState<AV.Captcha | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: (hprops) => (
        <SignupSkipButton {...hprops} idToken={props.route.params.idToken} navigation={props.navigation} />
      )
    })
  }, [props.navigation])

  const toast = useToast()

  const onPhoneNumberConfirm = useCallback(async () => {
    if (!phoneInput.current?.isValidNumber(pn)) {
      toast.show({
        title: t('app.auth.errors.pnLen')
      })
      return
    }
    setLoading(true)
    try {
      const res = await AV.Captcha.request({
        width: 100,
        height: 40
      })
      setVerifyCode('')
      setCapture(res)
    } catch (err: any) {
      Sentry.withScope(s => {
        s.setExtra('pn', pn)
        Sentry.captureException(err)
      })
      toast.show({
        title: err.toString()
      })
    } finally {
      setLoading(false)
    }
  }, [pn])
  const { buildHref } = useLinkBuilder()
  const linkTo = useLinkTo()

  const onSMSSendPress = useCallback(async () => {
    if (!capture) {
      toast.show({
        title: 'capture info not found'
      })
      return
    }
    if (verifyCode.length !== 4) {
      toast.show({
        title: t('app.auth.errors.verifyCodeLen')
      })
      return
    }

    setLoading(true)
    try {
      const vt = await capture.verify(verifyCode)
      await AV.Cloud.requestSmsCode({
        mobilePhoneNumber: pn,
      }, {
        validateToken: vt
      })
      toast.show({
        title: t('app.auth.info.smsSent')
      })
      const href = buildHref(RouteKeys.AuthPhoneOTP, {
        phone: pn,
        idToken: props.route.params.idToken
      })
      if (!href) {
        return
      }
      linkTo(href)
    } catch (err: any) {
      toast.show({
        title: err.toString()
      })
    } finally {
      setLoading(false)
    }
  }, [verifyCode, capture])

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <KeyboardAvoidingView
        h={{
          base: '100%',
          lg: "auto"
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View bgColor='gray.100' _dark={{ bgColor: 'gray.900' }}>
          <SafeAreaView>
            <View alignItems='center' justifyContent='center' height='100%'>
              <View>
                <PhoneInput
                  ref={phoneInput}
                  // defaultValue={value}
                  value={pn}
                  defaultCode="CN"
                  layout="first"
                  onChangeText={setPn}
                  withDarkTheme
                  withShadow
                  autoFocus
                />
                <Button onPress={onPhoneNumberConfirm} isLoading={loading}>
                  <Text>{t('app.common.confirm')}</Text>
                </Button>
              </View>
              <Divider my={4} />
              {capture ? (
                <View px={6}>
                  <View justifyContent='center' width='100%' flexDir='row'>
                    <Pressable
                      onPress={onPhoneNumberConfirm}
                    >
                      <Image
                        source={{ uri: capture.url }}
                        alt='verify code'
                        width='100px'
                        height='40px'
                        resizeMode='cover'
                      />
                    </Pressable>
                    <Input
                      ml={4}
                      placeholder='verify code'
                      flex={1}
                      value={verifyCode}
                      onChangeText={setVerifyCode}
                    />
                  </View>
                  <Button onPress={onSMSSendPress} mt={5} isLoading={loading}>
                    {t('app.common.confirm')}
                  </Button>
                </View>
              ) : null}
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default AuthApplePhoneBind