import { Link, useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Text, View } from 'native-base'
import React, { useEffect } from 'react'
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
      ListHeaderComponent={() => (<BasicBoard profile={p.data?.me} />)}
      data={p.data?.me.recents ?? []}
      renderItem={({ item }) => <ClippingCell clipping={item} />}
      estimatedItemSize={200}
    />
  )
}

export default ProfilePage