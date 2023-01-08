import { useAtomValue } from 'jotai'
import { Text, View } from 'native-base'
import React from 'react'
import { uidAtom } from '../../atomic'
import { useBooksQuery } from '../../schema/generated'

type HomePageProps = {
}

function HomePage(props: HomePageProps) {

  const uid = useAtomValue(uidAtom)

  useBooksQuery({
    variables: {
      id: uid!,
      pagination: {
        limit: 6,
        offset: 0
      }
    },
    skip: !!uid
  })

  return (
    <View>
      <Text>
        AuthQRCodePage
      </Text>
    </View>
  )
}

export default HomePage