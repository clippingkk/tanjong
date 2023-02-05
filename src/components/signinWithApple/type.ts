import { AndroidSigninResponse, AppleRequestResponse } from "@invertase/react-native-apple-authentication"
import { AppleVerifyPayload } from "../../schema/generated"

export type SigninWithAppleProps = {
  loading?: boolean
  onError?: (err?: any) => void
  onSuccess: (state: AppleVerifyPayload) => Promise<any>
}
