import { useToast } from "native-base";
import { useCallback } from "react";
import { WebViewMessageEvent } from "react-native-webview";

export type PageLoadedEvent = {
  type: 'pageLoaded'
  width: number
  height: number
}


export function useWebViewMessageHandler(handler: (ev: PageLoadedEvent) => void) {

  const toast = useToast()
  return useCallback((ev: WebViewMessageEvent) => {
    const data = ev.nativeEvent.data
    if (!data) {
      return
    }
    let event: PageLoadedEvent
    try {
      event = JSON.parse(data)
    } catch (e: any) {
      console.error(e)
      toast.show({
        title: 'Error: ' + e.message,
      })
      return;
    }

    if (!event) {
      toast.show({
        title: 'Error: Event is not valid',
      })
      return;
    }
    handler(event)
  }, [handler])
}