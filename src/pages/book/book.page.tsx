import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import { Center, Spinner, Text } from '@gluestack-ui/themed'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { uidAtom } from '../../atomic'
import BookHead from '../../components/book/head'
import ClippingCell from '../../components/clipping/cell'
import Page from '../../components/page'
import UTPShareView from '../../components/shares/utp.share'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { RouteParamList } from '../../routes'
import { useBookQuery } from '../../schema/generated'
import { UTPService } from '../../service/utp'
import ActionSheet, { ActionSheetRef, useScrollHandlers } from 'react-native-actions-sheet'
import { VStack, View, Button } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native'
import PulseBox from '../../components/pulse-box/pulse-box'

type BookPageProps = NativeStackScreenProps<RouteParamList, 'Book'>

function BookPage(props: BookPageProps) {
  const cs = useColorScheme()
  const book = props.route.params.book
  const uid = useAtomValue(uidAtom)

  const snapPoints = useMemo(() => ['50%', '70%'], []);

  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    props.navigation.setOptions({
      title: book.title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
      headerRight(props) {
        return (
          <Button
            variant='link'
            size='xs'
            onPress={() => {
              // bsr.current?.present()
              actionSheetRef.current?.show()
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

  const scrollHandlers = useScrollHandlers<ScrollView>({
    refreshControlBoundary: 0,
  });

  if (bs.loading) {
    return (
      <View
        sx={{ _dark: { backgroundColor: '$coolGray900' } }}
      >
        <SafeAreaView>
          <VStack
            mt={20}
          >
            <Center mb={8}>
              <PulseBox height={310} width={400} radius={4} />
            </Center>
            <Center>
              <VStack rowGap={8}>
                <PulseBox height={180} width={346} radius={4} />
                <PulseBox height={180} width={346} radius={4} />
                <PulseBox height={180} width={346} radius={4} />
                <PulseBox height={180} width={346} radius={4} />
              </VStack>
            </Center>
          </VStack>
        </SafeAreaView>
      </View>
    )
  }

  if ((bs.data?.book.clippingsCount ?? 0) === 0) {
    return (
      <Page>
        <VStack alignItems='center' mt={'$40'} height={'100%'}>
          <Spinner />
        </VStack>
      </Page>
    )
  }

  return (
    <Page>
      <>
        <FlashList
          ListHeaderComponent={() => (
            <BookHead book={book} />
          )}
          onRefresh={() => bs.refetch()}
          refreshing={bs.loading}
          data={bs.data?.book.clippings}
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
        <ActionSheet
          ref={actionSheetRef}
          snapPoints={[80, 90]}
        // backgroundStyle={{ backgroundColor: bg }}
        // style={{
        //   shadowColor: "#000",
        //   shadowOffset: {
        //     width: 0,
        //     height: 12,
        //   },
        //   shadowOpacity: 0.58,
        //   shadowRadius: 16.00,
        //   elevation: 24,
        // }}
        >
          <UTPShareView
            kind={UTPService.book}
            bookID={book.id}
            bookDBID={book.doubanId}
            uid={uid}
            scrollHandler={scrollHandlers}
          />
        </ActionSheet>
      </>
    </Page>
  )
}

export default BookPage