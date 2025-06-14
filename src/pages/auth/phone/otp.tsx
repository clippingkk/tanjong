import {Button, KeyboardAvoidingView, Text, useToast, View} from 'native-base'
import React, {useCallback, useMemo, useState} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RouteParamList} from '../../../routes'
import {Keyboard, Platform, TouchableWithoutFeedback} from 'react-native'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {
  AppleLoginPlatforms,
  useBindAppleUniqueMutation
} from '../../../schema/generated'
import {usePostAuth} from '../../../hooks/auth'
import {useTranslation} from 'react-i18next'
import {useNavigation} from '@react-navigation/native'

type AuthPhoneOTPPageProps = NativeStackScreenProps<
  RouteParamList,
  'AuthPhoneOTP'
>

function AuthPhoneOTPPage(props: AuthPhoneOTPPageProps) {
  const {t} = useTranslation()
  const [code, setCode] = useState('')
  const toast = useToast()

  const requestPayload = useMemo(() => {
    return {
      code: '',
      idToken: props.route.params.idToken,
      state: '',
      platform:
        Platform.OS === 'ios'
          ? AppleLoginPlatforms.IOs
          : AppleLoginPlatforms.Android
    }
  }, [props.route.params.idToken])

  const [doBind, doBindResult] = useBindAppleUniqueMutation()
  const onPostAuth = usePostAuth()

  const onCodeFilled = useCallback(
    async (code: string) => {
      try {
        const bindResult = await doBind({
          variables: {
            phone: props.route.params.phone,
            code,
            payload: requestPayload
          }
        })
        const rs = bindResult.data?.bindAppleUnique
        if (!rs) {
          return
        }
        return onPostAuth(rs.token, rs.user.id)
      } catch (err: any) {
        toast.show({
          title: err.toString()
        })
      }
    },
    [doBind, requestPayload]
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        h={{
          base: '100%',
          lg: 'auto'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View bgColor="gray.100" _dark={{bgColor: 'gray.900'}}>
          <SafeAreaView>
            <View alignItems="center" justifyContent="center" height="100%">
              <View>
                <Text>{t('app.auth.code.placeholder')}</Text>
              </View>
              <OTPInputView
                style={{width: '80%', height: 200}}
                pinCount={6}
                onCodeFilled={onCodeFilled}
                code={code}
                onCodeChanged={setCode}
              />
              <Button
                onPress={() => setCode('')}
                isLoading={doBindResult.loading}>
                {t('app.common.cancel')}
              </Button>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default AuthPhoneOTPPage
