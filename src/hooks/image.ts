import { useState, useEffect } from "react"
import ImageColors from "react-native-image-colors"

export function useImagePrimaryColor(img: string) {
  const [bookImagePrimaryColor, setBookImagePrimaryColor] = useState<string | null>(null)
  useEffect(() => {
    if (!img) {
      return
    }

    ImageColors.getColors(img).then(res => {
      if (res.platform === 'android') {
        setBookImagePrimaryColor(res.vibrant!)
        return
      }
      if (res.platform === 'ios') {
        setBookImagePrimaryColor(res.primary!)
      }
    })
  }, [img])
  return bookImagePrimaryColor
}