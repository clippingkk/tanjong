import { ProfileQuery } from "./schema/generated"
import { atomWithMMKV } from "./utils/jotai"

export const tokenAtom = atomWithMMKV<string | null>('me:token', null)
export const uidAtom = atomWithMMKV<number | null>('me:uid', null)
export const profileAtom = atomWithMMKV<ProfileQuery['me'] | null>('me:profile', null)