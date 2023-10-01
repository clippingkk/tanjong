import { CachedImage } from '@georstat/react-native-image-cache'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAtomValue } from 'jotai'
import { Button, Divider, ScrollView, Text, useSafeArea, View } from 'native-base'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView as RNScrollView, useColorScheme } from 'react-native'
import { uidAtom } from '../../atomic'
import UTPShareView from '../../components/shares/utp.share'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteParamList } from '../../routes'
import { Clipping, useFetchClippingQuery } from '../../schema/generated'
import { UTPService } from '../../service/utp'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'
import ActionSheet, { ActionSheetRef, useScrollHandlers } from 'react-native-actions-sheet'
import Actions from './actions'

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>

function ClippingPage(props: ClippingPageProps) {
  const cs = useColorScheme()
  const paramClipping = props.route.params.clipping
  const cid = props.route.params.clippingID

  const id = paramClipping?.id ?? cid

  const bsr = useRef<ActionSheetRef>(null);

  const uid = useAtomValue(uidAtom)
  const clippingResult = useFetchClippingQuery({
    variables: {
      id: id!
    }
  })

  const remoteClipping = clippingResult.data?.clipping

  const bookID = paramClipping?.bookID ?? remoteClipping?.bookID
  const content = paramClipping?.content ?? remoteClipping?.content
  const title = paramClipping?.title ?? remoteClipping?.title
  const scrollHandlers = useScrollHandlers<RNScrollView>({
    refreshControlBoundary: 0,
  });

  useEffect(() => {
    if (!title) {
      return
    }
    props.navigation.setOptions({
      title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
      headerRight(props) {
        return (
          <Button
            variant='ghost'
            size='xs'
            onPress={() => {
              bsr.current?.show()
            }}
          >
            <Text> 🌐 </Text>
          </Button>
        )
      }
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
    <>
      <ScrollView
        backgroundColor='gray.100'
        _dark={{ backgroundColor: 'gray.700' }}
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
            paddingTop={20}
            background='dark.500'
            alignItems='center'
            justifyContent='center'
          >
            <ActivityIndicator size={'large'} />
            <Text>Loading</Text>
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

          <Actions clipping={clippingResult.data?.clipping} />

          <Divider marginTop={4} />

          {book ? (
            <View flexDirection='row'>
              <View style={{
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 4,
                borderRadius:100,
              }}>
                <CachedImage
                  source={book.image}
                  style={[{
                    height: 200,
                    width: 100,
                    borderRadius: 800,
                  }, basicStyles.shadow]}
                />
              </View>
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
      {/* TODO: add more actions like goto douban, descriptions */}
      <ActionSheet
        ref={bsr}
        snapPoints={[80, 90]}
      >
        {book ? (
          <UTPShareView
            kind={UTPService.clipping}
            bookID={book.id}
            bookDBID={book.doubanId}
            cid={id}
            uid={uid}
            scrollHandler={scrollHandlers}
          />
        ) : null}
      </ActionSheet>
    </>
  )
}

export default ClippingPage