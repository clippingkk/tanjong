import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Text, Toast, View, useToast } from '@gluestack-ui/themed';
import SignUpLayout from './layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpInput } from "react-native-otp-entry";
import { RouteParamList, RouteKeys } from '../../routes';
import { Link } from '@react-navigation/native';
import { OtpChannel, useSendOtpMutation } from '../../schema/generated';
import toast from 'react-hot-toast/headless';
import { getTempCFToken } from '../../utils/cfToken';

type SignUpOTPPageProps = NativeStackScreenProps<RouteParamList, RouteKeys.SignUpOTP>

function SignUpOTPPage(props: SignUpOTPPageProps) {
  const { email, password: pwd } = props.route.params
  useEffect(() => {
    props.navigation.setOptions({
      title: email,
    })
  }, [])

  const [reminds, setReminds] = useState(0)
  const sendOtpTimer = useRef<NodeJS.Timeout | null>(null)

  const [sendOtp] = useSendOtpMutation({
    variables: {
      channel: OtpChannel.Email,
      address: email,
      cfTurnstileToken: getTempCFToken()
    },
    onCompleted(data) {
      toast.success('OTP sent, please check your email')
    },
    onError(err) {
      toast.error(err.message)
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

  const onSignUp = useCallback((text: string) => {

  }, [])

  return (
    <SignUpLayout title='OTP'>
      <View>
        <View my={'$10'}>
          <OtpInput
            numberOfDigits={6}
            onFilled={onSignUp}
          />
        </View>
        <Button
          onPress={onResendOtp}
          isDisabled={reminds > 0}
        >
          <Text>
            Resend
          </Text>
          {reminds > 0 && (
            <Text ml={'$1'}>
              ({reminds}s)
            </Text>
          )}
        </Button>
      </View>
    </SignUpLayout>
  );
}

export default SignUpOTPPage;