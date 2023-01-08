import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"
import { updateLocalToken } from "../utils/apollo"
import { profileAtom, tokenAtom } from "../atomic"
import { useProfileQuery } from "../schema/generated"
// import SplashScreen from 'react-native-splash-screen'

export function useOnInit() {
  const setProfile = useSetAtom(profileAtom)

  const np = useProfileQuery({
    variables: {
      id: 1,
    }
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