import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { MasonryFlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { VStack, HStack, View, Center, useColorMode } from '@gluestack-ui/themed'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
import BookHero from '../../components/book/hero'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import { useBooksQuery } from '../../schema/generated'
import PulseBox from '../../components/pulse-box/pulse-box'
import { useHomeLoad } from '../../hooks/init'
import HomePageSkeleton from './skeleton'

type HomePageProps = {
}

function HomePage(props: HomePageProps) {
  const uid = useAtomValue(uidAtom)
  useHomeLoad()

  const bs = useBooksQuery({
    variables: {
      id: uid!,
      pagination: {
        limit: 10,
        offset: 0
      }
    },
    skip: !uid
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
    return bs.fetchMore({
      variables: {
        id: uid,
        pagination: {
          limit: 10,
          offset: allLength
        }
      }
    }).then(res => {
      if (
        res.data.books.length < 10
      ) {
        setAtEnd(true)
      }
    })
  }, [uid, bs.data?.books.length, atEnd])

  const bh = useBottomTabBarHeight()
  const hh = useHeaderHeight()

  const theReadingBook = useMemo(() => {
    const lbs = bs.data?.books ?? []
    if (lbs.length === 0) {
      return null
    }
    return lbs[0].doubanId
  }, [bs.data?.books])

  const listedBook = useMemo(() => {
    let lbs = [...bs.data?.books ?? []]

    if (theReadingBook) {
      lbs = lbs.filter(x => x.doubanId !== theReadingBook)
    }

    return lbs
  }, [bs.data?.books, theReadingBook])

  if (!uid) {
    return (
      <AuthGuard />
    )
  }

  if (bs.error) {
    return (
      <ErrorBox
        err={bs.error}
        onRefresh={() => bs.refetch({
          id: uid,
          pagination: {
            limit: 10,
            offset: 0
          }
        })}
      />
    )
  }

  if (bs.loading) {
    return (
      <HomePageSkeleton />
    )
    return (
      <View
        sx={{ _dark: { backgroundColor: '$coolGray900' } }}
      >
        <SafeAreaView>
          <VStack marginTop={20}>
            <Center>
              <PulseBox height={200} width={150} radius={4} />
            </Center>
            <HStack marginTop={8} padding={8} justifyContent='space-around'>
              <PulseBox height={150} width={100} radius={4} />
              <PulseBox height={150} width={100} radius={4} />
            </HStack>
            <HStack marginTop={8} padding={8} justifyContent='space-around'>
              <PulseBox height={150} width={100} radius={4} />
              <PulseBox height={150} width={100} radius={4} />
            </HStack>
            <HStack marginTop={8} padding={8} justifyContent='space-around'>
              <PulseBox height={150} width={100} radius={4} />
              <PulseBox height={150} width={100} radius={4} />
            </HStack>
          </VStack>
        </SafeAreaView>
      </View>
    )
  }

  if ((bs.data?.books.length ?? 0) === 0) {
    return (
      <EmptyBox />
    )
  }

  return (
    <SafeAreaView>
      <View
        sx={{
          _light: {
            backgroundColor: '$coolGray100'
          },
          _dark: {
            backgroundColor: '$coolGray900'
          }
        }}
        width='100%'
        height='100%'
      >
        <MasonryFlashList
          ListHeaderComponent={() => (
            <View sx={{ _dark: { backgroundColor: '$coolGray900' } }}>
              <BookHero bookDoubanID={theReadingBook} />
            </View>
          )}
          onRefresh={() => bs.refetch()}
          refreshing={bs.loading}
          numColumns={2}
          data={listedBook}
          renderItem={({ item }) => {
            return <BookCell bookDoubanID={item.doubanId} />
          }}
          estimatedItemSize={250}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
          ListFooterComponent={(
            <View width='100%' height={bh} />
          )}
          ItemSeparatorComponent={() => (
            <View height={4} />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default HomePage