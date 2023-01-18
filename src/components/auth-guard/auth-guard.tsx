import { Link } from '@react-navigation/native'
import { Text, View } from 'native-base'
import React from 'react'
import { RouteKeys } from '../../routes'
import Page from '../page'

type AuthGuardProps = {
}

function AuthGuard(props: AuthGuardProps) {
  return (
    <Page containerProps={{ flex: 1, justifyItems: 'center', justifyContent: 'center' }}>
      <Link
        to={{
          screen: RouteKeys.AuthQRCode
        }}
        style={{
          width: '100%', textAlign: 'center'
        }}
      >
        <Text color='gray.100'>
          Go to Auth
        </Text>
      </Link>
    </Page>
  )
}

export default AuthGuard