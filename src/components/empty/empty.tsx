import { Text, View } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'

type EmptyBoxProps = {
}

function EmptyBox(props: EmptyBoxProps) {
  const { t } = useTranslation()
  return (
    <View flex={1} justifyContent='center' bg='gray.200' _dark={{ bg: 'gray.800' }}>
      <Text textAlign='center' fontSize='6xl'>
        😔
      </Text>
      <Text textAlign='center' p={2}>
        {t('app.home.emptyFullTip')}
      </Text>
    </View>

  )
}

export default EmptyBox