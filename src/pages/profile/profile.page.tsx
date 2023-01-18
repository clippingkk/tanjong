import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Link, useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Text, View } from 'native-base'
import React, { useEffect, useMemo } from 'react'
import { Dimensions } from 'react-native'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import ClippingCell from '../../components/clipping/cell'
import ErrorBox from '../../components/errorbox/errorbox'
import LoadingBox from '../../components/loading/loading'
import BasicBoard from '../../components/profile/basic-board'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { RouteKeys } from '../../routes'
import { Clipping, useProfileQuery } from '../../schema/generated'

type ProfilePageProps = {
}

function ProfilePage(props: ProfilePageProps) {
  const nav = useNavigation()
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <Link to={{ screen: RouteKeys.ProfileSettings }}>
          ⚙️
        </Link>
      )
    })
  }, [])
  const uid = useAtomValue(uidAtom)

  const p = useProfileQuery({
    variables: {
      id: uid!
    },
    skip: !uid
  })

  const itemSizeCellHeight = useClippingCellAvgHeight(p.data?.me.recents ?? [])
  const bh = useBottomTabBarHeight()

  if (!uid) {
    return (
      <AuthGuard />
    )
  }

  if (p.error) {
    return (
      <ErrorBox err={p.error} onRefresh={p.refetch} />
    )
  }

  if (p.loading) {
    return (
      <LoadingBox />
    )
  }

  return (
    <View
      backgroundColor='gray.100'
      _dark={{ backgroundColor: 'gray.900' }}
      width='100%'
      height='100%'
    >
      <FlashList
        onRefresh={p.refetch}
        refreshing={p.loading}
        ListHeaderComponent={(<BasicBoard profile={p.data?.me} />)}
        data={p.data?.me.recents ?? []}
        renderItem={({ item }) => <ClippingCell clipping={item} />}
        ItemSeparatorComponent={() => (
          <View paddingTop={1} paddingBottom={1} width='100%' height={1} />
        )}
        ListFooterComponent={(
          <View width='100%' height={bh + 16} />
        )}
        estimatedItemSize={itemSizeCellHeight}
      />
    </View>
  )
}

export default ProfilePage