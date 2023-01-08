import { MMKV } from "react-native-mmkv"

export const storageAuthKeys = 'athena:auth:keys'
export type AuthKeys = {
  email: string
  password: string
}

export const storage = new MMKV({
  id: 'ck_global',
  encryptionKey: 'ck_tanjong',
})
