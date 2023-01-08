import { useNavigation } from '@react-navigation/native'
import { useSetAtom } from 'jotai'
import jwtDecode from 'jwt-decode'
import { View, Text } from 'native-base'
import React, { useEffect } from 'react'
import { ActivityIndicator, Linking, StyleSheet } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'
import { tokenAtom, uidAtom } from '../../atomic'
import { JwtPayload } from '../../service/jwt'
import { updateLocalToken } from '../../utils/apollo'

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

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const devices = useCameraDevices()
  const device = devices.back
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)
  const nav = useNavigation()

  useEffect(() => {
    if (!barcodes || barcodes.length === 0) {
      return
    }
    const barcode = barcodes[0]
    if (!barcode.rawValue) {
      return
    }
    console.log(barcode, barcode.rawValue)
    const decodedValue = jwtDecode<JwtPayload>(barcode.rawValue)
    if (!decodedValue.id) {
      return
    }
    setToken(barcode.rawValue)
    updateLocalToken(barcode.rawValue)
    setUid(~~decodedValue.id)
    nav.goBack()
  }, [barcodes])

  if (device == null) {
    return (
      <ActivityIndicator />
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