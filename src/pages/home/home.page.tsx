import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { MasonryFlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { View } from '@gluestack-ui/themed'
import React, { useCallback, useMemo, useState } from 'react'
import { useColorScheme, StyleSheet, Text, RefreshControl, Platform } from 'react-native'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
import BookHero from '../../components/book/hero'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import { useBooksQuery } from '../../schema/generated'
import { useHomeLoad } from '../../hooks/init'
import HomePageSkeleton from './skeleton'
import { GradientBackground, SectionHeader } from '../../components/ui'
import { FontLXGW } from '../../styles/font'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type HomePageProps = {}

function HomePage(props: HomePageProps) {
	const uid = useAtomValue(uidAtom)
	useHomeLoad()

	const bs = useBooksQuery({
		variables: {
			id: uid!,
			pagination: {
				limit: 10,
				offset: 0,
			},
		},
		skip: !uid,
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
		return bs
			.fetchMore({
				variables: {
					id: uid,
					pagination: {
						limit: 10,
						offset: allLength,
					},
				},
			})
			.then((res) => {
				if (res.data.books.length < 10) {
					setAtEnd(true)
				}
			})
	}, [uid, bs.data?.books.length, atEnd])

	const bh = useBottomTabBarHeight();
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';
	const insets = useSafeAreaInsets();

	const theReadingBook = useMemo(() => {
		const lbs = bs.data?.books ?? []
		if (lbs.length === 0) {
			return null
		}
		return lbs[0].doubanId
	}, [bs.data?.books])

	const listedBook = useMemo(() => {
		let lbs = [...(bs.data?.books ?? [])]

		if (theReadingBook) {
			lbs = lbs.filter((x) => x.doubanId !== theReadingBook)
		}

		return lbs
	}, [bs.data?.books, theReadingBook])

	if (!uid) {
		return <AuthGuard />
	}

	if (bs.error) {
		return (
			<ErrorBox
				err={bs.error}
				onRefresh={() =>
					bs.refetch({
						id: uid,
						pagination: {
							limit: 10,
							offset: 0,
						},
					})
				}
			/>
		)
	}

	if (bs.loading) {
		return (
		  <GradientBackground blur>
		    <HomePageSkeleton />
		  </GradientBackground>
		)
	}
	if ((bs.data?.books.length ?? 0) === 0) {
		return <EmptyBox />
	}

	return (
	  <GradientBackground>
	    <View style={styles.flexOne}>
	      <MasonryFlashList
	        contentContainerStyle={{
	          ...styles.listContent,
	          paddingTop: insets.top
	        }}
	        ListHeaderComponent={() => (
	          <View>
	            <SectionHeader 
	              title="Currently Reading"
	              subtitle={`${bs.data?.books.length ?? 0} books in your library`}
	            />
	            {theReadingBook && (
	              <View style={styles.heroContainer}>
	                <BookHero bookDoubanID={theReadingBook} />
	              </View>
	            )}
	            {listedBook.length > 0 && (
	              <SectionHeader 
	                title="Your Library"
	                subtitle="Continue exploring your collection"
	              />
	            )}
	          </View>
	        )}
	        refreshControl={
	          <RefreshControl
	            refreshing={bs.loading}
	            onRefresh={() => bs.refetch()}
	            tintColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
	          />
	        }
	        numColumns={2}
	        data={listedBook}
	        renderItem={({ item }) => (
	          <View style={styles.bookCellWrapper}>
	            <BookCell bookDoubanID={item.doubanId} />
	          </View>
	        )}
	        estimatedItemSize={250}
	        onEndReached={onReachedEnd}
	        onEndReachedThreshold={1}
	        ListFooterComponent={<View style={{ height: bh + insets.bottom + 16 }} />}
	        ItemSeparatorComponent={() => <View style={styles.separator} />}
	      />
	    </View>
	  </GradientBackground>
	)
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  listContent: { paddingHorizontal: 16 },
  separator: { height: 12 },
  heroContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  bookCellWrapper: {
    flex: 1,
    paddingHorizontal: 4,
  },
})

export default HomePage
