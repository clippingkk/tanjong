import { useEffect, useRef, useState } from "react"
import { WenquBook, wenquRequest, WenquSearchResponse } from "../service/wenqu"

type bookRequestReturn = {
  books: WenquBook[]
  loading: boolean
}

const cache = new Map<number, WenquBook | null>()

export function useSingleBook(doubanId?: string, skip?: boolean): WenquBook | null {
  const [book, setBook] = useState<WenquBook | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (skip) {
      setLoading(false)
      return
    }
    if (!doubanId || doubanId.length < 4) {
      setLoading(false)
      return
    }

    if (cache.has(~~doubanId)) {
      setLoading(false)
      setBook(cache.get(~~doubanId)!)
      return
    }

    wenquRequest<WenquSearchResponse>(`/books/search?dbId=${doubanId}`).then(bs => {
      if (bs.books.length !== 1) {
        return
      }
      cache.set(~~doubanId, bs.books[0])
      setBook(bs.books[0])
    }).finally(() => {
      setLoading(false)
    })
  }, [doubanId, skip])

  return book
}

export function useMultipBook(doubanIds: string[], skip?: boolean): bookRequestReturn {
  const [books, setBooks] = useState<WenquBook[]>([])
  const [loading, setLoading] = useState(false)
  const isLoading = useRef(false)

  useEffect(() => {
    if (skip) {
      return
    }
    if (!doubanIds) {
      return
    }
    if (isLoading.current) {
      return
    }
    setLoading(true)
    isLoading.current = true

    const needToFetchIds: string[] = []
    doubanIds.forEach(i => {
      if (cache.has(~~i)) {
        setBooks(s => {
          if (s.findIndex(xx => xx.doubanId.toString() === i) > 0) {
            return s
          }
          return s.concat(cache.get(~~i)!)
        })
      } else {
        needToFetchIds.push(i)
      }
    })

    if (needToFetchIds.length === 0) {
      isLoading.current = false
      setLoading(false)
      return
    }
    const query = needToFetchIds.join('&dbIds=')
    wenquRequest<WenquSearchResponse>(`/books/search?dbIds=${query}`).then(bs => {
      // sort order by prev
      const bsBooks = needToFetchIds.reduce<WenquBook[]>((acc, cur) => {
        const bb = bs.books.find(x => x.doubanId.toString() === cur)
        if (bb) {
          acc.push(bb)
        }
        return acc
      }, [])

      setBooks(s => {
        return [...s, ...bsBooks].reduce<WenquBook[]>((acc, cur) => {
          if (acc.findIndex(x => x.doubanId === cur.doubanId) === -1) {
            acc.push(cur)
          }
          return acc
        }, [])
      })
      bsBooks.forEach(x => {
        cache.set(x.doubanId, x)
      })
    }).finally(() => {
      isLoading.current = false
      setLoading(false)
    })
  }, [doubanIds.join(','), skip])

  return {
    books,
    loading
  }
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