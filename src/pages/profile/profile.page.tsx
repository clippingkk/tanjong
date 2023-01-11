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
import { RouteKeys } from '../../routes'
import { useProfileQuery } from '../../schema/generated'

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

  const itemSizeCellHeight = useMemo(() => {
    const recents = p.data?.me.recents
    if (!recents) {
      return 10
    }
    const screenWidth = Dimensions.get('screen').width

    const availableWidth = screenWidth - 16 * 2 - 8 * 2

    const textsInOneLine = availableWidth / 14

    const lines = recents.reduce((acc, cur) => {
      const ls = cur.content.length / textsInOneLine
      acc += ls
      return acc
    }, 0)

    const avgLines = lines / recents.length

    // 行数 * line-height * font-size + paddingTop + paddingBottom
    const cellHeight = avgLines * 1.2 * 14 + 16 * 2
    return cellHeight
  }, [p.data?.me.recents])

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
  )
}

export default ProfilePage