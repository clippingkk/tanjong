import { Text, View } from 'native-base'
import React from 'react'
import { Clipping } from '../../schema/generated'

type ClippingCellProps = {
  clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
}

function ClippingCell(props: ClippingCellProps) {
  return (
    <View>
      <Text>{props.clipping.content}</Text>
    </View>
  )
}

export default ClippingCell