import { Cache, Key, State } from "swr"
import { WENQU_SIMPLE_TOKEN, WENQU_API_HOST } from "../constants/config"

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

export class WenquSWRCache implements Cache<WenquBook> {
  private _cache = new Map()

  keys(): IterableIterator<string> {
    return this._cache.keys()
  }
  get(key: Key): State<WenquBook, any> | undefined {
    throw new Error("Method not implemented.")
  }
  set(key: Key, value: State<WenquBook, any>): void {
    throw new Error("Method not implemented.")
  }
  delete(key: Key): void {
    throw new Error("Method not implemented.")
  }

}