import { NativeStackScreenProps } from '@react-navigation/native-stack'
import jwtDecode from 'jwt-decode'
import { View, Text, Toast } from 'native-base'
import React, {  useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, SafeAreaView, StyleSheet } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'
import Page from '../../components/page'
import { usePostAuth } from '../../hooks/auth'
import { RouteParamList } from '../../routes'
import { JwtPayload } from '../../service/jwt'
import AuthLegacyPage from './auth.legacy.page'

type AuthQRCodePageProps = NativeStackScreenProps<RouteParamList, 'AuthQRCode'>

function AuthQRCodePage(props: AuthQRCodePageProps) {
  const { t } = useTranslation()
  useEffect(() => {
    Camera.getCameraPermissionStatus().then(p => {
      if (p === 'denied' || p === 'restricted') {
        Linking.openSettings()
      }
    })
  }, [])

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS], {
    checkInverted: true,
  });

  const devices = useCameraDevices()
  const device = devices.back

  const onPostAuth = usePostAuth(props.navigation)

  useEffect(() => {
    if (!barcodes || barcodes.length === 0) {
      return
    }

    const barcode = barcodes[0]
    if (!barcode.rawValue) {
      return
    }
    try {
      const decodedValue = jwtDecode<JwtPayload>(barcode.rawValue)
      if (!decodedValue.id) {
        return
      }
      onPostAuth(barcode.rawValue, ~~decodedValue.id)
        .catch(err => {
          console.error(err)
        })
    } catch (e) {
      // do nothing....
      console.error(e)
    }
  }, [barcodes, onPostAuth])

  if (device == null) {
    return (
      <Page>
        <SafeAreaView>
          <AuthLegacyPage navigation={props.navigation} route={props.route} />
        </SafeAreaView>
      </Page>
    )
  }

  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View flex={1} alignItems='center' justifyContent='space-between'>
          <View alignItems='center'>
            <Text>{t('app.auth.loginByScanQRCodeTip')}</Text>
          </View>
          <View w='sm' h='sm' borderColor='green.400' borderWidth={3} />
          <View>
            <Text>{t('app.auth.loginByScanQRCode')}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

export default AuthQRCodePage