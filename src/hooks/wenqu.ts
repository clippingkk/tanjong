import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from 'swr'
import { WenquBook, wenquRequest, WenquSearchResponse } from "../service/wenqu"

export function useSingleBook(doubanId?: string | null, skip?: boolean) {
  return useSWR<WenquSearchResponse>(doubanId && `/books/search?dbId=${doubanId}`)
}

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