import {
	BottomTabScreenProps,
	useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { Link, useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { uidAtom } from '../../atomic'
import AuthGuard from '../../components/auth-guard/auth-guard'
import ClippingCell from '../../components/clipping/cell'
import EmptyBox from '../../components/empty/empty'
import ErrorBox from '../../components/errorbox/errorbox'
import BasicBoard from '../../components/profile/basic-board'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { RouteKeys, TabRouteParamList } from '../../routes'
import { useProfileQuery } from '../../schema/generated'
import { SafeAreaView } from 'react-native'
import { Center, VStack, View, Text } from '@gluestack-ui/themed'
import PulseBox from '../../components/pulse-box/pulse-box'
import ProfilePageSkeleton from './skeleton'

function ProfilePage() {
	const navigation = useNavigation()
	const uid = useAtomValue(uidAtom)
	const hh = useHeaderHeight()

	const p = useProfileQuery({
		variables: {
			id: uid!,
			pagination: {
				recents: {
					lastId: 1 << 30,
					limit: 10,
				},
			},
		},
		skip: !uid,
	})
	useEffect(() => {
		navigation.setOptions({
			title: p.data?.me.name ?? 'Profile',
			headerRight: () => <Link screen={RouteKeys.ProfileSettings}>⚙️</Link>,
		})
	}, [navigation, p.data?.me.name])

	const itemSizeCellHeight = useClippingCellAvgHeight(p.data?.me.recents ?? [])
	const bh = useBottomTabBarHeight()

	const [atEnd, setAtEnd] = useState(false)

	const onReachedEnd = useCallback(() => {
		if (atEnd) {
			return
		}
		const rcs = p.data?.me.recents
		if (!rcs || rcs.length === 0) {
			return
		}
		const last = rcs[rcs.length - 1]
		return p
			.fetchMore({
				variables: {
					id: uid,
					pagination: {
						recents: {
							lastId: last.id,
							limit: 10,
						},
					},
				},
			})
			.then((res) => {
				if (res.data.me.recents.length < 10) {
					setAtEnd(true)
				}
			})
	}, [uid, p.data?.me.recents.length, atEnd])

	if (!uid) {
		return <AuthGuard />
	}

	if (p.error) {
		return (
			<ErrorBox
				err={p.error}
				onRefresh={() =>
					p.refetch({
						id: uid!,
						pagination: {
							recents: {
								lastId: 1 << 30,
								limit: 10,
							},
						},
					})
				}
			/>
		)
	}

	if (p.loading) {
		return <ProfilePageSkeleton />
	}

	if ((p.data?.me.recents.length ?? 0) === 0) {
		return <EmptyBox />
	}

	return (
		<View
			backgroundColor="$coolGray100"
			sx={{
				_dark: {
					backgroundColor: '$coolGray900',
				},
			}}
			width="100%"
			height="100%"
		>
			<FlashList
				onRefresh={p.refetch}
				refreshing={p.loading}
				ListHeaderComponent={
					<View paddingTop={hh}>
						<BasicBoard profile={p.data?.me} />
					</View>
				}
				data={p.data?.me.recents ?? []}
				renderItem={({ item }) => <ClippingCell clipping={item} />}
				ItemSeparatorComponent={() => (
					<View
						paddingTop={'$1'}
						paddingBottom={'$1'}
						width="100%"
						height={'$1'}
					/>
				)}
				ListEmptyComponent={
					<View>
						<Text>empty</Text>
					</View>
				}
				ListFooterComponent={<View width="100%" height={bh + 16} />}
				estimatedItemSize={itemSizeCellHeight}
				onEndReached={onReachedEnd}
				onEndReachedThreshold={1}
			/>
		</View>
	)
}

export default ProfilePage
