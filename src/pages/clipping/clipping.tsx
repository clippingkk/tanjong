import { CachedImage } from '@georstat/react-native-image-cache'
import { useHeaderHeight } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Divider, ScrollView, Text, View } from 'native-base'
import React, { useEffect, useMemo, useState } from 'react'
import { useColorScheme } from 'react-native'
import ImageColors from 'react-native-image-colors'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteParamList } from '../../routes'
import { Clipping, useFetchClippingQuery } from '../../schema/generated'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>

function ClippingPage(props: ClippingPageProps) {
  const navigate = useNavigation()
  const cs = useColorScheme()
  const hh = useHeaderHeight()
  const { id, bookID, content, title } = props.route.params.clipping
  useEffect(() => {
    if (!title) {
      return
    }
    navigate.setOptions({
      title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
    })
  }, [title])

  const clippingResult = useFetchClippingQuery({
    variables: {
      id
    }
  })

  const books = useSingleBook(bookID)
  const book = useMemo(() => {
    const bks = books.data?.books
    if (!bks || bks.length === 0) {
      return null
    }

    return bks[0]
  }, [books.data?.books])

  return (
    <ScrollView>
      <View paddingLeft={4} paddingRight={4} paddingTop={hh + 8}>
        <View>
          <Text
            fontFamily={FontLXGW}
            fontSize='lg'
          >
            {content}
          </Text>
        </View>

        <Divider marginTop={4} />

        {book ? (
          <View flexDirection='row'>
            <CachedImage
              source={book.image}
              style={[{
                height: 200,
                width: 100
              }, basicStyles.shadow]}
            />
            <View paddingLeft={4} paddingTop={8}>
              <Text
                fontFamily={FontLXGW}
              >{book.title}</Text>
              <Text
                fontFamily={FontLXGW}
                fontSize='sm'
              >{book.author}</Text>
            </View>
          </View>
        ) : null}

      </View>
    </ScrollView>
  )
}

export default ClippingPage