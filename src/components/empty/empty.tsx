import { Text, View } from 'native-base'
import React from 'react'

type EmptyBoxProps = {
}

function EmptyBox(props: EmptyBoxProps) {
  return (
    <View flex={1} justifyContent='center' bg='gray.200' _dark={{ bg: 'gray.800' }}>
      <Text textAlign='center' fontSize='6xl'>
        😔
      </Text>
      <Text textAlign='center' p={2}>
        Sorry, you havn't had any data, please upload your clippings in website, and try me later
      </Text>
    </View>

  )
}

export default EmptyBox