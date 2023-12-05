import 'react-native'
import React from 'react'
import { act, render, userEvent, waitFor } from '@testing-library/react-native'
import { RouteKeys, RouteParamList, TabRouteParamList } from '../../../routes'
import { NativeBaseProvider, Text } from 'native-base'
import { MockedProvider } from "@apollo/client/testing"
import { NavigationContainer } from '@react-navigation/native'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { uidAtom } from '../../../atomic'
import { FetchClippingAiSummaryDocument, FetchClippingDocument, } from '../../../schema/generated'
import { HydrateAtoms } from '../../../../mocks/HydrateAtoms'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mockedBook } from '../../../../mocks/data'
import SettingsPage from '../settings.page'

jest.mock('@sentry/react-native', () => {
  return {
    __esModule: true,
    init: jest.fn()
  }
})
jest.mock('../../../service/wenqu', () => {
  return {
    __esModule: true,
    wenquRequest: jest.fn(() => {
      return {
        count: 1,
        books: [{
          ...mockedBook,
          doubanId: '27036197'
        }]
      }
    })
  }
})
jest.mock('@georstat/react-native-image-cache', () => {
  return {
    CacheManager: {
      getCacheSize: jest.fn(() => Promise.resolve(1111)),
      clearCache: jest.fn()
    }
  }
})

test('book page renders with permission block', async () => {
  const st = createNativeStackNavigator<RouteParamList>()
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      }
    }
  })
  const canvas = render(
    <MockedProvider mocks={[]}>
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <QueryClientProvider client={qc}>
          <HydrateAtoms initialValues={[[uidAtom, 1]]}>
            <GluestackUIProvider config={config}>
              <NavigationContainer>
                <st.Navigator>
                  <st.Screen
                    component={SettingsPage}
                    name={RouteKeys.ProfileSettings}
                  />
                </st.Navigator>
              </NavigationContainer>
            </GluestackUIProvider>
          </HydrateAtoms>
        </QueryClientProvider>
      </NativeBaseProvider>
    </MockedProvider>
  )

  await act(() => { })
  await waitFor(() =>
    expect(canvas.getByText('iOS Widget Type: public')).toBeOnTheScreen()
  )
  await waitFor(() =>
    expect(canvas.getByText('1111 B')).toBeOnTheScreen()
  )
  expect(canvas).toMatchSnapshot()

  // await userEvent.press(
  //   canvas.getByRole('button', { name: 'English' })
  // )

  await waitFor(() =>
    expect(canvas.getByText('app.menu.logout')).toBeOnTheScreen()
  )
})
