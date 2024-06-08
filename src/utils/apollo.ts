import { ApolloClient, ApolloLink, Cache, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from "@apollo/client/link/error"
import { API_HOST } from '../constants/config'
// import profile from '../utils/profile'
import { offsetLimitPagination } from '@apollo/client/utilities'
import { storage } from './storage'
import toast from 'react-hot-toast/headless'

export type IBaseResponseData = {
  status: number
  msg: string
  data: any
} | {
  code: number,
  error: string // json string
}

export type CKNetworkError = {
  name: string
  response: any
  statusCode: number
  result?: {
    data: null,
    errors: {
      extensions: {
        code: number
        message: string
      }
      message: string
      path: string[]
    }[]
  }
}

let token = getLocalToken()
// let token = localProfile?.token

export function getLocalToken() {
  const tk = storage.getString('me:token')
  if (!tk) {
    return null
  }
  const parsed: string = JSON.parse(tk)
  return parsed.replace(/"/g, '')
}

export function updateLocalToken(nt: string | null) {
  token = nt
}

export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  if (token) {
    options.headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    }
  }
  options.credentials = 'include'
  options.mode = 'cors'

  try {
    const response = await fetch(API_HOST + '/api' + url, options)
    const jsonData = (await response.json()) satisfies IBaseResponseData
    if (response.status >= 400) {
      throw new Error(jsonData.msg ?? jsonData.error)
    }
    if (jsonData.code && jsonData.code >= 400) {
      throw new Error(jsonData.error)
    }
    return jsonData.data as T
  } catch (e) {
    // toast.error('请求挂了... 一会儿再试试')
    throw e
  }
}

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    if (!token || token === 'null') {
      return headers
    }

    return {
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      }
    }
  })

  return forward(operation)
})

type GraphQLResponseError = {
  name: string
  response: Response
  result: { code: number, error: string }
  statusCode: number
  message: string
}

const errorLink = onError((errData) => {
  const { graphQLErrors, networkError } = errData
  if (graphQLErrors && graphQLErrors.length > 0) {
    // toast.error(
    //   graphQLErrors[0].message,
    // )
  }
  let ne = networkError as GraphQLResponseError

  if (ne) {
    console.log(`[Network error]: ${ne}`)
    if (ne.statusCode && ne.statusCode === 401) {
      updateLocalToken('')
      // profile.onLogout()
    }
    // toast.error(`${ne.statusCode}: ${ne.name}`)
    // swal({
    //   icon: 'error',
    //   title: `${ne.statusCode}: ${ne.name}`,
    //   text: ne.result?.error
    // })
  }
});

const httpLink = new HttpLink({
  uri: API_HOST + '/api/v2/graphql',
})

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // featuredClippings: offsetLimitPagination(false)
          featuredClippings: {
            keyArgs: false,
            merge(p = [], n) {
              return [...p, ...n]
            }
          },
          books: {
            keyArgs: ['doubanId'],
            merge(p = [], n) {
              return [...p, ...n]
            }
          }
        }
      },
      Book: {
        keyFields: ["doubanId"],
        fields: {
          clippings: {
            merge: simpleDistArrayMerge
          }
        }
      },
      User: {
        fields: {
          recents: {
            merge: simpleDistArrayMerge
          }
        }
      }
    }
  }),
  link: errorLink.concat(authLink.concat(httpLink)),
})

function simpleDistArrayMerge(existings: { __ref: string }[] = [], incoming: { __ref: string }[] = []) {
  return [...existings, ...incoming].reduce((acc, x) => {
    if (acc.findIndex((z: any) => z.__ref === x.__ref) === -1) {
      acc.push(x)
    }
    return acc
  }, [] as any[])
}
