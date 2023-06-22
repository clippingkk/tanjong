import { NativeStackScreenProps } from '@react-navigation/native-stack'
import jwtDecode from 'jwt-decode'
import { Text } from 'native-base'
import React from 'react'
import { RouteParamList } from '../../routes'

type AuthQRCodePageProps = NativeStackScreenProps<RouteParamList, 'AuthQRCode'>

function AuthQRCodePage(props: AuthQRCodePageProps) {
  return (
    <>
    <Text>Work in progress</Text>
    </>
  )
}

export default AuthQRCodePage