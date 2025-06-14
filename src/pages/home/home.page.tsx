import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { MasonryFlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { View } from '@gluestack-ui/themed'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView, useColorScheme, StyleSheet } from 'react-native'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import BookCell from '../../components/book/cell'
import BookHero from '../../components/book/hero'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import { useBooksQuery } from '../../schema/generated'
import { useHomeLoad } from '../../hooks/init'
import HomePageSkeleton from './skeleton'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView } from '@react-native-community/blur'

const lightColors = {
  gradient: ['#FFDAB9', '#FFA07A'],
  blur: 'light',
}

const darkColors = {
  gradient: ['#483D8B', '#8A2BE2'],
  blur: 'dark',
}

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
	const isDarkMode = useColorScheme() === 'dark';
	const colors = isDarkMode ? darkColors : lightColors;

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
		  <LinearGradient colors={colors.gradient} style={styles.flexOne}>
		    <BlurView
		      style={styles.flexOne}
		      blurType={colors.blur as any}
		      blurAmount={10}
		    />
		    <HomePageSkeleton />
		  </LinearGradient>
		)
	}
	if ((bs.data?.books.length ?? 0) === 0) {
		return <EmptyBox />
	}

	return (
	  <LinearGradient colors={colors.gradient} style={styles.flexOne}>
	    <SafeAreaView style={styles.flexOne}>
	      <MasonryFlashList
	        contentContainerStyle={styles.listContent}
	        ListHeaderComponent={() => (
	          <BookHero bookDoubanID={theReadingBook} />
	        )}
	        onRefresh={() => bs.refetch()}
	        refreshing={bs.loading}
	        numColumns={2}
	        data={listedBook}
	        renderItem={({ item }) => (
	          <BookCell bookDoubanID={item.doubanId} />
	        )}
	        estimatedItemSize={250}
	        onEndReached={onReachedEnd}
	        onEndReachedThreshold={1}
	        ListFooterComponent={<View style={{ height: bh + 16 }} />}
	        ItemSeparatorComponent={() => <View style={styles.separator} />}
	      />
	    </SafeAreaView>
	  </LinearGradient>
	)
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  listContent: { paddingHorizontal: 8 },
  separator: { height: 8 },
})

export default HomePage
