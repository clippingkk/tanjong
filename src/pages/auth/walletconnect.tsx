import React, { useEffect } from 'react'
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native"
import { Button, Text, View } from "native-base"
import { useAuthByWeb3LazyQuery } from '../../schema/generated'
import MetamaskLogo from '../../assets/metamask.svg'

const projectId = '9fe448bf21605075b9188f49682f63c1' // see https://cloud.walletconnect.com/

const providerMetadata = {
  name: 'clippingkk',
  description: 'Clippings Syncing',
  url: 'https://clippingkk.annatarhe.com',
  icons: ['https://clippingkk.annatarhe.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.dc62551a.png&w=96&q=75'],
  redirect: {
    native: 'clippingkk://',
    universal: 'clippingkk.annatarhe.com'
  }
}
type WalletConnectLoginButtonProps = {
  onLoggedIn: (token: string, uid: number) => Promise<any>
}
const LoginWelcomeText = 'Welcome to the ClippingKK~ \n It`s your nonce: '

function WalletConnectLoginButton(props: WalletConnectLoginButtonProps) {
  const { onLoggedIn } = props
  const { open, isConnected, address, provider } = useWalletConnectModal()
  const handleButtonPress = async () => {
    return open()
  }

  const [doAuth] = useAuthByWeb3LazyQuery({
    onCompleted(data) {
      onLoggedIn(data.loginByWeb3.token, data.loginByWeb3.user.id)
    },
  })

  useEffect(() => {
    if (!isConnected || !provider || !address) {
      return
    }
    ; (async function () {
      const nonce = Date.now()
      const text = LoginWelcomeText + nonce
      const msg = text;
      try {
        const signature = await provider.request<string>({
          method: 'personal_sign',
          params: [msg, address],
        })
        await doAuth({
          variables: {
            payload: {
              address,
              signature,
              text
            }
          }
        })
      } catch (e) {
        console.error(e)
      } finally {
        provider.disconnect()
      }
    })()
  }, [isConnected, provider, address])

  return (
    <View>
      <Button onPress={handleButtonPress}>
        <MetamaskLogo width={20} height={20} />
        <Text>
          Login
        </Text>
      </Button>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </View>
  )
}

export default WalletConnectLoginButton