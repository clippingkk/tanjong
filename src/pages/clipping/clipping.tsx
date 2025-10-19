import { CachedImage } from '@georstat/react-native-image-cache'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAtomValue } from 'jotai'
import React, { useEffect, useMemo, useRef } from 'react'
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ActionSheet, {
  ActionSheetRef,
  useScrollHandlers
} from 'react-native-actions-sheet'
import { useNavigation } from '@react-navigation/native'

import { uidAtom } from '../../atomic'
import UTPShareView from '../../components/shares/utp.share'
import { useSingleBook } from '../../hooks/wenqu'
import { RouteParamList } from '../../routes'
import { useFetchClippingQuery } from '../../schema/generated'
import { UTPService } from '../../service/utp'
import { FontLXGW } from '../../styles/font'
import Actions from './actions'
import { GradientBackground, Card, SectionHeader } from '../../components/ui'

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>


function ClippingPage(props: ClippingPageProps) {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'

  const paramClipping = props.route.params.clipping
  const cid = props.route.params.clippingID
  const id = paramClipping?.id ?? cid

  const bsr = useRef<ActionSheetRef>(null)
  const uid = useAtomValue(uidAtom)

  const { data, loading, refetch } = useFetchClippingQuery({
    variables: { id: id! },
    skip: !id
  })

  const remoteClipping = data?.clipping
  const bookID = paramClipping?.bookID ?? remoteClipping?.bookID
  const content = paramClipping?.content ?? remoteClipping?.content
  const pageTitle = paramClipping?.title ?? remoteClipping?.title ?? 'Clipping'
  console.log('pageTitle', pageTitle, paramClipping, remoteClipping, props)

  const scrollHandlers = useScrollHandlers()

  useEffect(() => {
    navigation.setOptions({
      title: pageTitle,
      headerBlurEffect: isDarkMode ? 'dark' : 'light',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => bsr.current?.show()}
          style={styles.headerButton}>
          <Text style={{ fontSize: 20 }}>🌐</Text>
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontFamily: FontLXGW
      }
    })
  }, [pageTitle, navigation, isDarkMode])

  const booksResult = useSingleBook(bookID)
  const book = useMemo(() => {
    const bks = booksResult.data?.books
    return bks && bks.length > 0 ? bks[0] : null
  }, [booksResult.data?.books])

  if (loading && !content) {
    return (
      <GradientBackground blur blurAmount={20}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
          <Text
            style={[styles.loadingText, { color: isDarkMode ? '#E2E8F0' : '#1E293B', fontFamily: FontLXGW }]}>
            Loading Clipping...
          </Text>
        </View>
      </GradientBackground>
    )
  }

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refetch({ id: id! })}
            tintColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
          />
        }>
        <SafeAreaView style={styles.flexGrow}>
          {content && (
            <Card variant="elevated" style={styles.contentCard}>
              <Text
                style={[
                  styles.contentText,
                  { color: isDarkMode ? '#E2E8F0' : '#1E293B', fontFamily: FontLXGW }
                ]}
                selectable>
                {content}
              </Text>
            </Card>
          )}

          {content && (
            <View style={styles.actionsContainer}>
              <Actions clipping={remoteClipping} />
            </View>
          )}

          {book && (
            <>
              <SectionHeader
                title="From the book"
                subtitle="Source of this highlight"
              />
              <Card variant="glass" style={styles.bookInfoCard}>
                <CachedImage
                  source={book.image}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
                <View style={styles.bookTextContainer}>
                  <Text
                    style={[
                      styles.bookTitle,
                      { color: isDarkMode ? '#E2E8F0' : '#1E293B', fontFamily: FontLXGW }
                    ]}
                    selectable>
                    {book.title}
                  </Text>
                  <Text
                    style={[
                      styles.bookAuthor,
                      { color: isDarkMode ? '#94A3B8' : '#64748B', fontFamily: FontLXGW }
                    ]}
                    selectable>
                    {book.author}
                  </Text>
                </View>
              </Card>
            </>
          )}
          <View style={styles.spacer} />
        </SafeAreaView>
      </ScrollView>

      <ActionSheet
        ref={bsr}
        containerStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }}
        indicatorStyle={{ backgroundColor: isDarkMode ? '#475569' : '#CBD5E0' }}
        gestureEnabled={true}>
        {book ? (
          <UTPShareView
            kind={UTPService.clipping}
            bookID={book.id}
            bookDBID={book.doubanId}
            cid={id}
            uid={uid}
            isDarkMode={isDarkMode}
          />
        ) : (
          <View style={styles.emptyActionSheet}>
            <Text style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>
              No share options available.
            </Text>
          </View>
        )}
      </ActionSheet>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  flexGrow: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FontLXGW
  },
  scrollView: {
    flex: 1
  },
  scrollContentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 100 // Adjust for transparent header
  },
  headerButton: {
    paddingHorizontal: 10
  },
  contentCard: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400'
  },
  bookInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 20,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15
  },
  bookTextContainer: {
    flex: 1,
    paddingRight: 12
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5
  },
  bookAuthor: {
    fontSize: 14
  },
  spacer: {
    height: 100
  },
  emptyActionSheet: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150
  },
  actionsContainer: {
    marginBottom: 20,
  }
})

export default ClippingPage
