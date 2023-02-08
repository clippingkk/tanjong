import { Button, Divider, Image, Input, KeyboardAvoidingView, Pressable, Text, useToast, View } from 'native-base'
import AV from 'leancloud-storage/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PhoneInput from "react-native-phone-number-input"
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteKeys, RouteParamList } from '../../../routes'
import { Platform } from 'react-native'
import * as Sentry from "@sentry/react-native";
import { useLinkTo } from '@react-navigation/native'

type AuthApplePhoneBindProps = NativeStackScreenProps<RouteParamList, 'AuthAppleBind'>

function AuthApplePhoneBind(props: AuthApplePhoneBindProps) {
  const phoneInput = useRef<PhoneInput>(null)
  const [pn, setPn] = useState('')
  const [capture, setCapture] = useState<AV.Captcha | null>(null)
  const [verifyCode, setVerifyCode] = useState('')

  const toast = useToast()

  const onPhoneNumberConfirm = useCallback(async () => {
    if (!phoneInput.current?.isValidNumber(pn)) {
      toast.show({
        title: 'Error. Phone number is invalid'
      })
      return
    }
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
    }
  }, [pn])
  const linkTo = useLinkTo<RouteParamList>()

  const onSMSSendPress = useCallback(async () => {
    if (!capture) {
      toast.show({
        title: 'capture info not found'
      })
      return
    }
    if (verifyCode.length !== 4) {
      toast.show({
        title: 'verify code invalid'
      })
      return
    }

    try {
      const vt = await capture.verify(verifyCode)
      await AV.Cloud.requestSmsCode({
        mobilePhoneNumber: pn,
      }, {
        validateToken: vt
      })
      toast.show({
        title: 'SMS sent'
      })
      linkTo({
        screen: RouteKeys.AuthPhoneOTP,
        params: {
          phone: pn,
          idToken: props.route.params.idToken
        }
      })
    } catch (err: any) {
      toast.show({
        title: err.toString()
      })
    }
  }, [verifyCode, capture])

  return (
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
              <Button onPress={onPhoneNumberConfirm}>
                <Text>Confirm</Text>
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
                <Button onPress={onSMSSendPress} mt={5}>
                  Send SMS
                </Button>
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AuthApplePhoneBind