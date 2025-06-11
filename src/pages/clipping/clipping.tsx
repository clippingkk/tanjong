import {CachedImage} from '@georstat/react-native-image-cache'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useAtomValue} from 'jotai'
import React, {useEffect, useMemo, useRef} from 'react'
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {BlurView, BlurViewProps} from '@react-native-community/blur'
import ActionSheet, {
  ActionSheetRef,
  useScrollHandlers
} from 'react-native-actions-sheet'
import {useNavigation} from '@react-navigation/native'

import {uidAtom} from '../../atomic'
import UTPShareView from '../../components/shares/utp.share'
import {useSingleBook} from '../../hooks/wenqu'
import {RouteParamList} from '../../routes'
import {useFetchClippingQuery} from '../../schema/generated'
import {UTPService} from '../../service/utp'
import {FontLXGW} from '../../styles/font'
import Actions from './actions' // Assuming Actions component is styled or will be handled separately

type ClippingPageProps = NativeStackScreenProps<RouteParamList, 'Clipping'>

const lightColors = {
  gradient: ['#E0EAFC', '#CFDEF3'], // Light Blue to Soft Blue
  textPrimary: '#1A202C', // Dark Gray
  textSecondary: '#4A5568', // Medium Gray
  cardBackground: 'rgba(255, 255, 255, 0.7)',
  blurType: (Platform.OS === 'ios'
    ? 'xlight'
    : 'light') as BlurViewProps['blurType'],
  iconColor: '#2D3748',
  separator: 'rgba(0,0,0,0.1)'
} as const

const darkColors = {
  gradient: ['#1A202C', '#2D3748'], // Dark Gray to Slightly Lighter Dark Gray
  textPrimary: '#E2E8F0', // Light Gray
  textSecondary: '#A0AEC0', // Medium Light Gray
  cardBackground: 'rgba(45, 55, 72, 0.7)', // Semi-transparent Dark Gray
  blurType: (Platform.OS === 'ios'
    ? 'dark'
    : 'dark') as BlurViewProps['blurType'],
  iconColor: '#CBD5E0',
  separator: 'rgba(255,255,255,0.1)'
} as const

function ClippingPage(props: ClippingPageProps) {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const currentColors = isDarkMode ? darkColors : lightColors

  const paramClipping = props.route.params.clipping
  const cid = props.route.params.clippingID
  const id = paramClipping?.id ?? cid

  const bsr = useRef<ActionSheetRef>(null)
  const uid = useAtomValue(uidAtom)

  const {data, loading, refetch} = useFetchClippingQuery({
    variables: {id: id!},
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
      headerTransparent: true,
      headerBlurEffect: isDarkMode ? 'dark' : 'light',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => bsr.current?.show()}
          style={styles.headerButton}>
          <Text style={{color: currentColors.iconColor, fontSize: 24}}>🌐</Text>
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: currentColors.textPrimary,
        fontFamily: FontLXGW
      },
      headerTintColor: currentColors.iconColor // For back button
    })
  }, [pageTitle, navigation, isDarkMode, currentColors])

  const booksResult = useSingleBook(bookID)
  const book = useMemo(() => {
    const bks = booksResult.data?.books
    return bks && bks.length > 0 ? bks[0] : null
  }, [booksResult.data?.books])

  if (loading && !content) {
    return (
      <LinearGradient
        colors={currentColors.gradient as unknown as string[]}
        style={styles.flexGrow}>
        <BlurView
          style={styles.absoluteFill}
          blurType={currentColors.blurType}
          blurAmount={20}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.textPrimary} />
          <Text
            style={[styles.loadingText, {color: currentColors.textPrimary}]}>
            Loading Clipping...
          </Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient
      colors={currentColors.gradient as unknown as string[]}
      style={styles.flexGrow}>
      <BlurView
        style={styles.absoluteFill}
        blurType={currentColors.blurType}
        blurAmount={Platform.OS === 'ios' ? 25 : 5}
      />
      <SafeAreaView style={styles.flexGrow}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refetch({id: id!})}
              tintColor={currentColors.textPrimary}
            />
          }>
          {content && (
            <View
              style={[
                styles.contentCard,
                {backgroundColor: currentColors.cardBackground}
              ]}>
              <Text
                style={[
                  styles.contentText,
                  {color: currentColors.textPrimary, fontFamily: FontLXGW}
                ]}
                selectable>
                {content}
              </Text>
            </View>
          )}

          {content && <Actions clipping={remoteClipping} />}

          {book && (
            <View
              style={[
                styles.bookInfoCard,
                {
                  backgroundColor: currentColors.cardBackground,
                  borderColor: currentColors.separator
                }
              ]}>
              <CachedImage
                source={book.image}
                style={styles.bookImage}
                resizeMode="cover"
              />
              <View style={styles.bookTextContainer}>
                <Text
                  style={[
                    styles.bookTitle,
                    {color: currentColors.textPrimary, fontFamily: FontLXGW}
                  ]}
                  selectable>
                  {book.title}
                </Text>
                <Text
                  style={[
                    styles.bookAuthor,
                    {color: currentColors.textSecondary, fontFamily: FontLXGW}
                  ]}
                  selectable>
                  {book.author}
                </Text>
              </View>
            </View>
          )}
          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>

      <ActionSheet
        ref={bsr}
        containerStyle={{backgroundColor: currentColors.cardBackground}}
        indicatorStyle={{backgroundColor: currentColors.separator}}
        gestureEnabled={true}>
        {book ? (
          <UTPShareView
            kind={UTPService.clipping}
            bookID={book.id}
            bookDBID={book.doubanId}
            cid={id}
            uid={uid}
            isDarkMode={isDarkMode}
            // scrollHandler={scrollHandlers} // scrollHandlers from react-native-actions-sheet are for internal scrollviews
          />
        ) : (
          <View style={styles.emptyActionSheet}>
            <Text style={{color: currentColors.textSecondary}}>
              No share options available.
            </Text>
          </View>
        )}
      </ActionSheet>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  flexGrow: {
    flex: 1
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
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
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500'
  },
  bookInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15
  },
  bookTextContainer: {
    flex: 1
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
    height: 100 // To ensure content can scroll above ActionSheet snap point
  },
  emptyActionSheet: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150
  }
})

export default ClippingPage
