import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { updateLocalToken } from "../utils/apollo"
import { profileAtom, tokenAtom, uidAtom } from "../atomic"
import { useProfileQuery } from "../schema/generated"
// import SplashScreen from 'react-native-splash-screen'

export function useOnInit() {
  const setProfile = useSetAtom(profileAtom)
  const uid = useAtomValue(uidAtom)

  const np = useProfileQuery({
    variables: {
      id: uid!,
    },
    skip: !uid
  })

  useEffect(() => {
    // 同步已登录用户数据
    if (!np.data?.me) {
      return
    }
    setProfile(np.data.me)
  }, [np.data?.me])

  useEffect(() => {
    // SplashScreen.hide()
  }, [])
}