import React from 'react'
import SignUpLayout from './layout'
import { View } from '@gluestack-ui/themed'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteKeys, RouteParamList } from '../../routes'

type SignUpSetNamePageProps = NativeStackScreenProps<RouteParamList, RouteKeys.SignUpSetName>

function SignUpSetNamePage(props: SignUpSetNamePageProps) {
  return (
    <SignUpLayout title='Name'>
      <View></View>
    </SignUpLayout>
  )
}

export default SignUpSetNamePage