import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, useColorScheme, RefreshControl, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uidAtom } from '../../atomic'
import BookHead from '../../components/book/head'
import ClippingCell from '../../components/clipping/cell'
import UTPShareView from '../../components/shares/utp.share'
import { RouteKeys, RouteParamList } from '../../routes'
import { useBookQuery } from '../../schema/generated'
import { UTPService } from '../../service/utp'
import ActionSheet, {
  ActionSheetRef,
  useScrollHandlers
} from 'react-native-actions-sheet'
import PulseBox from '../../components/pulse-box/pulse-box'
import { useNavigation } from '@react-navigation/native'
import { GradientBackground } from '../../components/ui'
import { FontLXGW } from '../../styles/font'
import { useHeaderHeight } from '@react-navigation/elements'

type BookPageProps = NativeStackScreenProps<
  RouteParamList,
  RouteKeys.BookDetail
>

function BookPage(props: BookPageProps) {
  const cs = useColorScheme()
  const isDarkMode = cs === 'dark'
  const { route } = props
  const navigation = useNavigation()
  const book = route.params.book
  const uid = useAtomValue(uidAtom)

  const h = useHeaderHeight()
  console.log('hhhhh', h)

  const actionSheetRef = useRef<ActionSheetRef>(null)

  useEffect(() => {
    navigation.setOptions({
      title: book.title,
      headerRight() {
        return (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              actionSheetRef.current?.show()
            }}>
            <Text style={{ fontSize: 20 }}>🌐</Text>
          </TouchableOpacity>
        )
      }
    })
  }, [cs, navigation, book.id, uid])
  const bs = useBookQuery({
    variables: {
      id: book.doubanId,
      pagination: {
        limit: 10,
        offset: 0
      }
    }
  })
  // const primaryColor = useImagePrimaryColor(book.image)
  const [atEnd, setAtEnd] = useState(false)

  const onReachedEnd = useCallback(() => {
    if (atEnd) {
      return
    }
    const allLength = bs.data?.book.clippings.length ?? 0
    return bs
      .fetchMore({
        variables: {
          id: book.doubanId,
          pagination: {
            limit: 10,
            offset: allLength
          }
        }
      })
      .then(res => {
        if (res.data.book.clippings.length < 10) {
          setAtEnd(true)
        }
      })
  }, [book.doubanId, bs.fetchMore, bs.data?.book.clippings.length, atEnd])

  const scrollHandlers = useScrollHandlers<ScrollView>({
    refreshControlBoundary: 0
  })

  if (bs.loading) {
    return (
      <GradientBackground blur>
        <SafeAreaView style={styles.flexOne}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingHeader}>
              <PulseBox height={240} width={160} radius={12} />
            </View>
            <View style={styles.loadingContent}>
              <PulseBox height={180} width={346} radius={8} />
              <PulseBox height={180} width={346} radius={8} />
              <PulseBox height={180} width={346} radius={8} />
            </View>
          </View>
        </SafeAreaView>
      </GradientBackground>
    )
  }

  if ((bs.data?.book.clippingsCount ?? 0) === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.flexOne}>
          <View style={styles.emptyStateContainer}>
            <BookHead book={book} />
            <View style={styles.emptyMessageContainer}>
              <Text style={[styles.emptyTitle, { color: isDarkMode ? '#E0E7FF' : '#1E293B' }]}>
                No clippings yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                Start reading and highlighting your favorite passages
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </GradientBackground>
    )
  }

  return (
    <GradientBackground>
      <View style={styles.flexOne}>
        <FlashList
          ListHeaderComponent={() => (
            <>
              <BookHead book={book} />
              <View style={[styles.sectionHeaderCard,
              { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)' },
              ]}>
                <View style={styles.sectionHeaderContent}>
                  <View style={[styles.sectionIcon, { backgroundColor: isDarkMode ? '#6366F1' : '#818CF8' }]}>
                    <Text style={styles.sectionIconText}>🔖</Text>
                  </View>
                  <View style={styles.sectionTextContainer}>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#E0E7FF' : '#1E293B' }]}>Highlights</Text>
                    <Text style={[styles.sectionSubtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{bs.data?.book.clippingsCount ?? 0} passages saved</Text>
                  </View>
                </View>
              </View>
            </>
          )}
          refreshControl={
            <RefreshControl
              refreshing={bs.loading}
              onRefresh={() => bs.refetch()}
              tintColor={isDarkMode ? '#818CF8' : '#6366F1'}
            />
          }
          contentContainerStyle={{
            ...styles.listContent,
            // paddingTop: 5
          }}
          data={bs.data?.book.clippings}
          renderItem={({ item }) => {
            return (
              <View style={styles.clippingWrapper}>
                <ClippingCell clipping={item} book={book} />
              </View>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>No clippings yet</Text>
            </View>
          }
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
          ListFooterComponent={<View style={{ height: 20 }} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <ActionSheet
        ref={actionSheetRef}
        snapPoints={[80, 90]}
      // backgroundStyle={{ backgroundColor: bg }}
      // style={{
      //   shadowColor: "#000",
      //   shadowOffset: {
      //     width: 0,
      //     height: 12,
      //   },
      //   shadowOpacity: 0.58,
      //   shadowRadius: 16.00,
      //   elevation: 24,
      // }}
      >
        <UTPShareView
          kind={UTPService.book}
          bookID={book.id}
          bookDBID={book.doubanId}
          uid={uid}
          scrollHandler={scrollHandlers}
          isDarkMode={isDarkMode}
        />
      </ActionSheet>
    </GradientBackground >
  )
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 16,
  },
  shareButton: {
    marginRight: 16,
    padding: 8,
  },
  clippingWrapper: {
    marginVertical: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FontLXGW,
    fontWeight: '300',
  },
  emptyStateContainer: {
    flex: 1,
  },
  emptyMessageContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '300',
    fontFamily: FontLXGW,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FontLXGW,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  sectionHeaderCard: {
    marginVertical: 20,
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
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  loadingHeader: {
    marginBottom: 32,
  },
  loadingContent: {
    gap: 12,
  },
})

export default BookPage
