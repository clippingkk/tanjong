import { ApolloError } from '@apollo/client'
import { Button, Text, View } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ErrorBoxProps = {
  err: ApolloError
  onRefresh: () => void
}

function ErrorBox(props: ErrorBoxProps) {
  const { t } = useTranslation()
  return (
    <View justifyContent='center' flex={1} alignItems='center'>
      <View height={100}>
      <Text>
        {props.err.message}
      </Text>
      <Button marginTop={4}>
        <Text>{t('app.common.retry')}</Text>
      </Button>
      </View>
    </View>
  )
}

export default ErrorBox