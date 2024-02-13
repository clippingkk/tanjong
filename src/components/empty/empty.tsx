import { Text, Button, Divider, View } from '@gluestack-ui/themed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

type EmptyBoxProps = {
}

function EmptyBox(props: EmptyBoxProps) {
  const { t } = useTranslation()

  const onHowTo = () => {
    return Linking.openURL('https://www.bilibili.com/video/BV1Nb41187Lo')
  }
  return (
    <View
      flex={1}
      justifyContent='center'
      bg='$coolGray200'
      sx={{
        _dark: {
          bg: '$coolGray800'
        }
      }}>
      <Text
        pt={'$12'}
        textAlign='center'
        fontSize='$6xl'>
        😔
      </Text>
      <Text textAlign='center' p={'$2'}>
        {t('app.home.emptyFullTip')}
      </Text>
      <Divider my={'$5'} />
      <Button onPress={onHowTo} mx={'$10'}>
        <Text color='white' sx={{ _dark: { color: '$gray200' } }}>
          {t('app.home.howToVideo')}
        </Text>
      </Button>
    </View>
  )
}

export default EmptyBox