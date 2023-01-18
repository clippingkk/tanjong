import { Link } from '@react-navigation/native'
import { Text, View } from 'native-base'
import React from 'react'
import { RouteKeys } from '../../routes'
import { Clipping } from '../../schema/generated'
import { FontLXGW } from '../../styles/font'

type ClippingCellProps = {
  clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
}

function ClippingCell(props: ClippingCellProps) {
  return (
    <View
      marginLeft={2}
      marginRight={2}
    >
      <Link to={{
        screen: RouteKeys.Clipping,
        params: {
          clipping: props.clipping
        }
      }}>
        <View
          backgroundColor={'amber.300'}
          _dark={{ backgroundColor: 'amber.900' }}
          borderRadius={3}
          shadow='4'
          padding='4'
        >
          <Text
            fontFamily={FontLXGW}
          >{props.clipping.content}</Text>
        </View>
      </Link>
    </View>
  )
}

export default ClippingCell