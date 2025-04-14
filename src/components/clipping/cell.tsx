import { Link } from '@react-navigation/native'
import { Text, View } from 'native-base'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { RouteKeys } from '../../routes'
import { Clipping } from '../../schema/generated'
import { FontLXGW } from '../../styles/font'

type ClippingCellProps = {
	clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
}

function ClippingCell(props: ClippingCellProps) {
	const clipping = props.clipping
	const width = useMemo(() => {
		return Dimensions.get('screen').width - 8 * 2
	}, [])
	return (
		<View paddingX={2}>
			<Link
				screen={RouteKeys.Clipping}
				params={{
					clipping: props.clipping,
				}}
				style={{
					width: '100%',
				}}
			>
				<View
					className="w-full rounded-lg overflow-hidden transition-all duration-200 
        bg-white dark:bg-gray-800 
        hover:bg-gray-50 dark:hover:bg-gray-700
        shadow-md hover:shadow-lg
        border border-gray-100 dark:border-gray-700"
				>
					{/* Header with book info */}
					<View className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
						{/* <Book className="w-4 h-4 text-blue-500 dark:text-blue-400" /> */}
						<View className="flex-1">
							<Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
								{clipping.title}
							</Text>
							<Text className="text-xs text-gray-500 dark:text-gray-400">
								{clipping.bookID}
							</Text>
						</View>
					</View>

					{/* Clipping content */}
					<View className="p-4 relative">
						{/* <Quote className="absolute top-3 left-3 w-4 h-4 text-gray-300 dark:text-gray-600" /> */}
						<View className="pl-6">
							<Text className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
								{clipping.content}
							</Text>
						</View>
					</View>

					{/* Footer with metadata */}
					<View
						className="px-4 py-2 bg-gray-50 dark:bg-gray-750/50 
          text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center"
					>
						<Text>Page 23</Text>
						<Text>Chapter 3</Text>
					</View>
				</View>

				{/* <View
					backgroundColor={'blue.300'}
					_dark={{ backgroundColor: 'blue.900' }}
					borderRadius={8}
					shadow={4}
					padding={4}
					width={width}
				>
					<Text fontFamily={FontLXGW}>{props.clipping.content}</Text>
				</View> */}
			</Link>
		</View>
	)
}

export default ClippingCell
