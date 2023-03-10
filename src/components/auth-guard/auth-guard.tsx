import { Link } from '@react-navigation/native'
import { Center, Text, View } from 'native-base'
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
      <View flex={1} alignItems='center' justifyContent='center' width='100%'>
        <Text textAlign='center' width='100%' fontSize={48}>
          ⛔
        </Text>
        <Link
          to={{
            screen: RouteKeys.AuthV3
          }}
          style={{
            width: '100%', textAlign: 'center'
          }}
        >
          <Text color='gray.900' _dark={{ color: 'gray.100' }}>
            {t('app.auth.loginFullTip')}
          </Text>
        </Link>
      </View>
    </Page>
  )
}

export default AuthGuard