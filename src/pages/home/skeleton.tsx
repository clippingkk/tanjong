import { HStack, VStack, View } from '@gluestack-ui/themed'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PulseBox from '../../components/pulse-box/pulse-box'

function HomePageSkeleton() {
	const screenWidth = useMemo(() => {
		return Dimensions.get('screen').width
	}, [])
	return (
		<View sx={{ _dark: { backgroundColor: '$coolGray900' } }}>
			<SafeAreaView>
				<VStack mt={'$4'}>
					<View mb={8}>
						<PulseBox
							height={200}
							width={screenWidth}
							// marginLeft={8}
							radius={4}
						/>
					</View>
					<VStack height={'$full'} rowGap={8}>
						{new Array(4).fill(0).map((_, index) => (
							<HStack key={index} justifyContent="space-around">
								{new Array(2).fill(0).map((_, j) => (
									<PulseBox
										key={j}
										height={180}
										width={screenWidth / 2 - 8 * 2}
										radius={4}
									/>
								))}
							</HStack>
						))}
					</VStack>
				</VStack>
			</SafeAreaView>
		</View>
	)
}

export default HomePageSkeleton
