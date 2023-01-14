import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from 'swr'
import { WenquBook, wenquRequest, WenquSearchResponse } from "../service/wenqu"

type bookRequestReturn = {
  books: WenquBook[]
  loading: boolean
}

const cache = new Map<number, WenquBook | null>()

export function useSingleBook(doubanId?: string, skip?: boolean) {
  return useSWR<WenquSearchResponse>( doubanId && `/books/search?dbId=${doubanId}`)
}

// export function useMultipBook(doubanIds: string[], skip?: boolean) {
//   const query = useMemo(() => {
//     if (doubanIds.length === 0) {
//       return null
//     }
//     return doubanIds.join('&dbIds=')
//   }, [doubanIds])

//   return useSWR<WenquSearchResponse>(query && `/books/search?dbIds=${query}`)
// }

export function useBookSearch(query: string, offset: number) {
  const [books, setBooks] = useState<WenquSearchResponse | null>(null)
  useEffect(() => {
    if (query.length < 3) {
      return
    }

    wenquRequest<WenquSearchResponse>(`/books/search?query=${query}&limit=50&offset=${offset}`)
      .then(bs => {
        setBooks(bs)
      })
  }, [query, offset])

  return books
}