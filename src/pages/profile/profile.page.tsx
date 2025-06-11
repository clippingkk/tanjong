import {
  BottomTabScreenProps,
  useBottomTabBarHeight
} from '@react-navigation/bottom-tabs'
import {useHeaderHeight} from '@react-navigation/elements'
import {Link, useNavigation} from '@react-navigation/native'
import {FlashList} from '@shopify/flash-list'
import {useAtomValue} from 'jotai'
import React, {useCallback, useEffect, useState} from 'react'
import {uidAtom} from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import ClippingCell from '../../components/clipping/cell'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import BasicBoard from '../../components/profile/basic-board'
import {useClippingCellAvgHeight} from '../../hooks/clipping'
import {RouteKeys, TabRouteParamList} from '../../routes'
import {useProfileQuery} from '../../schema/generated'
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView
} from 'react-native'
import ProfilePageSkeleton from './skeleton'
import LinearGradient from 'react-native-linear-gradient'
import {BlurView} from '@react-native-community/blur'

const lightColors = {
  gradient: ['#FFDAB9', '#FFA07A'],
  blur: 'light'
}

const darkColors = {
  gradient: ['#483D8B', '#8A2BE2'],
  blur: 'dark'
}

function ProfilePage() {
  const navigation = useNavigation()
  const isDarkMode = useColorScheme() === 'dark'
  const colors = isDarkMode ? darkColors : lightColors
  const uid = useAtomValue(uidAtom)
  const hh = useHeaderHeight()

  const p = useProfileQuery({
    variables: {
      id: uid!,
      pagination: {
        recents: {
          lastId: 1 << 30,
          limit: 10
        }
      }
    },
    skip: !uid
  })
  useEffect(() => {
    navigation.setOptions({
      title: p.data?.me.name ?? 'Profile',
      headerRight: () => (
        <View className="flex-row mr-4 items-center">
          <Link screen={RouteKeys.ProfileSettings}>⚙️</Link>
        </View>
      )
    })
  }, [navigation, p.data?.me.name])

  const itemSizeCellHeight = useClippingCellAvgHeight(p.data?.me.recents ?? [])
  const bh = useBottomTabBarHeight()

  const [atEnd, setAtEnd] = useState(false)

  const onReachedEnd = useCallback(() => {
    if (atEnd) {
      return
    }
    const rcs = p.data?.me.recents
    if (!rcs || rcs.length === 0) {
      return
    }
    const last = rcs[rcs.length - 1]
    return p
      .fetchMore({
        variables: {
          id: uid,
          pagination: {
            recents: {
              lastId: last.id,
              limit: 10
            }
          }
        }
      })
      .then(res => {
        if (res.data.me.recents.length < 10) {
          setAtEnd(true)
        }
      })
  }, [uid, p.data?.me.recents.length, atEnd])

  if (!uid) {
    return <AuthGuard />
  }

  if (p.error) {
    return (
      <ErrorBox
        err={p.error}
        onRefresh={() =>
          p.refetch({
            id: uid!,
            pagination: {
              recents: {
                lastId: 1 << 30,
                limit: 10
              }
            }
          })
        }
      />
    )
  }

  if (p.loading) {
    return (
      <LinearGradient colors={colors.gradient} style={styles.flexOne}>
        <BlurView
          style={styles.flexOne}
          blurType={colors.blur as any}
          blurAmount={10}
        />
        <ProfilePageSkeleton />
      </LinearGradient>
    )
  }

  if ((p.data?.me.recents.length ?? 0) === 0) {
    return <EmptyBox />
  }

  return (
    <LinearGradient colors={colors.gradient} style={styles.flexOne}>
      <SafeAreaView style={styles.flexOne}>
        <FlashList
          contentContainerStyle={styles.listContent}
          onRefresh={p.refetch}
          refreshing={p.loading}
          ListHeaderComponent={<BasicBoard profile={p.data?.me} />}
          data={p.data?.me.recents ?? []}
          renderItem={({item}) => <ClippingCell clipping={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{height: bh + 16}} />}
          estimatedItemSize={itemSizeCellHeight}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  flexOne: {flex: 1},
  listContent: {
    paddingHorizontal: 16
  },
  separator: {
    height: 16
  }
})

export default ProfilePage
