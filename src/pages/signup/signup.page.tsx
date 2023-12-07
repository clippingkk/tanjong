import React from 'react'
import Page from '../../components/page'
import { View } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native'
import { useMachine } from '@xstate/react'
import signupMachine from './machine'

type SignupPageProps = {
}

function SignupPage(props: SignupPageProps) {
  const [m, send] = useMachine(signupMachine)
  return (
    <Page>
      <SafeAreaView>
        <View height='100%'></View>
      </SafeAreaView>
    </Page>
  )
}

export default SignupPage