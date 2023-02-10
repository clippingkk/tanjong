import { CachedImage } from '@georstat/react-native-image-cache'
import { useHeaderHeight } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Divider, ScrollView, Text, useSafeArea, View } from 'native-base'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, RefreshControl, SafeAreaView, useColorScheme } from 'react-native'
import ImageColors from 'react-native-image-colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteParamList } from '../../routes'
import { Clipping, useFetchClippingQuery } from '../../schema/generated'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>

function ClippingPage(props: ClippingPageProps) {
  const cs = useColorScheme()
  const hh = useHeaderHeight()
  const paramClipping = props.route.params.clipping
  const cid = props.route.params.clippingID

  const id = paramClipping?.id ?? cid

  const clippingResult = useFetchClippingQuery({
    variables: {
      id: id!
    }
  })

  const remoteClipping = clippingResult.data?.clipping

  const bookID = paramClipping?.bookID ?? remoteClipping?.bookID
  const content = paramClipping?.content ?? remoteClipping?.content
  const title = paramClipping?.title ?? remoteClipping?.title

  useEffect(() => {
    if (!title) {
      return
    }
    props.navigation.setOptions({
      title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
    })
  }, [title, props.navigation])

  const books = useSingleBook(bookID)
  const book = useMemo(() => {
    const bks = books.data?.books
    if (!bks || bks.length === 0) {
      return null
    }

    return bks[0]
  }, [books.data?.books])

  return (
    <ScrollView
      backgroundColor='gray.100'
      _dark={{ backgroundColor: 'gray.900' }}
      height='100%'
      refreshControl={(
        <RefreshControl
          refreshing={clippingResult.loading}
          onRefresh={() => clippingResult.refetch({ id: id! })}
        />
      )}
    >
      {!content ? (
        <View
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}
          background='red.500'
          alignItems='center'
          justifyContent='center'
        >
          <ActivityIndicator size={'large'} />
        </View>
      ) : null}
      <View paddingLeft={4} paddingRight={4} height='100%'>
        <SafeAreaView>
          <View pt={8}>
            <Text
              fontFamily={FontLXGW}
              fontSize='lg'
              selectable
            >
              {content}
            </Text>
          </View>
        </SafeAreaView>

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
                selectable
              >{book.title}</Text>
              <Text
                fontFamily={FontLXGW}
                fontSize='sm'
                selectable
              >{book.author}</Text>
            </View>
          </View>
        ) : null}

      </View>
    </ScrollView>
  )
}

export default ClippingPage