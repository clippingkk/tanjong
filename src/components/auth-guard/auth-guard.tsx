import { Link } from '@react-navigation/native'
import { Text, View } from 'native-base'
import React from 'react'
import { RouteKeys } from '../../routes'

type AuthGuardProps = {
}

function AuthGuard(props: AuthGuardProps) {
  return (
    <View flex={1} alignItems='center' justifyContent='center'>
      <Link
        to={{
          screen: RouteKeys.AuthQRCode
        }}
      >
        Go to Auth
      </Link>
    </View>
  )
}

export default AuthGuard