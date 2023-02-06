import { Button, KeyboardAvoidingView, Text, useToast, View } from 'native-base'
import AV from 'leancloud-storage/core'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PhoneInput from "react-native-phone-number-input"

type AuthApplePhoneBindProps = {
}

function AuthApplePhoneBind(props: AuthApplePhoneBindProps) {
  const phoneInput = useRef<PhoneInput>(null)
  const [pn, setPn] = useState('')
  const [capture, setCapture] = useState<AV.Captcha | null>(null)
  const [smsSent, setSmsSent] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')

  const [value, setValue] = useState('')
  const [formattedValue, setFormattedValue] = useState("")
  console.log('val', value, formattedValue)

  const toast = useToast()

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (pn.length < 3) {
      return
    }
    if (pn.length < 5 || pn.length > 16) {
      toast.show({
        title: 'app.auth.errors.pnLen'
      })
      return
    }
    AV.Captcha.request().then(res => {
      setVerifyCode('')
      setCapture(res)
    }).catch(err => {
      toast.show({
        title: err.toString()
      })
    })
  }, [pn])

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
              defaultValue={value}
              defaultCode="CN"
              layout="first"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              withDarkTheme
              withShadow
              autoFocus
            />
            <Button>
              <Text>Confirm</Text>
            </Button>
            </View>
            <View>
              <Text>verify code</Text>
            </View>
            <View>
              <Text>OTP</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AuthApplePhoneBind