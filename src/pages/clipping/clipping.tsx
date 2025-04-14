import { CachedImage } from '@georstat/react-native-image-cache'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAtomValue } from 'jotai'
import React, { useEffect, useMemo, useRef } from 'react'
import {
	ScrollView,
	Button,
	Text,
	View,
	ActivityIndicator,
	RefreshControl,
	SafeAreaView,
	ScrollView as RNScrollView,
	useColorScheme,
} from 'react-native'
import { uidAtom } from '../../atomic'
import UTPShareView from '../../components/shares/utp.share'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteParamList } from '../../routes'
import { Clipping, useFetchClippingQuery } from '../../schema/generated'
import { UTPService } from '../../service/utp'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'
import ActionSheet, {
	ActionSheetRef,
	useScrollHandlers,
} from 'react-native-actions-sheet'
import Actions from './actions'
import { useNavigation } from '@react-navigation/native'

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>

function ClippingPage(props: ClippingPageProps) {
	const navigation = useNavigation()
	const cs = useColorScheme()
	const paramClipping = props.route.params.clipping
	const cid = props.route.params.clippingID

	const id = paramClipping?.id ?? cid

	const bsr = useRef<ActionSheetRef>(null)

	const uid = useAtomValue(uidAtom)
	const clippingResult = useFetchClippingQuery({
		variables: {
			id: id!,
		},
	})

	const remoteClipping = clippingResult.data?.clipping

	const bookID = paramClipping?.bookID ?? remoteClipping?.bookID
	const content = paramClipping?.content ?? remoteClipping?.content
	const title = paramClipping?.title ?? remoteClipping?.title
	const scrollHandlers = useScrollHandlers<RNScrollView>({
		refreshControlBoundary: 0,
	})

	useEffect(() => {
		if (!title) {
			return
		}
		navigation.setOptions({
			title,
			headerTransparent: true,
			headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
			headerRight() {
				return (
					<Button
						onPress={() => {
							bsr.current?.show()
						}}
						title="🌐"
					/>
				)
			},
		})
	}, [title, navigation])

	const books = useSingleBook(bookID)
	const book = useMemo(() => {
		const bks = books.data?.books
		if (!bks || bks.length === 0) {
			return null
		}

		return bks[0]
	}, [books.data?.books])

	return (
		<>
			<ScrollView
				className="flex-1 h-full"
				refreshControl={
					<RefreshControl
						refreshing={clippingResult.loading}
						onRefresh={() => clippingResult.refetch({ id: id! })}
					/>
				}
			>
				{!content ? (
					<View className="h-full flex-1 absolute top-4 left-0 right-0 bottom-0 pt-24 items-center justify-center">
						<ActivityIndicator size={'large'} />
						<Text>Loading</Text>
					</View>
				) : null}
				<View className="pl-4 pr-4 h-full">
					<SafeAreaView>
						<View className="pt-8">
							<Text
								style={{ fontFamily: FontLXGW }}
								className="text-xl"
								selectable
							>
								{content}
							</Text>
						</View>
					</SafeAreaView>

					{content && (
						<>
							<Actions clipping={clippingResult.data?.clipping} />
							<View className="mt-16 h-1" />
						</>
					)}

					{book ? (
						<View className="pt-1">
							<View
								style={{
									shadowColor: 'black',
									shadowOffset: { width: 0, height: 0 },
									shadowRadius: 4,
									borderRadius: 100,
								}}
							>
								<CachedImage
									source={book.image}
									style={[
										{
											height: 200,
											width: 100,
											borderRadius: 800,
										},
										basicStyles.shadow,
									]}
								/>
							</View>
							<View className="px-4 pt-8">
								<Text style={{ fontFamily: FontLXGW }} selectable>
									{book.title}
								</Text>
								<Text style={{ fontFamily: FontLXGW, fontSize: 14 }} selectable>
									{book.author}
								</Text>
							</View>
						</View>
					) : null}
				</View>
			</ScrollView>
			{/* TODO: add more actions like goto douban, descriptions */}
			<ActionSheet ref={bsr} snapPoints={[80, 90]}>
				{book ? (
					<UTPShareView
						kind={UTPService.clipping}
						bookID={book.id}
						bookDBID={book.doubanId}
						cid={id}
						uid={uid}
						scrollHandler={scrollHandlers}
					/>
				) : null}
			</ActionSheet>
		</>
	)
}

export default ClippingPage
