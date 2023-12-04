import 'react-native'
import React from 'react'
import { act, render, renderHook, screen, waitFor } from '@testing-library/react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { uidAtom } from '../../../atomic'
import BookCell from '../cell'
import nock from 'nock'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSingleBook } from '../../../hooks/wenqu'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { useHydrateAtoms } from 'jotai/utils'

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues)
  return children
}

test.only('book cell will rendered correctly', async () => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      }
    }
  })
  const expectation = nock('https://wenqu.annatarhe.cn')
    // .get('/api/v1/books/search')
    .get('*')
    // .query({
    //   dbId: '1111',
    // })
    .reply(() => {
      console.log('ffffff', 'reply')
      return [
        200,
        {
          books: [{ image: 'hello', title: 'wwww' }],
          count: 2
        }
      ]
    })
  // .reply(200, {
  //   books: [{ image: 'hello', title: 'wwww' }],
  //   count: 2
  // })

  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return (
      <QueryClientProvider client={qc}>
        <NativeBaseProvider initialWindowMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}>
          <Provider>
            <HydrateAtoms initialValues={[[uidAtom, 1]]}>
              <GluestackUIProvider config={config}>
                <NavigationContainer>
                  {children}
                  <BookCell bookDoubanID='1111' />
                </NavigationContainer>
              </GluestackUIProvider>
            </HydrateAtoms>
          </Provider>
        </NativeBaseProvider>
      </QueryClientProvider >
    )
  }
  // const { result } = renderHook(() => useSingleBook('1111'), {
  //   wrapper
  // })
  // console.log(result.current.isSuccess)
  // await waitFor(() => {
  //   return expect(result.current.isSuccess).toBe(true)
  // })
  // make sure every thing rendered

  // expect(result.current.data).toBeDefined()

  const canvas = render(<Wrapper />)
  await act(() => { })
  await waitFor(() => expect(canvas.getByText('wwww')).toBeDefined())

  expect(canvas).toMatchSnapshot()
  expectation.done()
})
