import { Center, Pressable, Text, View, VStack } from 'native-base'
import { useHeaderHeight } from '@react-navigation/elements'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLinkTo, useNavigation } from '@react-navigation/native'
import { RouteKeys } from '../../routes'

type SettingsPageProps = {
}

function SettingsPage(props: SettingsPageProps) {
  const hh = useHeaderHeight()
  const linkTo = useLinkTo()

  const [count, setCount] = useState(0)
  const timer = useRef<number | null>(null)

  const onDebugClick = useCallback(() => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        timer.current = null
      }, 10_000)
    }
    setCount(c => c+1)
  }, [])

  useEffect(() => {
    if (count < 10) {
      return
    }
    timer.current = null
    setCount(0)
    linkTo('/' + RouteKeys.ProfileDebug)
  }, [count])

  return (
    <View marginTop={hh} flex={1}>
      <VStack
        paddingLeft={4}
        paddingRight={4}
        marginTop={8}
        paddingTop={4}
        paddingBottom={4}
        background='amber.100'
      >
        <Pressable onPress={onDebugClick}>
          <Text>created by @AnnatarHe</Text>
        </Pressable>
      </VStack>
    </View>
  )
}

export default SettingsPage