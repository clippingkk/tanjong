import { Constants } from '@stripe/stripe-react-native'
import { useRef, useEffect } from 'react'
import { Toast as ToastType, resolveValue } from 'react-hot-toast/headless'
import { View, Text } from '@gluestack-ui/themed'
import Animated, { FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated'

type ToastProps = {
  t: ToastType
  updateHeight: (height: number) => void
  offset: number
}
function Toast(props: ToastProps) {
  const { t, updateHeight, offset } = props
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: offset,
        zIndex: t.visible ? 9999 : undefined,
        alignItems: 'center',
      }}>
      <View
        onLayout={(event) =>
          updateHeight(event.nativeEvent.layout.height)
        }
        bg='$black'
        sx={{
          _light: {
            backgroundColor: '$coolGray100',
          }
        }}
        mt={70}
        style={{
          // width: 150,
          maxWidth: 300,
          borderRadius: 30,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
        key={t.id}>
        <Text>{t.icon}</Text>
        <Text
          style={{
            color: '#fff',
            padding: 4,
            flex: 1,
            textAlign: 'center',
          }}>
          {resolveValue(t.message, t)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default Toast