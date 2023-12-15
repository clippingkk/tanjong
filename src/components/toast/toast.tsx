import { Toast as ToastData, ToastType, resolveValue } from 'react-hot-toast/headless'
import { View, Text, Icon, CheckCircleIcon, CloseCircleIcon } from '@gluestack-ui/themed'
import Animated, { FadeInUp, FadeOutUp, useSharedValue, withSpring } from 'react-native-reanimated'
import { useEffect } from 'react'

type ToastProps = {
  t: ToastData
  updateHeight: (height: number) => void
  offset: number
}

type ToastConfig = {
  icon: React.ReactElement
  bg: {
    _light: string
    _dark: string
  },
  text: {
    _light: string
    _dark: string
  }
}

const toastConfig: Record<ToastType, ToastConfig> = {
  success: {
    icon: <Icon as={CheckCircleIcon} color='$green600' />,
    bg: {
      _light: '$green400',
      _dark: '$green500',
    },
    text: {
      _dark: '$white',
      _light: '$black',
    }
  },
  error: {
    icon: <Icon as={CloseCircleIcon} color='$red600' />,
    bg: {
      _light: '$red400',
      _dark: '$red500',
    },
    text: {
      _dark: '$white',
      _light: '$black',
    }
  },
  loading: {
    icon: <Icon as={CheckCircleIcon} color='$green500' />,
    bg: {
      _light: '$blue600',
      _dark: '$blue400',
    },
    text: {
      _dark: '$white',
      _light: '$black',
    }
  },
  blank: {
    icon: <Icon as={CheckCircleIcon} color='$green500' />,
    bg: {
      _light: '$blue600',
      _dark: '$blue400',
    },
    text: {
      _dark: '$white',
      _light: '$black',
    }
  },
  custom: {
    icon: <Icon as={CheckCircleIcon} color='$green500' />,
    bg: {
      _light: '$blue600',
      _dark: '$blue400',
    },
    text: {
      _dark: '$white',
      _light: '$black',
    }
  }
}

function Toast(props: ToastProps) {
  const { t, updateHeight, offset } = props
  const baseConfig = toastConfig[t.type]
  const bgColor = baseConfig.bg
  const textColor = baseConfig.text

  const animatedOffset = useSharedValue(0)
  useEffect(() => {
    animatedOffset.value = withSpring(offset)
  }, [offset])

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: animatedOffset,
        zIndex: t.visible ? 9999 : undefined,
        alignItems: 'center',
      }}>
      <View
        onLayout={(event) =>
          updateHeight(event.nativeEvent.layout.height)
        }
        bg={bgColor._dark}
        sx={{
          _light: {
            backgroundColor: bgColor._light,
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
        <View
          flex={1}
          alignItems='center'
          justifyContent='center'
          flexDirection='row'
        >
          {baseConfig.icon}
          <Text
            textAlign='center'
            p={'$1'}
            color={textColor._dark}
            fontSize={'$sm'}
            sx={{
              _light: {
                color: textColor._light
              }
            }}
          >
            {resolveValue(t.message, t)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default Toast