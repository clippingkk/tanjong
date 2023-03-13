import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
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

const clientStorage = {
  setItem: (key: string, value: any) => {
    storage.set(key, value)
    return Promise.resolve()
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return Promise.resolve(value ?? null)
  },
  removeItem: (key: string) => {
    storage.delete(key)
    return Promise.resolve()
  },
};

export const mmkvStoragePersister = createAsyncStoragePersister({
  storage: clientStorage
})