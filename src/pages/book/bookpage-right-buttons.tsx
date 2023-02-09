import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { HeaderButtonProps } from '@react-navigation/elements'
import { Button, View, Text } from 'native-base'
import React, { useMemo, useRef } from 'react'

type BookPageRightButtonProps = HeaderButtonProps & {
  bookID: number
  uid: number | null
}

function BookPageRightButton(props: BookPageRightButtonProps) {
  const bsr = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  if (!props.uid) {
    return null
  }
  return (
    <BottomSheetModalProvider>
      <Button
        variant='ghost'
        size='xs'
        onPress={() => {
          bsr.current?.present()
        }}
      >
        <Text> 🌐 </Text>
      </Button>
      <BottomSheetModal
        ref={bsr}
        index={1}
        snapPoints={snapPoints}
      >
        <View>
          <Text>hello world</Text>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

export default BookPageRightButton