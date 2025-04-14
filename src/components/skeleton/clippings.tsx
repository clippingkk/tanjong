import { VStack } from '@gluestack-ui/themed'
import React, { useMemo } from 'react'
import PulseBox from '../pulse-box/pulse-box'
import { Dimensions, SafeAreaView } from 'react-native'

type SkeletonClippingListProps = {}

const SKELETON_COUNT = 4

function SkeletonClippingList(props: SkeletonClippingListProps) {
	const width = useMemo(() => {
		return Dimensions.get('screen').width - 8 * 2
	}, [])
	return (
		<SafeAreaView>
			<VStack height="$full" marginTop={'$4'} rowGap={'$4'}>
				{new Array(SKELETON_COUNT).fill(0).map((_, index) => (
					<PulseBox
						key={index}
						height={200}
						width={width}
						marginLeft={8}
						radius={8}
					/>
				))}
			</VStack>
		</SafeAreaView>
	)
}

export default SkeletonClippingList
