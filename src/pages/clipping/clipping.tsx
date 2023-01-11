import { CachedImage } from '@georstat/react-native-image-cache'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Divider, ScrollView, Text, View } from 'native-base'
import React, { useEffect, useMemo, useState } from 'react'
import ImageColors from 'react-native-image-colors'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteParamList } from '../../routes'
import { Clipping, useFetchClippingQuery } from '../../schema/generated'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>

function ClippingPage(props: ClippingPageProps) {
  const navigate = useNavigation()
  const { id, bookID, content, title } = props.route.params.clipping
  useEffect(() => {
    if (!title) {
      return
    }
    navigate.setOptions({
      title: title
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
  const [bookImagePrimaryColor, setBookImagePrimaryColor] = useState<string | null>(null)
  useEffect(() => {
    if (!book) {
      return
    }

    ImageColors.getColors(book.image).then(res => {
      if (res.platform === 'android') {
        setBookImagePrimaryColor(res.vibrant!)
        return
      }
      if (res.platform === 'ios') {
        setBookImagePrimaryColor(res.primary!)
      }
    })
  }, [books.data?.books])

  console.log(bookImagePrimaryColor)
  return (
    <ScrollView>
      <View padding={4}>
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
              style={{
                height: 200,
                width: 100
              }}
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