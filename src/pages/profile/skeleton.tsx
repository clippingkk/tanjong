import { VStack, View } from '@gluestack-ui/themed'
import React, { useMemo } from 'react'
import { Dimensions, SafeAreaView } from 'react-native'
import PulseBox from '../../components/pulse-box/pulse-box'

type ProfilePageSkeletonProps = {
}

function ProfilePageSkeleton(props: ProfilePageSkeletonProps) {
  const width = useMemo(() => {
    return Dimensions.get('screen').width - 8 * 2
  }, [])
  return (
    <View
      sx={{ _dark: { backgroundColor: '$coolGray900' } }}
    >
      <SafeAreaView>
        <VStack mt={20}>
          <View mb={8}>
            <PulseBox height={160} width={width} marginLeft={8} radius={4} />
          </View>
          <VStack rowGap={8}>
            {new Array(4).fill(0).map((_, index) => (
              <PulseBox
                key={index}
                height={180}
                width={width - 8 * 2}
                marginLeft={8 * 2}
                radius={4}
              />
            ))}
          </VStack>
        </VStack>
      </SafeAreaView>
    </View>
  )
}

export default ProfilePageSkeleton