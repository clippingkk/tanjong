import React from 'react'
import { SafeAreaView } from 'react-native'
import Page from '../../components/page'
import { Text, View } from '@gluestack-ui/themed'

type SignUpLayoutProps = {
  title: string
  children: React.ReactNode
}

function SignUpLayout(props: SignUpLayoutProps) {
  const { title, children } = props
  return (
    <Page>
      <SafeAreaView>
        <View p={'$3'}>
          <Text>{title}</Text>
          {children}
        </View>
      </SafeAreaView>
    </Page>
  )
}

export default SignUpLayout