import { useNavigation } from '@react-navigation/native'
import { useSetAtom } from 'jotai'
import jwtDecode from 'jwt-decode'
import { View, Text, Toast } from 'native-base'
import React, { useCallback, useEffect } from 'react'
import { ActivityIndicator, Linking, StyleSheet } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'
import { tokenAtom, uidAtom } from '../../atomic'
import Page from '../../components/page'
import { usePostAuth } from '../../hooks/auth'
import { JwtPayload } from '../../service/jwt'
import { updateLocalToken } from '../../utils/apollo'
import AuthLegacyPage from './auth.legacy.page'

type AuthQRCodePageProps = {
}

function AuthQRCodePage(props: AuthQRCodePageProps) {
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

  const onPostAuth = usePostAuth()

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
        <AuthLegacyPage />
      </Page>
    )
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
    />
  )
}

export default AuthQRCodePage