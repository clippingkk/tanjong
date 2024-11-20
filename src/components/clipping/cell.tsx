import { Link } from '@react-navigation/native'
import { Text, View } from 'native-base'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { RouteKeys } from '../../routes'
import { Clipping } from '../../schema/generated'
import { FontLXGW } from '../../styles/font'

type ClippingCellProps = {
  clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
}

function ClippingCell(props: ClippingCellProps) {
  const width = useMemo(() => {
    return Dimensions.get('screen').width - 8 * 2
  }, [])
  return (
    <View
      paddingX={2}
    >
      <Link
        screen={RouteKeys.Clipping}
        params={{
          clipping: props.clipping
        }}
        style={{
          width: '100%'
        }}
      >
        <View
          backgroundColor={'blue.300'}
          _dark={{ backgroundColor: 'blue.900' }}
          borderRadius={8}
          shadow={4}
          padding={4}
          width={width}
        >
          <Text
            fontFamily={FontLXGW}
          >
            {props.clipping.content}
          </Text>
        </View>
      </Link>
    </View>
  )
}

export default ClippingCell