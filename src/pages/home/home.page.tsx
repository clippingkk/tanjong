import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { MasonryFlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { View } from 'native-base'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
import BookHero from '../../components/book/hero'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import LoadingBox from '../../components/loading/loading'
import { useBooksQuery } from '../../schema/generated'

type HomePageProps = {
}

function HomePage(props: HomePageProps) {
  const uid = useAtomValue(uidAtom)

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
      <LoadingBox
        retry={() => bs.refetch({
          id: uid,
          pagination: {
            limit: 10,
            offset: 0
          }
        })}
      />
    )
  }

  if ((bs.data?.books.length ?? 0) === 0) {
    return (
      <EmptyBox />
    )
  }

  return (
    <View
      backgroundColor='gray.100'
      _dark={{ backgroundColor: 'gray.900' }}
      width='100%'
      height='100%'
    >
      <SafeAreaView
        height='100%'
      >
        <MasonryFlashList
          ListHeaderComponent={() => (
            <BookHero bookDoubanID={theReadingBook} />
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
      </SafeAreaView>
    </View>
  )
}

export default HomePage