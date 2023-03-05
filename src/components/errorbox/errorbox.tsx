import { ApolloError } from '@apollo/client'
import { Button, Text, View } from 'native-base'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CKNetworkError } from '../../utils/apollo'

type ErrorBoxProps = {
  err: ApolloError
  onRefresh: () => void
}

function ErrorBox(props: ErrorBoxProps) {
  const { err, onRefresh } = props
  const { t } = useTranslation()

  const errMsg = useMemo(() => {
    const ne = err.networkError as CKNetworkError
    if ((ne.result?.errors.length ?? 0) > 0) {
      return ne.result?.errors[0].message
    }

    return err.message
  }, [err])

  return (
    <View
      alignItems='center'
      flex={1}
      justifyContent='center'
      bg='gray.200'
      _dark={{ bg: 'gray.800' }}>
      <View height={100}>
        <Text>
          {errMsg}
        </Text>
        <Button marginTop={4} onPress={onRefresh}>
          <Text>{t('app.common.retry')}</Text>
        </Button>
      </View>
    </View>
  )
}

export default ErrorBox