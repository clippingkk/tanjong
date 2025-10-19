import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, useColorScheme, RefreshControl } from 'react-native';
import { useFetchSquareDataQuery } from '../../schema/generated';
import { FlashList } from '@shopify/flash-list';
import { useAtomValue } from 'jotai';
import { uidAtom } from '../../atomic';
import ClippingCell from '../../components/clipping/cell';
import { useClippingCellAvgHeight } from '../../hooks/clipping';
import EmptyBox from '../../components/empty/empty';
import SkeletonClippingList from '../../components/skeleton/clippings';
import { GradientBackground } from '../../components/ui';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

function SquarePage() {
  const uid = useAtomValue(uidAtom);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
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
            paddingTop: headerHeight
          }}
          refreshControl={
            <RefreshControl
              refreshing={p.loading}
              onRefresh={p.refetch}
              tintColor={isDarkMode ? '#818CF8' : '#6366F1'}
            />
          }
          data={p.data?.featuredClippings ?? []}
          ListHeaderComponent={
            <View style={[styles.headerCard, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)' }]}>
              <View style={styles.headerContent}>
                <View style={[styles.headerIcon, { backgroundColor: isDarkMode ? '#6366F1' : '#818CF8' }]}>
                  <Text style={styles.headerIconEmoji}>✨</Text>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.headerTitle, { color: isDarkMode ? '#E0E7FF' : '#1E293B' }]}>Featured Today</Text>
                  <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>Handpicked quotes from the community</Text>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.clippingWrapper}>
              <ClippingCell clipping={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: 0 + insets.bottom + 16 }} />}
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
    height: 16,
  },
  clippingWrapper: {
    marginVertical: 4,
  },
  headerCard: {
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerIconEmoji: {
    fontSize: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.7,
  },
});

export default SquarePage;
