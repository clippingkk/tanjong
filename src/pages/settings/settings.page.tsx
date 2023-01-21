import { Button, Center, Pressable, Text, Toast, View, VStack } from 'native-base'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLinkTo, useNavigation } from '@react-navigation/native'
import { RouteKeys } from '../../routes'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useApolloClient } from '@apollo/client'
import { useAtom, useSetAtom } from 'jotai'
import { tokenAtom, uidAtom } from '../../atomic'
import { updateLocalToken } from '../../utils/apollo'

type SettingsPageProps = {
}

function SettingsPage(props: SettingsPageProps) {
  const hh = useHeaderHeight()
  const bh = useBottomTabBarHeight()
  const linkTo = useLinkTo()

  const [count, setCount] = useState(0)
  const timer = useRef<number | null>(null)

  const onDebugClick = useCallback(() => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        timer.current = null
      }, 10000)
    }
    setCount(c => c + 1)
  }, [])

  const client = useApolloClient()
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)

  const onLogout = useCallback(() => {
    setToken(null)
    setUid(null)
    updateLocalToken(null)
    client.resetStore()
    Toast.show({
      title: 'logged out'
    })
  }, [client])

  useEffect(() => {
    if (count < 10) {
      return
    }
    timer.current = null
    setCount(0)
    linkTo('/' + RouteKeys.ProfileDebug)
  }, [count])

  return (
    <View paddingTop={hh} paddingBottom={bh + 20} flex={1} bg='gray.100' _dark={{ bg: 'gray.900' }}>
      <VStack
        paddingLeft={4}
        paddingRight={4}
        marginTop={8}
        paddingTop={4}
        paddingBottom={4}
        background='amber.100'
        _dark={{
          background: 'amber.900'
        }}
      >
        <Pressable onPress={onDebugClick}>
          <Text color='gray.900' _dark={{ color: 'amber.100' }}>created by @AnnatarHe</Text>
        </Pressable>
      </VStack>
      <View flex={1} />
      <Button bg='red.500' mx={4} onPress={onLogout}>
        <Text color='white'>Logout</Text>
      </Button>
    </View>
  )
}

export default SettingsPage