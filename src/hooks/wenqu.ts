import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { wenquRequest, WenquSearchResponse } from "../service/wenqu"

export function useSingleBook(doubanId?: string | null, skip?: boolean) {
  return useQuery({
    queryKey: ['wenqu', 'books', 'dbId', doubanId],
    queryFn: () => wenquRequest<WenquSearchResponse>(`/books/search?dbId=${doubanId}`),
    enabled: !skip && (doubanId?.length ?? 0) > 3
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