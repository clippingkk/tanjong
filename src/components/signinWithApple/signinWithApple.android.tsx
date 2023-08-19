import React, { useCallback } from 'react'
import { AppleButton, appleAuthAndroid, appleAuth } from '@invertase/react-native-apple-authentication'
import { SigninWithAppleProps } from './type';
import { Text, View } from 'native-base';
import { AppleLoginPlatforms } from '../../schema/generated';
import { ActivityIndicator } from 'react-native';

function SigninWithApple(props: SigninWithAppleProps) {
  const onAppleButtonPress = useCallback(async () => {
    // Configure the request
    appleAuthAndroid.configure({
      clientId: 'com.annatarhe.clippingkk',
      redirectUri: 'https://clippingkk.annatarhe.com/auth/auth-v2',
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      state: 'state',
    });
    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();
    // Send the authorization code to your backend for verification
    if (!response) {
      if (props.onError) {
        props.onError()
      }
      return
    }
    props.onSuccess({
      code: response.code!,
      idToken: response.id_token!,
      state: response.state ?? 'state',
      platform: AppleLoginPlatforms.Android
    })
  }, [props.onError, props.onSuccess])

  if (!appleAuthAndroid.isSupported) {
    return (
      <View alignContent='center'>
        <Text>Unsupported</Text>
      </View>
    )
  }

  return (
    <View>
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={onAppleButtonPress}
        style={{
          height: 45,
          width: 180
        }}
      />
      {props.loading ? (
        <View position='absolute' top={0} left={0} bottom={0} right={0} justifyContent='center' alignItems='center' background='rgba(255,255,255, 0.8)'>
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  )
}

export default SigninWithApple