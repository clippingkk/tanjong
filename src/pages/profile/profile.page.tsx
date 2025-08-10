import {
  BottomTabScreenProps,
  useBottomTabBarHeight
} from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { Link, useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import ClippingCell from '../../components/clipping/cell'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import BasicBoard from '../../components/profile/basic-board'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { RouteKeys, TabRouteParamList } from '../../routes'
import { useProfileQuery } from '../../schema/generated'
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import ProfilePageSkeleton from './skeleton'
import { GradientBackground } from '../../components/ui'
import { FontLXGW } from '../../styles/font'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function ProfilePage() {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const uid = useAtomValue(uidAtom)
  const hh = useHeaderHeight()
  const insets = useSafeAreaInsets()

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
        <TouchableOpacity
          onPress={() => (navigation as any).navigate(RouteKeys.ProfileSettings)}
          style={styles.settingsButton}
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
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
      <GradientBackground blur>
        <ProfilePageSkeleton />
      </GradientBackground>
    )
  }

  if ((p.data?.me.recents.length ?? 0) === 0) {
    return <EmptyBox />
  }

  return (
    <GradientBackground>
      <View style={styles.flexOne}>
        <FlashList
          contentContainerStyle={{
            ...styles.listContent,
            paddingTop: hh
          }}
          refreshControl={
            <RefreshControl
              refreshing={p.loading}
              onRefresh={p.refetch}
              tintColor={isDarkMode ? '#818CF8' : '#6366F1'}
            />
          }
          ListHeaderComponent={
            <View>
              <BasicBoard profile={p.data?.me} stats={{
                books: p.data?.me.booksCount,
                clippings: p.data?.me.clippingsCount,
                recent: p.data?.me.recent3mReadings.length,
              }} />
              <View style={[styles.sectionHeaderCard, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)' }]}>
                <View style={styles.sectionHeaderContent}>
                  <View style={[styles.sectionIcon, { backgroundColor: isDarkMode ? '#6366F1' : '#818CF8' }]}>
                    <Text style={styles.sectionIconText}>📝</Text>
                  </View>
                  <View style={styles.sectionTextContainer}>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#E0E7FF' : '#1E293B' }]}>Recent Activity</Text>
                    <Text style={[styles.sectionSubtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{p.data?.me.recents?.length ?? 0} recent highlights</Text>
                  </View>
                </View>
              </View>
            </View>
          }
          data={p.data?.me.recents ?? []}
          renderItem={({ item }) => (
            <View style={styles.clippingWrapper}>
              <ClippingCell clipping={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: bh + insets.bottom + 16 }} />}
          estimatedItemSize={itemSizeCellHeight}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
        />
      </View>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  listContent: {
    paddingHorizontal: 20
  },
  separator: {
    height: 16
  },
  settingsButton: {
    marginRight: 16,
    padding: 8
  },
  clippingWrapper: {
    marginVertical: 4
  },
  sectionHeaderCard: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sectionIconText: {
    fontSize: 20,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.7,
  }
})

export default ProfilePage
