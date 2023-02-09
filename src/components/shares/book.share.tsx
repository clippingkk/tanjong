import { Center, Text } from 'native-base'
import React from 'react'
import Page from '../page'

type BookShareViewProps = {
  bookID: number
  uid: number | null
}

function BookShareView(props: BookShareViewProps) {
  if (!props.uid) {
    return (
      <Center>
        <Text>please login...</Text>
      </Center>
    )
  }
  return (
    <Page>
      <Center>
        <Text>hello {props.bookID}</Text>
      </Center>
    </Page>
  )
}

export default BookShareView