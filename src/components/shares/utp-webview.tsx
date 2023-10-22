import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { captureRef } from "react-native-view-shot"
import WebView from 'react-native-webview'
import { sleep } from '../../utils/time';
import { PageLoadedEvent, useWebViewMessageHandler } from '../../hooks/webview';
import { useQuery } from '@tanstack/react-query';

type UTPWebviewProps = {
  url: string
  onGetImage: (imageTempFile: string) => void
}

function UTPWebview(props: UTPWebviewProps) {
  const { url, onGetImage } = props
  const ref = useRef()

  const [size, setSize] = useState({ width: 375 - 30, height: 2000 })

  const { data, refetch } = useQuery({
    queryKey: ['webview', 'download', url],
    enabled: false,
    queryFn: async () => {
      // wait for webview resize
      // but why so long?
      await sleep(5000)
      return captureRef(ref, {
        format: "png",
        quality: 0.9,
        result: 'tmpfile'
      })
    }
  })
  useEffect(() => {
    if (!data) {
      return
    }
    onGetImage(data)
  }, [data])

  const onPageLoaded = useCallback(async (ev: PageLoadedEvent) => {
    setSize({ width: ev.width, height: ev.height })
    refetch()
    return
  }, [ref, refetch])

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