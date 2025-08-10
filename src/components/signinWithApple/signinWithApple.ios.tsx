import React, { useCallback } from 'react'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import { SigninWithAppleProps } from './type';
import { View, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <AppleButton
        style={styles.appleButton}
        buttonStyle={AppleButton.Style.WHITE_OUTLINE}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={onAppleButtonPress}
      />
      {props.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  appleButton: {
    height: 52,
    width: 220,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SigninWithApple