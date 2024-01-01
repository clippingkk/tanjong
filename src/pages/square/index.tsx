import React, { useCallback, useState } from 'react'
import { Text, View } from '@gluestack-ui/themed'
import { useFetchSquareDataQuery } from '../../schema/generated'
import { FlashList } from '@shopify/flash-list'
import { useHeaderHeight } from '@react-navigation/elements'
import { useAtomValue } from 'jotai'
import { uidAtom } from '../../atomic'
import ClippingCell from '../../components/clipping/cell'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import EmptyBox from '../../components/empty/empty'

type SquarePageProps = {
}

function SquarePage(props: SquarePageProps) {
  const uid = useAtomValue(uidAtom)
  const hh = useHeaderHeight()
  const bh = useBottomTabBarHeight()
  const p = useFetchSquareDataQuery({
    variables: {
      pagination: {
        limit: 10
      }
    }
  })
  const [atEnd, setAtEnd] = useState(false)
  const onReachedEnd = useCallback(() => {
    if (atEnd) {
      return
    }
    const rcs = p.data?.featuredClippings
    if (!rcs || rcs.length === 0) {
      return;
    }
    const last = rcs[rcs.length - 1]
    return p.fetchMore({
      variables: {
        pagination: {
          lastId: last.id,
          limit: 10,
        }
      }
    }).then(res => {
      if (
        res.data.featuredClippings.length < 10
      ) {
        setAtEnd(true)
      }
    })
  }, [uid, p.data?.featuredClippings.length, atEnd])
  console.log('data', p.data)

  const itemSizeCellHeight = useClippingCellAvgHeight(p.data?.featuredClippings ?? [])
  if ((p.data?.featuredClippings.length ?? 0) === 0) {
    return (
      <EmptyBox />
    )
  }
  return (
    <View
      backgroundColor='gray.100'
      sx={{
        _dark: {
          backgroundColor: 'gray.900'
        }
      }}
      width='100%'
      height='100%'
    >
      <FlashList
        onRefresh={p.refetch}
        refreshing={p.loading}
        data={p.data?.featuredClippings ?? []}
        ListHeaderComponent={(
          <View marginTop={hh + 80} />
        )}
        renderItem={({ item }) => <ClippingCell clipping={item} />}
        ItemSeparatorComponent={() => (
          <View
            paddingTop={'$1'}
            paddingBottom={'$1'}
            width='100%'
            height={'$1'}
          />
        )}
        ListEmptyComponent={(
          <View>
            <Text>empty</Text>
          </View>
        )}
        ListFooterComponent={(
          <View width='100%' height={bh + 16} />
        )}
        estimatedItemSize={itemSizeCellHeight}
        onEndReached={onReachedEnd}
        onEndReachedThreshold={1}
      />
    </View>
  )
}

export default SquarePage