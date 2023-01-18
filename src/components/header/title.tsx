import { View, Text } from 'native-base'
import React from 'react'

type HeaderTitleProps = {
  title: string
}

function HeaderTitle(props: HeaderTitleProps) {
  return (
    <View>
      <Text>{props.title}</Text>
    </View>
  )
}

export default HeaderTitle