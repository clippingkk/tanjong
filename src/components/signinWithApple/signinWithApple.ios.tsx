import React, { useCallback } from 'react'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import { SigninWithAppleProps } from './type';
import { View } from 'native-base';
import { AppleLoginPlatforms } from '../../schema/generated';
import { ActivityIndicator } from 'react-native';

function SigninWithApple(props: SigninWithAppleProps) {
  const onAppleButtonPress = useCallback(async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      // use credentialState response to ensure the user is authenticated
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        if (props.onError) {
          props.onError()
        }
        return
      }

      if (!appleAuthRequestResponse) {
        if (props.onError) {
          props.onError()
        }
        return
      }
      props.onSuccess({
        code: appleAuthRequestResponse.authorizationCode!,
        idToken: appleAuthRequestResponse.identityToken!,
        state: appleAuthRequestResponse.state ?? 'state',
        platform: AppleLoginPlatforms.IOs
      })
    } catch (e) {
      if (props.onError) {
        props.onError(e)
      }
    }

  }, [props.onError, props.onSuccess])

  return (
    <View>
      <AppleButton
        style={{
          height: 45,
          width: 180
        }}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={onAppleButtonPress}
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