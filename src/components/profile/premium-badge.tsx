import { Text } from 'native-base'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

type PremiumBadgeProps = {
  style?: StyleProp<ViewStyle>
}

function PremiumBadge(props: PremiumBadgeProps) {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      colors={['rgb(59, 91, 219)', 'rgb(12, 133, 153)']}
      style={[
        {
          paddingLeft: 8,
          paddingRight: 8,
          borderRadius: 4,
        },
        props.style
      ]}
    >
      <Text fontSize={10}>PREMIUM</Text>
    </LinearGradient>
  )
}

export default PremiumBadge