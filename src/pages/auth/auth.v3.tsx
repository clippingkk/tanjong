import { Button, Center, FormControl, Input, KeyboardAvoidingView, Text, useToast, View, VStack } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import React, { useCallback, useEffect } from 'react'
import { Platform, SafeAreaView } from 'react-native';
import { AppleVerifyPayload, useAuthLazyQuery, useAuthQuery, useLoginByAppleLazyQuery } from '../../schema/generated';
import { usePostAuth } from '../../hooks/auth';
import SigninWithApple from '../../components/signinWithApple/signinWithApple';
import { AndroidSigninResponse, AppleRequestResponse } from '@invertase/react-native-apple-authentication';

type AuthV3PageProps = {
}

function AuthV3Page(props: AuthV3PageProps) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [doAppleAuth, appleAuthResp] = useLoginByAppleLazyQuery()
  const toast = useToast()

  const onPostAuth = usePostAuth()
  const signinWithAppleOnSuccess = useCallback(async (data: AppleVerifyPayload) => {
    const authResp = await doAppleAuth({
      variables: {
        payload: data
      }
    })
    if (!authResp.data) {
      toast.show({
        title: 'no data info'
      })
      return
    }

    const { noAccountFrom3rdPart, token, user } = authResp.data.loginByApple

    if (noAccountFrom3rdPart) {
      toast.show({
        title: 'TODO: will go to bind'
      })
      // TODO: will go to bind existing account
      return
    }
    // goto auth
    return onPostAuth(token, user.id)
  }, [])
  const signinWithAppleOnError = useCallback((err: any) => {
    console.log('err', err)
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
        </View>
      </SafeAreaView>
    </View>
  )
}

export default AuthV3Page