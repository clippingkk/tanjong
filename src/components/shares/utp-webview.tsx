import React, { useCallback, useRef, useState } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import { captureRef } from "react-native-view-shot"
import WebView from 'react-native-webview'
import { sleep } from '../../utils/time';
import { PageLoadedEvent, useWebViewMessageHandler } from '../../hooks/webview';

type UTPWebviewProps = {
  url: string
  onGetImage: (imageTempFile: string) => void
}

function UTPWebview(props: UTPWebviewProps) {
  const { url, onGetImage } = props
  const ref = useRef()
  const s = useWindowDimensions()

  const [size, setSize] = useState({ width: 375 - 30, height: 2000 })

  const onPageLoaded = useCallback( async (ev: PageLoadedEvent) => {
    setSize({ width: ev.width, height: ev.height })
    // wait for webview resize
    await sleep(100)
    const st = await captureRef(ref, {
      format: "png",
      quality: 0.9,
      result: 'tmpfile'
    })
    onGetImage(st)
  }, [ref, onGetImage])

  const onWebViewMessage = useWebViewMessageHandler(onPageLoaded)

  return (
    <ScrollView
      ref={ref as any}
    >
      <WebView
        style={size}
        scalesPageToFit
        source={{
          uri: url
        }}
        onMessage={onWebViewMessage}
        onError={e => {
          console.log(e)
        }}
      />
    </ScrollView>
  )
}

export default UTPWebview