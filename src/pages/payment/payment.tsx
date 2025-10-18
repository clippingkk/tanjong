import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useStripe } from '@stripe/stripe-react-native'
import { useMutation } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { Button, Text, Toast } from 'native-base'
import React, { useCallback, useEffect, useRef } from 'react'
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uidAtom } from '../../atomic'
import Page from '../../components/page'
import { RouteKeys, RouteParamList } from '../../routes'
import { getPaymentSheet, StripeError } from '../../service/payment'

type PaymentPageProps = NativeStackScreenProps<RouteParamList, RouteKeys.Payment>

type DoPaymentParamsResponse = Awaited<ReturnType<typeof getPaymentSheet>>


// TODO: add subscription
// https://github.com/stripe/stripe-react-native/issues/777
function PaymentPage(props: PaymentPageProps) {

  const uid = useAtomValue(uidAtom)
  // const p = useProfileQuery({
  //   variables: {
  //     id: uid ?? -1
  //   },
  //   skip: uid === null
  // })

  useEffect(() => {

  }, [])

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { mutateAsync: doPayment } = useMutation({
    mutationKey: ['clippingkk', 'user', 'payment'],
    mutationFn: () => getPaymentSheet(),
    onError(err: Error) {
      if (err.message) {
        const exp: StripeError = JSON.parse(err.message)
        Toast.show({
          title: `${exp.code}: ${exp.message}`
        })
        return
      }
      Toast.show({
        title: err.message
      })
    },
  })

  const gotoPay = useCallback(async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      return
    }
    Alert.alert('Success', 'Your order is confirmed!');
    // TODO:
    // confetti
  }, [])

  useEffect(() => {
    (async function () {
      if (!uid) {
        return
      }
      let paymentInitResult: DoPaymentParamsResponse
      try {
        paymentInitResult = await doPayment();
        if (!paymentInitResult) {
          console.log('got notting')
          return
        }
      } catch (e) {
        console.log('got error', e)
        Toast.show({
          title: 'err'
        })
        return
      }

      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = paymentInitResult;


      const { error } = await initPaymentSheet({
        merchantDisplayName: "Clippingkk",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        applePay: {
          merchantCountryCode: 'HK',
        },
        // returnURL: `clippingkk:///dash/${uid}/pay-success?sku=sku22`,
        defaultBillingDetails: {},
      });
      if (error) {
        Toast.show({ title: error.message })
      }
    })()
  }, [uid])

  return (
    <Page>
      <SafeAreaView>
        <Button
          onPress={gotoPay}
        >
          <Text>
            Pay
          </Text>
        </Button>
      </SafeAreaView>
    </Page>
  )
}

export default PaymentPage