import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { FlashList, MasonryFlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Text, View } from 'native-base'
import React, { useCallback, useMemo, useState } from 'react'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
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

  if (!uid) {
    return (
      <AuthGuard />
    )
  }

  if (bs.error) {
    return (
      <ErrorBox err={bs.error} onRefresh={bs.refetch} />
    )
  }

  if (bs.loading && (bs.data?.books.length ?? 0) === 0) {
    return (
      <LoadingBox />
    )
  }

  return (
    <MasonryFlashList
      ListHeaderComponent={() => (
        <View height={hh + 200} bg='amber.300' />
      )}
      onRefresh={() => bs.refetch()}
      refreshing={bs.loading}
      numColumns={2}
      data={bs.data?.books ?? []}
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
  )
}

export default HomePage