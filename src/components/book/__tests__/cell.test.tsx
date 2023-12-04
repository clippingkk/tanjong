import 'react-native'
import React from 'react'
import { act, render, waitFor } from '@testing-library/react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { uidAtom } from '../../../atomic'
import BookCell from '../cell'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { useHydrateAtoms } from 'jotai/utils'

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues)
  return children
}

jest.mock('../../../service/wenqu', () => {
  return {
    __esModule: true,
    wenquRequest: jest.fn(() => {
      return {
        books: [{ image: 'hello', title: 'wwww' }],
        count: 2
      }
    })
  }
})

test('book cell will rendered correctly', async () => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      }
    }
  })

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
  const canvas = render(<Wrapper />)
  await act(() => { })
  await waitFor(() => expect(canvas.getByText('wwww')).toBeDefined())
  expect(canvas).toMatchSnapshot()
})
