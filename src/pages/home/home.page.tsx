import { useBottomTabBarHeight } from 'react-native-bottom-tabs'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { View } from '@gluestack-ui/themed'
import React, { useCallback, useMemo, useState } from 'react'
import { useColorScheme, StyleSheet, Text, RefreshControl, Platform } from 'react-native'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
import BookHero from '../../components/book/hero'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import { useBooksQuery } from '../../schema/generated'
import { useHomeLoad } from '../../hooks/init'
import HomePageSkeleton from './skeleton'
import { GradientBackground } from '../../components/ui'
import { FontLXGW } from '../../styles/font'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/elements'

type HomePageProps = {}

function HomePage(props: HomePageProps) {
  const uid = useAtomValue(uidAtom)
  useHomeLoad()

  const bs = useBooksQuery({
    variables: {
      id: uid!,
      pagination: {
        limit: 10,
        offset: 0,
      },
    },
    skip: !uid,
  })

  const [atEnd, setAtEnd] = useState(false)

  const onReachedEnd = useCallback(() => {
    if (atEnd) {
      return
    }
    if (!uid) {
      return
    }
    const allLength = bs.data?.books.length ?? 0
    return bs
      .fetchMore({
        variables: {
          id: uid,
          pagination: {
            limit: 10,
            offset: allLength,
          },
        },
      })
      .then((res) => {
        if (res.data.books.length < 10) {
          setAtEnd(true)
        }
      })
  }, [uid, bs.data?.books.length, atEnd])

  const bh = useBottomTabBarHeight();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const theReadingBook = useMemo(() => {
    const lbs = bs.data?.books ?? []
    if (lbs.length === 0) {
      return null
    }
    return lbs[0].doubanId
  }, [bs.data?.books])

  const listedBook = useMemo(() => {
    let lbs = [...(bs.data?.books ?? [])]

    if (theReadingBook) {
      lbs = lbs.filter((x) => x.doubanId !== theReadingBook)
    }

    return lbs
  }, [bs.data?.books, theReadingBook])

  if (!uid) {
    return <AuthGuard />
  }

  if (bs.error) {
    return (
      <ErrorBox
        err={bs.error}
        onRefresh={() =>
          bs.refetch({
            id: uid,
            pagination: {
              limit: 10,
              offset: 0,
            },
          })
        }
      />
    )
  }

  if (bs.loading) {
    return (
      <GradientBackground blur>
        <HomePageSkeleton />
      </GradientBackground>
    )
  }
  if ((bs.data?.books.length ?? 0) === 0) {
    return <EmptyBox />
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flexOne}>
        <FlashList
          contentContainerStyle={{
            ...styles.listContent,
            paddingTop: headerHeight
          }}
          ListHeaderComponent={() => (
            <View>
              {/* Currently Reading Section */}
              <View style={[styles.sectionHeaderCard, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)' }]}>
                <View style={styles.sectionHeaderContent}>
                  <View style={[styles.sectionIcon, { backgroundColor: isDarkMode ? '#6366F1' : '#818CF8' }]}>
                    <Text style={styles.sectionIconText}>📚</Text>
                  </View>
                  <View style={styles.sectionTextContainer}>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#E0E7FF' : '#1E293B' }]}>Currently Reading</Text>
                    <Text style={[styles.sectionSubtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{bs.data?.books.length ?? 0} books in progress</Text>
                  </View>
                </View>
              </View>
              {theReadingBook && (
                <View style={styles.heroContainer}>
                  <BookHero bookDoubanID={theReadingBook} />
                </View>
              )}
              {listedBook.length > 0 && (
                <View style={[styles.sectionHeaderCard, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)' }]}>
                  <View style={styles.sectionHeaderContent}>
                    <View style={[styles.sectionIcon, { backgroundColor: isDarkMode ? '#6366F1' : '#818CF8' }]}>
                      <Text style={styles.sectionIconText}>📖</Text>
                    </View>
                    <View style={styles.sectionTextContainer}>
                      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#E0E7FF' : '#1E293B' }]}>Your Library</Text>
                      <Text style={[styles.sectionSubtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{listedBook.length} books collected</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={bs.loading}
              onRefresh={() => bs.refetch()}
              tintColor={isDarkMode ? '#818CF8' : '#6366F1'}
            />
          }
          numColumns={2}
          data={listedBook}
          renderItem={({ item }) => (
            <View style={styles.bookCellWrapper}>
              <BookCell bookDoubanID={item.doubanId} />
            </View>
          )}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
          ListFooterComponent={<View style={{ height: bh + insets.bottom + 16 }} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  listContent: {
    paddingHorizontal: 20,
  },
  separator: { height: 16 },
  heroContainer: {
    marginBottom: 32,
    marginTop: 8,
  },
  bookCellWrapper: {
    flex: 1,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  sectionHeaderCard: {
    marginHorizontal: -4,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.7,
  },
})

export default HomePage
