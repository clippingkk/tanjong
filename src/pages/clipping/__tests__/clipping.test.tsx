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
import ClippingPage from '../clipping'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mockedBook } from '../../../../mocks/data'

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
    <MockedProvider mocks={[
      {
        delay: 30,
        request: {
          query: FetchClippingAiSummaryDocument,
          variables: {
            id: 70710,
          }
        },
        result: {
          data: {
            clipping: {
              "id": 70710,
              "aiSummary": "the ai summary should be here",
              "__typename": "Clipping"
            }
          }
        }
      },
      {
        delay: 30,
        request: {
          query: FetchClippingDocument,
          variables: {
            id: 3333,
          }
        },
        result: {
          data: {
            clipping: {
              "id": 70710,
              "bookID": "27036197",
              "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
              "content": "The desperation created by total war in Europe and the fear that it would spread to much of the rest of the globe was in the minds of all those who experienced it, regardless of where they experienced it.",
              "createdAt": "2023-12-01T09:42:59Z",
              "pageAt": "#419-420",
              "visible": true,
              "prevClipping": {
                "userClippingID": 70709,
                "bookClippingID": 70709,
                "__typename": "siblingClippingObject"
              },
              "nextClipping": {
                "userClippingID": 0,
                "bookClippingID": 0,
                "__typename": "siblingClippingObject"
              },
              "reactionData": {
                "count": 0,
                "symbolCounts": [],
                "__typename": "ReactionData"
              },
              "creator": {
                "id": 1,
                "name": "AnnatarHe",
                "avatar": "clippingkk/avatar/user-BpLnfgDsc3WD9F3qNfHK6a95jjJkwzDk.jpg",
                "domain": "annatar.he",
                "premiumEndAt": "2023-12-27T14:57:15Z",
                "__typename": "User"
              },
              "comments": [],
              "__typename": "Clipping"
            }
          }
        }
      },
    ]}>
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
                    component={ClippingPage}
                    name={RouteKeys.Clipping}
                    initialParams={{
                      clippingID: 3333
                    }}
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
    expect(canvas.getByText('The desperation created by total war in Europe and the fear that it would spread to much of the rest of the globe was in the minds of all those who experienced it, regardless of where they experienced it.')).toBeOnTheScreen()
  )

  expect(canvas).toMatchSnapshot()

  await userEvent.press(
    canvas.getByRole('button', { name: '✨ AI Description' })
  )

  await waitFor(() =>
    expect(canvas.getByText('the ai summary should be here')).toBeOnTheScreen()
  )
})
