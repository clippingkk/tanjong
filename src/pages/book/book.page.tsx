import { CachedImage } from '@georstat/react-native-image-cache'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { BlurView } from '@react-native-community/blur'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Button, Center, Divider, ScrollView, Text, View } from 'native-base'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData, useColorScheme } from 'react-native'
import { uidAtom } from '../../atomic'
import BookHead from '../../components/book/head'
import ClippingCell from '../../components/clipping/cell'
import Page from '../../components/page'
import BookShareView from '../../components/shares/book.share'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { useImagePrimaryColor } from '../../hooks/image'
import { RouteParamList } from '../../routes'
import { useBookQuery } from '../../schema/generated'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'
import BookPageRightButton from './bookpage-right-buttons'

type BookPageProps = NativeStackScreenProps<RouteParamList, 'Book'>

function BookPage(props: BookPageProps) {
  const cs = useColorScheme()
  const book = props.route.params.book
  const uid = useAtomValue(uidAtom)

  const bsr = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['50%', '70%'], []);
  useEffect(() => {
    props.navigation.setOptions({
      title: book.title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
      headerRight(props) {
        return (
          <Button
            variant='ghost'
            size='xs'
            onPress={() => {
              bsr.current?.present()
            }}
          >
            <Text> 🌐 </Text>
          </Button>
        )
      }
    })
  }, [cs, props.navigation, book.id, uid])
  const bs = useBookQuery({
    variables: {
      id: book.doubanId,
      pagination: {
        limit: 10,
        offset: 0
      }
    }
  })
  // const primaryColor = useImagePrimaryColor(book.image)
  const [atEnd, setAtEnd] = useState(false)

  const onReachedEnd = useCallback(() => {
    if (atEnd) {
      return
    }
    const allLength = bs.data?.book.clippings.length ?? 0
    return bs.fetchMore({
      variables: {
        id: book.doubanId,
        pagination: {
          limit: 10,
          offset: allLength
        }
      }
    }).then(res => {
      if (
        res.data.book.clippings.length < 10
      ) {
        setAtEnd(true)
      }
    })
  }, [book.doubanId, bs.fetchMore, bs.data?.book.clippings.length, atEnd])

  const itemSizeCellHeight = useClippingCellAvgHeight(bs.data?.book.clippings ?? [])


  if ((bs.data?.book.clippingsCount ?? 0) === 0) {
    return <Page><View /></Page>
  }

  return (
    <BottomSheetModalProvider>
      <Page>
        <FlashList
          ListHeaderComponent={() => (
            <BookHead book={book} />
          )}
          onRefresh={() => bs.refetch()}
          refreshing={bs.loading}
          data={bs.data?.book.clippings ?? []}
          renderItem={({ item }) => {
            return <ClippingCell clipping={item} />
          }}
          ListEmptyComponent={(
            <View>
              <Text>
                empty
              </Text>
            </View>
          )}
          estimatedItemSize={itemSizeCellHeight}
          onEndReached={onReachedEnd}
          onEndReachedThreshold={1}
          ListFooterComponent={(
            <View width='100%' height={0} />
          )}
          ItemSeparatorComponent={() => (
            <View height={4} />
          )}
        />
      </Page>
      <BottomSheetModal
        ref={bsr}
        index={1}
        snapPoints={snapPoints}
      >
        <BookShareView
          bookID={book.id}
          bookDBID={book.doubanId}
          uid={uid}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

export default BookPage