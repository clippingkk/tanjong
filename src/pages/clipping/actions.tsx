import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView
} from 'react-native'
import React, {useCallback, useRef} from 'react'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import LinearGradient from 'react-native-linear-gradient'
import {
  FetchClippingQuery,
  useFetchClippingAiSummaryLazyQuery
} from '../../schema/generated'
import {FontLXGW} from '../../styles/font' // Assuming FontLXGW is used for consistent typography

type ActionsProps = {
  clipping?: FetchClippingQuery['clipping']
}

// Consistent color themes, can be imported from a central theme file if available
const lightColors = {
  buttonGradient: ['#FF8C42', '#FFD700'], // Orange to Gold
  buttonText: '#FFFFFF',
  sheetBackground: '#F8F9FA',
  sheetTextPrimary: '#212529',
  sheetTextSecondary: '#495057',
  separator: 'rgba(0,0,0,0.1)',
  activityIndicator: '#FF8C42'
} as const

const darkColors = {
  buttonGradient: ['#BF683A', '#D4A017'], // Darker Orange to Dark Gold
  buttonText: '#FFFFFF',
  sheetBackground: '#2C3E50',
  sheetTextPrimary: '#ECF0F1',
  sheetTextSecondary: '#BDC3C7',
  separator: 'rgba(255,255,255,0.1)',
  activityIndicator: '#FFD700'
} as const

function Actions(props: ActionsProps) {
  const {clipping} = props
  const bsr = useRef<ActionSheetRef>(null)
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const currentColors = isDarkMode ? darkColors : lightColors

  const [doFetchAISummary, {data, loading}] =
    useFetchClippingAiSummaryLazyQuery({
      variables: {
        id: clipping?.id ?? 0
      },
      fetchPolicy: 'network-only' // Ensure fresh data
    })

  const onGetAIDescription = useCallback(() => {
    bsr.current?.show()
    if (!data?.clipping?.aiSummary) {
      // Fetch only if not already loaded or to refresh
      doFetchAISummary()
    }
  }, [doFetchAISummary, data?.clipping?.aiSummary])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onGetAIDescription}
        style={styles.actionButton}>
        <LinearGradient
          colors={currentColors.buttonGradient as unknown as string[]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientBackground}>
          <Text
            style={[
              styles.buttonText,
              {color: currentColors.buttonText, fontFamily: FontLXGW}
            ]}>
            ✨ AI Summary
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ActionSheet
        ref={bsr}
        containerStyle={{
          backgroundColor: currentColors.sheetBackground,
          borderTopLeftRadius: 20, // Add some rounding to the sheet
          borderTopRightRadius: 20
        }}
        indicatorStyle={{backgroundColor: currentColors.separator, width: 60}}
        gestureEnabled={true}
        snapPoints={[60, 90]} // Percentage of screen height
      >
        <View
          style={[
            styles.sheetContainer,
            {paddingBottom: 30 /* For safe area on some devices */}
          ]}>
          <Text
            style={[
              styles.sheetTitle,
              {color: currentColors.sheetTextPrimary, fontFamily: FontLXGW}
            ]}>
            ✨ AI Generated Summary
          </Text>
          <View
            style={[
              styles.separator,
              {backgroundColor: currentColors.separator}
            ]}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={currentColors.activityIndicator}
              />
              <Text
                style={[
                  styles.loadingText,
                  {
                    color: currentColors.sheetTextSecondary,
                    fontFamily: FontLXGW
                  }
                ]}>
                Generating summary...
              </Text>
            </View>
          ) : data?.clipping?.aiSummary ? (
            <ScrollView style={styles.summaryScrollView}>
              <Text
                selectable
                style={[
                  styles.summaryText,
                  {color: currentColors.sheetTextPrimary, fontFamily: FontLXGW}
                ]}>
                {data.clipping.aiSummary}
              </Text>
            </ScrollView>
          ) : (
            <View style={styles.loadingContainer}>
              <Text
                style={[
                  styles.summaryText,
                  {
                    color: currentColors.sheetTextSecondary,
                    fontFamily: FontLXGW,
                    textAlign: 'center'
                  }
                ]}>
                No summary available or failed to load. Try again.
              </Text>
            </View>
          )}
        </View>
      </ActionSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20, // Give some space from content above
    alignItems: 'center', // Center the button
    marginBottom: 10
  },
  actionButton: {
    borderRadius: 25, // Pill shape
    overflow: 'hidden', // Important for LinearGradient border radius
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '80%', // Make button wider but not full width
    maxWidth: 300 // Max width for larger screens
  },
  gradientBackground: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    height: '100%' // Ensure it tries to fill the snap point height
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15
  },
  separator: {
    height: 1,
    width: '100%',
    marginBottom: 20
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14
  },
  summaryScrollView: {
    flex: 1 // Allow scrolling for long summaries
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24
  }
})

export default Actions
