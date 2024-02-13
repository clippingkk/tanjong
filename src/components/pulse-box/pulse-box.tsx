import { useColorMode } from '@gluestack-style/react'
import React, { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring } from 'react-native-reanimated'

type PulseBoxProps = {
  height: number
  width: number
  radius: number
  marginLeft?: number
}

function PulseBox(props: PulseBoxProps) {
  const { height, width, marginLeft = 0, radius } = props
  const opacity = useSharedValue(0.4)

  useEffect(() => {
    opacity.value = withRepeat(withSpring(1, { duration: 1000 }), -1, true)
  }, [])
  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  const c = useColorMode()

  const baseBgColor = useMemo(() => {
    return c === 'light' ? 'rgb(203, 213, 225)' : 'rgb(51, 65, 85)'
  }, [c])

  return (
    <Animated.View
      style={
        [
          {
            height,
            width,
            borderRadius: radius,
            backgroundColor: baseBgColor,
            marginLeft
          },
          style
        ]
      }
    />
  )
}

export default PulseBox