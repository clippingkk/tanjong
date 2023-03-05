import { WENQU_SIMPLE_TOKEN, WENQU_API_HOST } from "../constants/config"
import { storage } from "../utils/storage"

type WenquErrorResponse = {
  code: number
  error: string
}

export async function wenquRequest<T extends object>(url: string, options: RequestInit = {}): Promise<T> {
  options.headers = {
    ...(options.headers || {}),
    'X-Simple-Check': WENQU_SIMPLE_TOKEN
  }
  options.credentials = 'include'
  options.mode = 'cors'

  try {
    const response: T | WenquErrorResponse = await fetch(WENQU_API_HOST + url, options).then(res => res.json())
    if ('error' in response) {
      throw new Error(response.error)
    }
    return response
  } catch (e) {
    // Sentry.captureException(e)
    return Promise.reject(e)
  }
}

export interface WenquBook {
  id: number
  rating: number
  author: string
  pubdate: string
  totalPages: number
  originTitle: string
  image: string
  doubanId: number
  title: string
  url: string
  press: string
  isbn: string
  tags: string[]
  authorIntro: string
  summary: string
  createdAt: string
  updatedAt: string
}

export interface WenquSearchResponse {
  count: number
  books: WenquBook[]
}

// export class WenquSWRCache implements Cache<WenquBook[]> {
//   private _cache = new Map<string, any>()
//   private _keys = new Set<string>()
//   private prefix = 'wenqu:cache:'
//   private cacheKeysKey = 'wenqu:cache:keys'

//   constructor() {
//     // load keys
//     const lks = storage.getString(this.cacheKeysKey)
//     if (!lks) {
//       return
//     }
//     try {
//       const ks: string[] = JSON.parse(lks)
//       this._keys = new Set(ks)
//     } catch (err) {
//       console.error(err)
//       // do nothing
//     }

//     // TODO: load keys from storage to memory
//   }

//   keys(): IterableIterator<string> {
//     return this._cache.keys()
//   }
//   get(key: Key): State<WenquBook[], any> | undefined {
//     if (!key) {
//       return undefined
//     }
//     return this._cache.get(key as any)
//   }
//   set(key: Key, value: State<WenquBook[], any>): void {
//     this._cache.set(key as any, value)
//   }
//   delete(key: Key): void {
//     this._cache.delete(key as any)
//   }
// }