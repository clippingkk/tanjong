import { CachedImage } from '@georstat/react-native-image-cache'
import { BlurView } from '@react-native-community/blur'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { Center, Divider, ScrollView, Text, View } from 'native-base'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ImageLoadEventData, useColorScheme } from 'react-native'
import BookHead from '../../components/book/head'
import ClippingCell from '../../components/clipping/cell'
import { useClippingCellAvgHeight } from '../../hooks/clipping'
import { useImagePrimaryColor } from '../../hooks/image'
import { RouteParamList } from '../../routes'
import { useBookQuery } from '../../schema/generated'
import { basicStyles } from '../../styles/basic'
import { FontLXGW } from '../../styles/font'

type BookPageProps = NativeStackScreenProps<RouteParamList, 'Book'>

function BookPage(props: BookPageProps) {
  const cs = useColorScheme()
  const book = props.route.params.book
  useEffect(() => {
    props.navigation.setOptions({
      title: book.title,
      headerTransparent: true,
      headerBlurEffect: cs === 'dark' ? 'dark' : 'light',
    })
  }, [cs, props.navigation])
  const hh = useHeaderHeight()
  const bs = useBookQuery({
    variables: {
      id: book.doubanId,
      pagination: {
        limit: 10,
        offset: 0
      }
    }
  })
  const bh = useBottomTabBarHeight()
  // const primaryColor = useImagePrimaryColor(book.image)

  const [loadedImage, setLoadedImage] = useState<ImageLoadEventData['source'] | null>(null)
  const onReachedEnd = useCallback(() => {
    const allLength = bs.data?.book.clippings.length ?? 0
    return bs.fetchMore({
      variables: {
        id: book.id,
        pagination: {
          limit: 10,
          offset: allLength
        }
      }
    })
  }, [book.id, bs.data?.book.clippings.length])

  const ratio = useMemo(() => {
    if (!loadedImage) {
      return 16 / 9
    }
    return loadedImage.width / loadedImage.height
  }, [loadedImage?.height, loadedImage?.width])

  const itemSizeCellHeight = useClippingCellAvgHeight(bs.data?.book.clippings ?? [])

  if ((bs.data?.book.clippingsCount ?? 0) === 0) {
    return null
  }

  return (
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
        <View width='100%' height={bh} />
      )}
      ItemSeparatorComponent={() => (
        <View height={4} />
      )}
    />
  )
}

export default BookPage