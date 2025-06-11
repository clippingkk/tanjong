import {Link} from '@react-navigation/native'
import {Text, View} from 'native-base'
import React from 'react'
import {StyleSheet, useColorScheme} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {BlurView, BlurViewProps} from '@react-native-community/blur'
import {RouteKeys} from '../../routes'
import {Clipping} from '../../schema/generated'
import {FontLXGW} from '../../styles/font' // Assuming FontLXGW might be used later or for specific text
import {WenquBook} from '../../service/wenqu'

type ClippingCellProps = {
  clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
  book?: WenquBook
}

const lightColors = {
  gradient: ['#FF6B6B', '#FFD166'], // Lively Coral to Sunny Yellow
  textPrimary: '#222222',
  textSecondary: '#444444',
  textOnPrimaryBg: '#FFFFFF',
  footerText: '#555555',
  blurType: 'light' as BlurViewProps['blurType'],
  cardBorder: 'rgba(0,0,0,0.1)'
} as const

const darkColors = {
  gradient: ['#7B2CBF', '#C71F66'], // Deep Purple to Magenta
  textPrimary: '#FFFFFF',
  textSecondary: '#DDDDDD',
  textOnPrimaryBg: '#FFFFFF',
  footerText: '#BBBBBB',
  blurType: 'dark' as BlurViewProps['blurType'],
  cardBorder: 'rgba(255,255,255,0.2)'
} as const

function ClippingCell(props: ClippingCellProps) {
  const {clipping, book} = props
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const currentColors = isDarkMode ? darkColors : lightColors

  return (
    <View style={styles.outerContainer}>
      <Link
        screen={RouteKeys.Clipping}
        params={{
          clippingId: clipping.id,
          clipping: clipping,
          bookId: clipping.bookID
        }}
        style={styles.linkStyle}>
        <LinearGradient
          colors={currentColors.gradient as unknown as string[]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.cardBase, {borderColor: currentColors.cardBorder}]} // Added borderColor from theme
        >
          <BlurView
            style={styles.absoluteFill}
            blurType={currentColors.blurType}
            blurAmount={15} // Increased blur amount for a more pronounced effect
            reducedTransparencyFallbackColor={
              isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
            }
          />
          <View style={styles.contentOverlay}>
            {/* Header with book info */}
            <View style={styles.headerContainer}>
              <View style={styles.headerTextContainer}>
                <Text
                  style={[
                    styles.titleText,
                    {color: currentColors.textOnPrimaryBg}
                  ]}>
                  {book?.title || clipping.title || 'Untitled Clipping'}
                </Text>
                {/* <Text
                  style={[
                    styles.bookIdText,
                    {color: currentColors.textOnPrimaryBg}
                  ]}>
                  Book: {clipping.bookID}
                </Text> */}
              </View>
            </View>

            {/* Clipping content */}
            <View style={styles.contentContainer}>
              <Text
                style={[
                  styles.contentText,
                  {color: currentColors.textOnPrimaryBg}
                ]}
                numberOfLines={5}
                ellipsizeMode="tail">
                {clipping.content}
              </Text>
            </View>

            {/* Footer with metadata - kept simple */}
            <View style={styles.footerContainer}>
              <Text
                style={[
                  styles.footerText,
                  {color: currentColors.textOnPrimaryBg, opacity: 0.8}
                ]}>
                Page 23
              </Text>
              <Text
                style={[
                  styles.footerText,
                  {color: currentColors.textOnPrimaryBg, opacity: 0.8}
                ]}>
                Chapter 3
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16, // Standardized padding
    paddingVertical: 8
  },
  linkStyle: {
    width: '100%'
  },
  cardBase: {
    borderRadius: 16, // Bolder radius
    overflow: 'hidden',
    elevation: 8, // Android shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1 // Subtle border
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  contentOverlay: {
    // This view sits on top of the BlurView
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.1)', // Slight dimming for text contrast on blur
    flex: 1,
    justifyContent: 'space-between'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  headerTextContainer: {
    flex: 1
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: FontLXGW, // Uncomment if you want to use this font
    marginBottom: 4,
    fontFamily: FontLXGW
  },
  bookIdText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    fontFamily: FontLXGW
  },
  contentContainer: {
    marginVertical: 12
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22, // Improved readability
    fontWeight: '500',
    fontFamily: FontLXGW
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)' // Subtle separator for footer
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FontLXGW
  }
})

export default ClippingCell
