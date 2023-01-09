import { useHeaderHeight } from '@react-navigation/elements'
import { useAtom } from 'jotai'
import { Divider, Input, Text, View } from 'native-base'
import React from 'react'
import { tokenAtom, uidAtom } from '../../atomic'

type DebugPageProps = {
}

function DebugPage(props: DebugPageProps) {
  const [token, setToken] = useAtom(tokenAtom)
  const [uid, setUid] = useAtom(uidAtom)
  const hh = useHeaderHeight()

  return (
    <View marginTop={hh}>
      <View marginTop={4}>
        <Input
          placeholder='token'
          value={token ?? ''}
          onChangeText={v => setToken(v)}
        />
        <Input
        marginTop={4}
          placeholder='uid'
          value={uid?.toString()}
          keyboardType='numeric'
          onChangeText={v => setUid(~~v)}
        />
      </View>
    </View>
  )
}

export default DebugPage