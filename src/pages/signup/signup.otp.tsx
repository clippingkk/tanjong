import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Button, Text, View} from '@gluestack-ui/themed'
import SignUpLayout from './layout'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {OtpInput} from 'react-native-otp-entry'
import {RouteParamList, RouteKeys} from '../../routes'
import {
  OtpChannel,
  useSendOtpMutation,
  useSignupMutation
} from '../../schema/generated'
import toast from 'react-hot-toast/headless'
import {getTempCFToken} from '../../utils/cfToken'
import {ActivityIndicator} from 'react-native'
import {usePostAuth} from '../../hooks/auth'
import {useNavigation} from '@react-navigation/native'

type SignUpOTPPageProps = NativeStackScreenProps<
  RouteParamList,
  RouteKeys.SignUpOTP
>

function SignUpOTPPage(props: SignUpOTPPageProps) {
  const {email, password: pwd} = props.route.params
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      title: email
    })
  }, [])

  const onPostAuth = usePostAuth()
  const [reminds, setReminds] = useState(0)
  const sendOtpTimer = useRef<NodeJS.Timeout | null>(null)
  const [sendOtp, {loading: isOTPSending}] = useSendOtpMutation({
    variables: {
      channel: OtpChannel.Email,
      address: email,
      cfTurnstileToken: getTempCFToken()
    },
    onCompleted(data) {
      toast.success('OTP sent, please check your email')
    },
    onError() {
      // reset the timer if there's an error
      if (sendOtpTimer.current) {
        clearInterval(sendOtpTimer.current as NodeJS.Timeout)
        sendOtpTimer.current = null
      }
    }
  })

  const onResendOtp = () => {
    if (sendOtpTimer.current) {
      toast.error('Please wait for 60 seconds before resending')
      return
    }

    setReminds(60)
    sendOtp()
    sendOtpTimer.current = setInterval(() => {
      setReminds(prev => {
        if (prev <= 0) {
          clearInterval(sendOtpTimer.current as NodeJS.Timeout)
          sendOtpTimer.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    // automatic send otp when the page is mounted
    onResendOtp()
  }, [])

  const [doSignUp, {loading: isSigningUp}] = useSignupMutation({
    async onCompleted(data) {
      await onPostAuth(data.signup.token, data.signup.user.id)
      navigation.navigate({
        screen: RouteKeys.SignUpSetName,
        params: {
          data: data.signup
        }
      } as never)
    }
  })
  const onSignUp = useCallback(
    (text: string) => {
      doSignUp({
        variables: {
          payload: {
            email,
            password: pwd,
            otp: text
          }
        }
      })
    },
    [email, pwd]
  )

  return (
    <SignUpLayout title="OTP">
      <View>
        <View my={'$10'}>
          <OtpInput numberOfDigits={6} onFilled={onSignUp} />
        </View>
        <Button
          onPress={onResendOtp}
          isDisabled={reminds > 0 || isOTPSending || isSigningUp}>
          {(isOTPSending || isSigningUp) && (
            <ActivityIndicator style={{marginRight: 4}} />
          )}
          <Text color="$white" sx={{color: '$black'}}>
            Resend
          </Text>
          {reminds > 0 && <Text ml={'$1'}>({reminds}s)</Text>}
        </Button>
      </View>
    </SignUpLayout>
  )
}

export default SignUpOTPPage
