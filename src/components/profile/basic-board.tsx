import { View } from 'native-base'
import React from 'react'
import { Text } from 'react-native-svg'
import { User } from '../../schema/generated'

type BasicBoardProps = {
  profile?: Pick<User, 'id' | 'name' | 'avatar' | 'bio'>
}

function BasicBoard(props: BasicBoardProps) {
  if (!props.profile) {
    return null
  }
  return (
    <View>
      <Text>{props.profile.name}</Text>
    </View>
  )
}

export default BasicBoard