import { View } from 'native-base'
import React from 'react'
import { ActivityIndicator } from 'react-native'

type LoadingBoxProps = {
}

function LoadingBox(props: LoadingBoxProps) {
  return (
    <View>
      <ActivityIndicator />
    </View>
  )
}

export default LoadingBox