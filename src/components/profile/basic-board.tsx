import { CachedImage } from '@georstat/react-native-image-cache'
import { BlurView } from '@react-native-community/blur'
import { useHeaderHeight } from '@react-navigation/elements'
import { Avatar, Text, View } from 'native-base'
import { baseFontSize } from 'native-base/lib/typescript/theme/tools'
import React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { User } from '../../schema/generated'
import { basicStyles } from '../../styles/basic'
import { getValidImageUrl } from '../../utils/image'

type BasicBoardProps = {
  profile?: Pick<User, 'id' | 'name' | 'avatar' | 'bio'>
}

function BasicBoard(props: BasicBoardProps) {
  const hh = useHeaderHeight()
  const cs = useColorScheme()

  if (!props.profile) {
    return null
  }
  const avatar = getValidImageUrl(props.profile?.avatar)
  return (
    <View
      paddingTop={hh}
      marginBottom={2}
    >
      <CachedImage
        source={avatar!}
        resizeMode='cover'
        style={basicStyles.absolute}
      />
      <BlurView
        style={basicStyles.absolute}
        blurType={cs!}
        blurAmount={30}
        reducedTransparencyFallbackColor="white"
      />
      <View
        margin={8}
        height='32'
      >
        <BlurView
          style={[
            basicStyles.absolute,
            basicStyles.shadow,
            {
              borderRadius: 8,
            }]}
          blurType={cs!}
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={basicStyles.absolute}
        >
          <View
            flexDirection='row'
            justifyContent='center'
            alignItems='center'
            paddingTop={2}
            paddingBottom={2}
          >
            <View
              alignItems='center'
              justifyContent='center'
              marginRight={2}
            >
              <CachedImage
                source={avatar!}
                resizeMode='cover'
                style={{
                  width: 50,
                  height: 50,
                  overflow: 'hidden',
                  borderRadius: 50
                }}
              />
            </View>
            <View justifyContent='center' alignItems='center'>
              <Text
                fontSize='xs'
                color='gray.900'
                _dark={{
                  color: 'gray.100'
                }}
              >{props.profile.name}</Text>
            </View>
          </View>
          <View paddingLeft={4}>
            <Text
              fontSize='xs'
              color='gray.900'
              _dark={{
                color: 'gray.100'
              }}
            >{props.profile.bio}</Text>
          </View>

        </View>
      </View>
    </View>
  )
}

export default BasicBoard