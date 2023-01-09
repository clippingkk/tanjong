import { FlashList, MasonryFlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Text, View } from 'native-base'
import React, { useMemo } from 'react'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
import ErrorBox from '../../components/errorbox/errorbox'
import LoadingBox from '../../components/loading/loading'
import { useMultipBook } from '../../hooks/wenqu'
import { useBooksQuery } from '../../schema/generated'
import { WenquBook } from '../../service/wenqu'

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

  const books = useMultipBook(
    bs.data?.books.map(x => x.doubanId) ?? []
  )

  const bookList = useMemo<WenquBook[]>(() => {
    if (!bs.data?.books) {
      return []
    }
    if (!books.data?.books) {
      return []
    }

    const result = bs
      .data
      .books
      .map(b => books.data?.books.find(x => x.doubanId.toString() === b.doubanId))
      .filter(x => x)
    return result as WenquBook[]
  }, [bs.data?.books, books.data?.books])

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

  if (bs.loading) {
    return (
      <LoadingBox />
    )
  }

  return (
    <MasonryFlashList
      ListHeaderComponent={() => (
        <View height={200} bg='amber.300' />
      )}
      onRefresh={() => bs.refetch()}
      refreshing={bs.loading}
      numColumns={2}
      data={bookList}
      renderItem={({ item }) => {
        return <BookCell book={item} />
      }}
      estimatedItemSize={250}
      ItemSeparatorComponent={() => (
        <View height={4} />
      )}
    />
  )
}

export default HomePage