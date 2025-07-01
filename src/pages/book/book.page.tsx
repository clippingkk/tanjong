import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Center, Spinner, Text } from '@gluestack-ui/themed'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, useColorScheme, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native'
import { uidAtom } from '../../atomic'
import BookHead from '../../components/book/head'
import ClippingCell from '../../components/clipping/cell'
import Page from '../../components/page'
import UTPShareView from '../../components/shares/utp.share'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { RouteKeys, RouteParamList } from '../../routes'
import { useBookQuery } from '../../schema/generated'
import { UTPService } from '../../service/utp'
import ActionSheet, {
  ActionSheetRef,
  useScrollHandlers
} from 'react-native-actions-sheet'
import { VStack, View, Button } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native'
import PulseBox from '../../components/pulse-box/pulse-box'
import { useNavigation } from '@react-navigation/native'
import { GradientBackground, Card, SectionHeader } from '../../components/ui'
import { FontLXGW } from '../../styles/font'

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

  const snapPoints = useMemo(() => ['50%', '70%'], [])

  const actionSheetRef = useRef<ActionSheetRef>(null)

  useEffect(() => {
    navigation.setOptions({
      title: book.title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
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

  const itemSizeCellHeight = useClippingCellAvgHeight(
    bs.data?.book.clippings ?? []
  )

  const scrollHandlers = useScrollHandlers<ScrollView>({
    refreshControlBoundary: 0
  })

  if (bs.loading) {
    return (
      <GradientBackground blur>
        <SafeAreaView style={styles.flexOne}>
          <VStack mt={20}>
            <Center mb={8}>
              <PulseBox height={310} width={400} radius={4} />
            </Center>
            <Center>
              <VStack rowGap={8}>
                <PulseBox height={180} width={346} radius={4} />
                <PulseBox height={180} width={346} radius={4} />
                <PulseBox height={180} width={346} radius={4} />
                <PulseBox height={180} width={346} radius={4} />
              </VStack>
            </Center>
          </VStack>
        </SafeAreaView>
      </GradientBackground>
    )
  }

  if ((bs.data?.book.clippingsCount ?? 0) === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.flexOne}>
          <Center style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDarkMode ? '#E2E8F0' : '#475569', fontFamily: FontLXGW }]}>
              No clippings found for this book
            </Text>
          </Center>
        </SafeAreaView>
      </GradientBackground>
    )
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flexOne}>
        <FlashList
          ListHeaderComponent={() => (
            <View>
              <BookHead book={book} />
              <SectionHeader
                title="Clippings"
                subtitle={`${bs.data?.book.clippingsCount ?? 0} highlights from this book`}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={bs.loading}
              onRefresh={() => bs.refetch()}
              tintColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
            />
          }
          contentContainerStyle={styles.listContent}
          data={bs.data?.book.clippings}
          renderItem={({ item }) => {
            return (
              <ClippingCell clipping={item} book={book} />
            )
          }}
          ListEmptyComponent={
            <Center style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: isDarkMode ? '#E2E8F0' : '#475569' }]}>No clippings yet</Text>
            </Center>
          }
          estimatedItemSize={itemSizeCellHeight}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
          ListFooterComponent={<View style={{ height: 20 }} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
      </SafeAreaView>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  listContent: {
  },
  separator: {
    height: 12,
  },
  shareButton: {
    marginRight: 16,
    padding: 8,
  },
  clippingCard: {
    marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
})

export default BookPage
