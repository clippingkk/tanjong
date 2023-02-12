import { Button, Text, View } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

type LoadingBoxProps = {
  retry?: () => Promise<any>
}

function LoadingBox(props: LoadingBoxProps) {
  const { t } = useTranslation()
  return (
    <View flex={1} justifyContent='center' bg='gray.200' _dark={{ bg: 'gray.800' }}>
      <ActivityIndicator />
      {props.retry ? (
        <View alignItems='center' marginTop={3}>
          <Button w='24' onPress={props.retry}>
            <Text>{t('app.common.retry')}</Text>
          </Button>
        </View>
      ) : null}
    </View>
  )
}

export default LoadingBox