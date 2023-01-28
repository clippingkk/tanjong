import 'react-native'
import React from 'react'
import { act, render, screen } from '@testing-library/react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { uidAtom } from '../../../atomic'
import { WenquSearchResponse } from '../../../service/wenqu'
import BookCell from '../cell'
import { SWRConfig } from 'swr'

test('book cell will rendered correctly', async () => {
  render(
    <SWRConfig
      value={{
        fetcher: jest.fn((...args) => ({ books: [{ image: 'hello', title: 'wwww' }]})),
      }}
    >
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <Provider initialValues={[[uidAtom, 1]]}>
          <NavigationContainer>
            <BookCell bookDoubanID='11' />
          </NavigationContainer>
        </Provider>
      </NativeBaseProvider>
    </SWRConfig>
  )
  // make sure every thing rendered
  await act(() => { })
  expect(screen).toMatchSnapshot()
})
