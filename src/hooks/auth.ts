import { useNavigation } from "@react-navigation/native"
import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { tokenAtom, uidAtom } from "../atomic"
import { updateLocalToken } from "../utils/apollo"

export function usePostAuth() {
  const setToken = useSetAtom(tokenAtom)
  const setUid = useSetAtom(uidAtom)
  const nav = useNavigation()

  return useCallback((token: string, uid: number) => {
    setToken(token)
    updateLocalToken(token)
    setUid(uid)
    nav.goBack()
  }, [setToken, setUid, nav])
}
