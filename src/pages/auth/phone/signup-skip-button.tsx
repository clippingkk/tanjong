import { HeaderButtonProps } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Pressable, Text, Toast } from 'native-base'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { usePostAuth } from '../../../hooks/auth'
import { RouteParamList } from '../../../routes'
import { AppleLoginPlatforms, useBindAppleUniqueMutation } from '../../../schema/generated'

type SignupSkipButtonProps = Omit<HeaderButtonProps, 'children'> & { idToken: string, navigation: NativeStackNavigationProp<RouteParamList, any, undefined> }

function SignupSkipButton(props: SignupSkipButtonProps) {
  const { t } = useTranslation()
  const requestPayload = useMemo(() => {
    return {
      code: '',
      idToken: props.idToken,
      state: '',
      platform: Platform.OS === 'ios' ? AppleLoginPlatforms.IOs : AppleLoginPlatforms.Android
    }
  }, [props.idToken])

  const [doBind, doBindResult] = useBindAppleUniqueMutation()
  const onPostAuth = usePostAuth(props.navigation)

  const onSkip = useCallback(async () => {
    try {
      const res = await doBind({
        variables: {
          payload: requestPayload
        }
      })
      const rs = res.data?.bindAppleUnique
      if (!rs) {
        return
      }
      return onPostAuth(rs.token, rs.user.id)
    } catch (err: any) {
      Toast.show({
        title: err.toString()
      })
    }
  }, [requestPayload])
  return (
    <Button
      variant='ghost'
      isLoading={doBindResult.loading}
      onPress={onSkip}
    >
      <Text>{t('app.common.skip')}</Text>
    </Button>
  )
}

export default SignupSkipButton