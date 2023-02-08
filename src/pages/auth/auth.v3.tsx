import { Button, Center, Divider, FormControl, Input, KeyboardAvoidingView, Text, useToast, View, VStack } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import React, { useCallback, useEffect } from 'react'
import { Platform, SafeAreaView } from 'react-native';
import { AppleVerifyPayload, useAuthLazyQuery, useAuthQuery, useLoginByAppleLazyQuery } from '../../schema/generated';
import { usePostAuth } from '../../hooks/auth';
import SigninWithApple from '../../components/signinWithApple/signinWithApple';
import { AndroidSigninResponse, AppleRequestResponse } from '@invertase/react-native-apple-authentication';
import { Link, useLinkTo } from '@react-navigation/native';
import { RouteKeys, RouteParamList } from '../../routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthV3PageProps = NativeStackScreenProps<RouteParamList, 'empty'>

function AuthV3Page(props: AuthV3PageProps) {
  useEffect(() => {
    props.navigation.setOptions({
      title: 'Account'
    })
  }, [props])

  const [doAppleAuth, appleAuthResp] = useLoginByAppleLazyQuery()
  const toast = useToast()

  const onPostAuth = usePostAuth()
  const linkTo = useLinkTo<RouteParamList>()
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
      linkTo({
        screen: RouteKeys.AuthAppleBind,
        params: {
          idToken: data.idToken
        }
      })
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

  return (
    <View bgColor='gray.100' _dark={{ bgColor: 'gray.900' }}>
      <SafeAreaView>
        <View alignItems='center' justifyContent='center' height='100%'>
          <SigninWithApple
            loading={appleAuthResp.loading}
            onSuccess={signinWithAppleOnSuccess}
            onError={signinWithAppleOnError}
          />
          <Divider my={8} />
          <Button>
            <Link to={{ screen: RouteKeys.AuthQRCode }}>
              Login by Scan QRcode
            </Link>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default AuthV3Page