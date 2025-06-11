import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import { useFetchSquareDataQuery } from '../../schema/generated';
import { FlashList } from '@shopify/flash-list';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAtomValue } from 'jotai';
import { uidAtom } from '../../atomic';
import ClippingCell from '../../components/clipping/cell';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useClippingCellAvgHeight } from '../../hooks/clipping';
import EmptyBox from '../../components/empty/empty';
import SkeletonClippingList from '../../components/skeleton/clippings';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const lightColors = {
  gradient: ['#FFE4E1', '#FFDAB9'], // Lighter, softer gradient for SquarePage
  blur: 'light',
  headerText: '#333',
};

const darkColors = {
  gradient: ['#2E0854', '#483D8B'], // Deeper purple/blue gradient for dark mode
  blur: 'dark',
  headerText: '#fff',
};

function SquarePage() {
    const uid = useAtomValue(uidAtom);
  const hh = useHeaderHeight();
  const bh = useBottomTabBarHeight();
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;
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
      <LinearGradient colors={colors.gradient} style={styles.flexOne}>
        <BlurView style={styles.flexOne} blurType={colors.blur as any} blurAmount={10} />
        <SkeletonClippingList />
      </LinearGradient>
    );
  }

  if (fcs.length === 0) {
    return (
      <LinearGradient colors={colors.gradient} style={styles.flexOne}>
        <BlurView style={styles.flexOne} blurType={colors.blur as any} blurAmount={10}>
          <EmptyBox />
        </BlurView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradient} style={styles.flexOne}>
      <SafeAreaView style={styles.flexOne}>
        <FlashList
          contentContainerStyle={styles.listContentContainer}
          onRefresh={p.refetch}
          refreshing={p.loading}
          data={p.data?.featuredClippings ?? []}
          ListHeaderComponent={<View style={{ height: hh + 10 }} />}
          renderItem={({ item }) => <ClippingCell clipping={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: bh + 16 }} />}
          estimatedItemSize={itemSizeCellHeight}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
  },
  separator: {
    height: 16,
  },
});

export default SquarePage;
