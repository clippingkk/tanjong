import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import PulseBox from '../../components/pulse-box/pulse-box';

function ProfilePageSkeleton() {
  return (
    <SafeAreaView style={styles.flexOne}>
      <View style={styles.container}>
        <PulseBox height={98} radius={16} style={{ width: '100%' }} />
        <View style={styles.listContainer}>
          {new Array(4).fill(0).map((_, index) => (
            <PulseBox
              key={index}
              height={120}
              radius={16}
              style={{ width: '100%' }}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    marginTop: 16,
    gap: 16,
  },
});

export default ProfilePageSkeleton;