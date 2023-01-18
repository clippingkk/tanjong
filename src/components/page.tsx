import { View } from 'native-base'
import { InterfaceViewProps } from 'native-base/lib/typescript/components/basic/View/types'
import React from 'react'

type PageProps = {
  children: React.ReactElement
  containerProps?: InterfaceViewProps
}

function Page(props: PageProps) {
  return (
    <View
      backgroundColor='gray.100'
      _dark={{ backgroundColor: 'gray.900' }}
      width='100%'
      height='100%'
      {...(props.containerProps ?? {})}
    >
      {props.children}
    </View>
  )
}

export default Page