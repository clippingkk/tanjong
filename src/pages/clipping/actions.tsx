import { Button, Text, View, ActivityIndicator } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import {
	FetchClippingQuery,
	useFetchClippingAiSummaryLazyQuery,
} from '../../schema/generated'

type ActionsProps = {
	clipping?: FetchClippingQuery['clipping']
}

function Actions(props: ActionsProps) {
	const { clipping } = props
	const bsr = useRef<ActionSheetRef>(null)

	const [doFetchAISummary, { data, loading }] =
		useFetchClippingAiSummaryLazyQuery({
			variables: {
				id: clipping?.id ?? 0,
			},
		})
	const onGetAIDescription = useCallback(() => {
		bsr.current?.show()
		return doFetchAISummary()
	}, [doFetchAISummary])

	return (
		<View className="w-full mt-2">
			<Button onPress={onGetAIDescription} title="✨ AI Description" />
			<ActionSheet ref={bsr} snapPoints={[80, 90]}>
				<View className="h-80 p-4">
					<Text>✨ AI Description</Text>
					<View>
						{loading ? (
							<ActivityIndicator />
						) : (
							<Text>{data?.clipping?.aiSummary}</Text>
						)}
					</View>
				</View>
			</ActionSheet>
		</View>
	)
}

export default Actions
