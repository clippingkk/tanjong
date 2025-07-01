import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, useColorScheme, RefreshControl } from 'react-native';
import { useFetchSquareDataQuery } from '../../schema/generated';
import { FlashList } from '@shopify/flash-list';
import { useAtomValue } from 'jotai';
import { uidAtom } from '../../atomic';
import ClippingCell from '../../components/clipping/cell';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useClippingCellAvgHeight } from '../../hooks/clipping';
import EmptyBox from '../../components/empty/empty';
import SkeletonClippingList from '../../components/skeleton/clippings';
import { GradientBackground, SectionHeader, Card } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SquarePage() {
  const uid = useAtomValue(uidAtom);
  const bh = useBottomTabBarHeight();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
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
      return
    }
    const last = rcs[rcs.length - 1]
    return p
      .fetchMore({
        variables: {
          pagination: {
            lastId: last.id,
            limit: 10
          }
        }
      })
      .then(res => {
        if (res.data.featuredClippings.length < 10) {
          setAtEnd(true)
        }
      })
  }, [uid, p.data?.featuredClippings.length, atEnd])

  const itemSizeCellHeight = useClippingCellAvgHeight(
    p.data?.featuredClippings ?? []
  )

  const fcs = p.data?.featuredClippings ?? []

  if (fcs.length === 0 && p.loading) {
    return (
      <GradientBackground blur>
        <SkeletonClippingList />
      </GradientBackground>
    );
  }

  if (fcs.length === 0) {
    return (
      <GradientBackground>
        <EmptyBox />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.flexOne}>
        <FlashList
          contentContainerStyle={{
            ...styles.listContentContainer,
            paddingTop: insets.top
          }}
          refreshControl={
            <RefreshControl
              refreshing={p.loading}
              onRefresh={p.refetch}
              tintColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
            />
          }
          data={p.data?.featuredClippings ?? []}
          ListHeaderComponent={
            <SectionHeader
              title="Discover"
              subtitle="Featured clippings from the community"
            />
          }
          renderItem={({ item }) => (
            <ClippingCell clipping={item} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: bh + insets.bottom + 16 }} />}
          estimatedItemSize={itemSizeCellHeight}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 12,
  },
  clippingCard: {
    marginHorizontal: 4,
  },
});

export default SquarePage;
