import { View } from '@gluestack-ui/themed'
import React from 'react'
import { useWindowDimensions } from 'react-native'


type PageProps = {
  children: React.ReactElement
  containerProps?: any
}

function Page(props: PageProps) {
  const { height } = useWindowDimensions()
  return (
    <View
      backgroundColor='$blueGray100'
      sx={{
        _dark: {
          backgroundColor: '$blueGray900'
        }
      }}
      minHeight={height}
      {...(props.containerProps ?? {})}
    >
      {props.children}
    </View>
  )
}

export default Page