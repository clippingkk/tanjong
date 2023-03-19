import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { wenquRequest, WenquSearchResponse } from "../service/wenqu"
import { duration3Days } from "../utils/time"

export function useSingleBook(doubanId?: string | null, skip?: boolean) {
  return useQuery({
    queryKey: ['wenqu', 'books', 'dbId', doubanId],
    queryFn: () => wenquRequest<WenquSearchResponse>(`/books/search?dbId=${doubanId}`),
    enabled: !skip && (doubanId?.length ?? 0) > 3,
    cacheTime: duration3Days,
    staleTime: duration3Days,
  })
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