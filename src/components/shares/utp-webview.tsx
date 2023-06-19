import React, { useRef } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import { captureRef } from "react-native-view-shot"
import WebView from 'react-native-webview'
import { sleep } from '../../utils/time';

type UTPWebviewProps = {
  url: string
  onGetImage: (imageTempFile: string) => void
}

function UTPWebview(props: UTPWebviewProps) {
  const { url, onGetImage } = props
  const ref = useRef()
  const s = useWindowDimensions()

  const onLoadEnd = async () => {
    // TODO: add js bridge to load exactly timing
    await sleep(2000)
    const st = await captureRef(ref, {
      format: "png",
      quality: 0.9,
      result: 'tmpfile'
    })
    onGetImage(st)
  }

  return (
    <ScrollView
      ref={ref as any}
    >
      <WebView
        style={{ width: s.width - 30, height: 2000 }}
        scalesPageToFit
        source={{
          uri: url
        }}
        onLoadEnd={() => {
          onLoadEnd()
        }}
        onError={e => {
          console.log(e)
        }}
      />
    </ScrollView>
  )
}

export default UTPWebview