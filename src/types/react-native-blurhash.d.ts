declare module 'react-native-blurhash' {
  import { Component } from 'react'
  import { ImageProps, ViewStyle, StyleProp } from 'react-native'

  export interface BlurhashProps {
    blurhash: string
    width?: number
    height?: number
    punch?: number
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
    style?: StyleProp<ViewStyle>
    decodeWidth?: number
    decodeHeight?: number
    decodeAsync?: boolean
    decodePunch?: number
    onLoadStart?: () => void
    onLoadEnd?: () => void
    onLoadError?: (error: Error) => void
  }

  export class Blurhash extends Component<BlurhashProps> {}
  export default Blurhash
}
