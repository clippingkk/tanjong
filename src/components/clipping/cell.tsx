import {Link} from '@react-navigation/native'
import React from 'react'
import {StyleSheet, useColorScheme, View, Text, TouchableOpacity} from 'react-native'
import {RouteKeys} from '../../routes'
import {Clipping} from '../../schema/generated'
import {FontLXGW} from '../../styles/font'
import {WenquBook} from '../../service/wenqu'
import { useNavigation } from '@react-navigation/native'

type ClippingCellProps = {
  clipping: Pick<Clipping, 'id' | 'bookID' | 'content' | 'title'>
  book?: WenquBook
}

const lightColors = {
  cardBg: 'rgba(255, 255, 255, 0.95)',
  titleText: '#1E293B',
  contentText: '#475569',
  metaText: '#94A3B8',
  cardBorder: 'rgba(99, 102, 241, 0.1)',
  shadowColor: '#6366F1'
} as const

const darkColors = {
  cardBg: 'rgba(30, 41, 59, 0.95)',
  titleText: '#E0E7FF',
  contentText: '#CBD5E1',
  metaText: '#94A3B8',
  cardBorder: 'rgba(99, 102, 241, 0.2)',
  shadowColor: '#6366F1'
} as const

function ClippingCell(props: ClippingCellProps) {
  const {clipping, book} = props
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const colors = isDarkMode ? darkColors : lightColors
  const navigation = useNavigation()

  const handlePress = () => {
    (navigation as any).navigate(RouteKeys.Clipping, {
      clippingId: clipping.id,
      clipping: clipping,
      bookId: clipping.bookID
    })
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.95}
      onPress={handlePress}
      style={styles.touchable}
    >
      <View style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadowColor
        }
      ]}>
        {/* Quote decoration */}
        <View style={styles.quoteMarkContainer}>
          <Text style={[styles.quoteMark, { color: isDarkMode ? '#6366F1' : '#818CF8' }]}>"</Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.clippingText,
              {color: colors.contentText}
            ]}
            numberOfLines={4}
            ellipsizeMode="tail">
            {clipping.content}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.bookInfo}>
            <View style={[styles.bookIndicator, { backgroundColor: isDarkMode ? '#6366F1' : '#818CF8' }]} />
            <Text
              style={[
                styles.bookTitle,
                {color: colors.titleText}
              ]}
              numberOfLines={1}>
              {book?.title || clipping.title || 'Unknown Book'}
            </Text>
          </View>
          {book?.author && (
            <Text
              style={[
                styles.authorText,
                {color: colors.metaText}
              ]}
              numberOfLines={1}>
              {book.author}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 3,
  },
  quoteMarkContainer: {
    position: 'absolute',
    top: -5,
    left: 8,
    opacity: 0.15,
  },
  quoteMark: {
    fontSize: 80,
    fontWeight: '300',
    fontFamily: FontLXGW,
  },
  content: {
    marginTop: 16,
    marginBottom: 20,
  },
  clippingText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    fontFamily: FontLXGW,
    letterSpacing: 0.2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
    paddingTop: 12,
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: FontLXGW,
    flex: 1,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '300',
    fontFamily: FontLXGW,
    marginLeft: 13,
    opacity: 0.8,
  },
})

export default ClippingCell
