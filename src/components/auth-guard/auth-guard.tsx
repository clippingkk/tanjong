import { Link } from '@react-navigation/native'
import { Text, View } from '@gluestack-ui/themed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteKeys } from '../../routes'
import Page from '../page'

type AuthGuardProps = {
}

function AuthGuard(props: AuthGuardProps) {
  const { t } = useTranslation()
  return (
    <Page containerProps={{ flex: 1, justifyContent: 'center', justifyItems: 'center' }}>
      <Link
        screen={RouteKeys.AuthV3}
      >
        <View flex={1} alignItems='center' height={'100%'} justifyContent={'center'}>
          <Text textAlign='center' width='100%' fontSize={'$7xl'} lineHeight={'$7xl'}>
            ⛔
          </Text>
          <View padding={'$4'}>
            <Text
              color='$blueGray900'
              textAlign='center'
              sx={{ _dark: { color: '$blueGray100' } }}
            >
              {t('app.auth.loginFullTip')}
            </Text>
          </View>
        </View>
      </Link>
    </Page >
  )
}

export default AuthGuard