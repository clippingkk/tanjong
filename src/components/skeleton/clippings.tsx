import React from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native';
import PulseBox from '../pulse-box/pulse-box';

const SKELETON_COUNT = 4;

function SkeletonClippingList() {
  const { width } = useWindowDimensions();
  const itemWidth = width - 32; // 16 padding on each side

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {new Array(SKELETON_COUNT).fill(0).map((_, index) => (
          <PulseBox
            key={index}
            height={150} // Approximate height of a ClippingCell
            width={itemWidth}
            radius={16} // Match ClippingCell border radius
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16, // To account for header if any, or just top padding
    gap: 16, // Spacing between skeleton items
  },
});

export default SkeletonClippingList;
