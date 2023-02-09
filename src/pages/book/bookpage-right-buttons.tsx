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

  if (!props.uid) {
    return null
  }
  return (
  )
}

export default BookPageRightButton