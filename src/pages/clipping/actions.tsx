import { AlertDialog, Button, Text, View } from 'native-base'
import React, { useCallback, useState } from 'react'
import { FetchClippingQuery, useFetchClippingAiSummaryLazyQuery } from '../../schema/generated'
import { ActivityIndicator } from 'react-native'

type ActionsProps = {
  clipping?: FetchClippingQuery['clipping']
}

function Actions(props: ActionsProps) {
  const { clipping } = props

  const [aiSummaryVisible, setAiSummaryVisible] = useState(false)

  const [doFetchAISummary, { data, loading }] = useFetchClippingAiSummaryLazyQuery({
    variables: {
      id: clipping?.id ?? 0,
    },
  })
  const onGetAIDescription = useCallback(() => {
    setAiSummaryVisible(true)
    return doFetchAISummary()
  }, [doFetchAISummary])

  const cancelRef = React.useRef(null)

  return (
    <View
      style={{
        marginTop: 10
      }}>
      <Button
        onPress={onGetAIDescription}
      >
        ✨ AI Description
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={aiSummaryVisible}
        onClose={() => setAiSummaryVisible(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            Description of AI
          </AlertDialog.Header>
          <AlertDialog.Body>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text>{data?.clipping?.aiSummary}</Text>
            )}
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  )
}

export default Actions