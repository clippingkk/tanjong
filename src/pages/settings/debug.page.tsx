import { useHeaderHeight } from '@react-navigation/elements'
import { Link, StackActions, useNavigation } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { Button, Divider, Input, Text, View } from 'native-base'
import React, { useEffect } from 'react'
import { tokenAtom, uidAtom } from '../../atomic'
import { RouteKeys } from '../../routes'
import { updateLocalToken } from '../../utils/apollo'
import { useApolloClient } from '@apollo/client'

type DebugPageProps = {
}

function DebugPage(props: DebugPageProps) {
  const [token, setToken] = useAtom(tokenAtom)
  const [uid, setUid] = useAtom(uidAtom)
  const hh = useHeaderHeight()
  const nav = useNavigation()

  const ac = useApolloClient()

  useEffect(() => {
    updateLocalToken(token)
    setTimeout(() => {
      ac.resetStore()
    }, 100)
  }, [token])

  return (
    <View
      marginTop={hh}
      backgroundColor='gray.100'
      _dark={{ backgroundColor: 'gray.900' }}
      width='100%'
      height='100%'
    >
      <View marginTop={4}>
        <Input
          placeholder='token'
          value={token ?? ''}
          onChangeText={v => setToken(v)}
        />
        <Input
          marginTop={4}
          placeholder='uid'
          value={uid?.toString()}
          keyboardType='numeric'
          onChangeText={v => setUid(~~v)}
        />
      </View>
      <View p={2}>
        <Link screen={RouteKeys.AuthAppleBind} params={{ idToken: 'hello-debug' }}>
          <Text>
            Apple Bind Page
          </Text>
        </Link>
      </View>
      <View p={2}>
        <Button onPress={() => {
          nav.dispatch(StackActions.popToTop())
        }}>
          Back To Top
        </Button>
      </View>
    </View>
  )
}

export default DebugPage