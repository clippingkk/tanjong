import 'react-native'
import React from 'react'
import HomePage from '../home.page'
import nock from 'nock'
import { act, render, screen } from '@testing-library/react-native'
import { ApolloProvider } from '@apollo/client'
import { client } from '../../../utils/apollo'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteKeys } from '../../../routes'
import { NativeBaseProvider, Text } from 'native-base'
import { MockedProvider } from "@apollo/client/testing"
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { uidAtom } from '../../../atomic'
import { BooksDocument, BooksQuery } from '../../../schema/generated'
import { WenquSearchResponse } from '../../../service/wenqu'
import { HydrateAtoms } from '../../../../mocks/HydrateAtoms'

test('home page renders with permission block', async () => {
  const TabStack = createBottomTabNavigator()
  render(
    <ApolloProvider client={client}>
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <NavigationContainer>
          <GluestackUIProvider config={config}>
            <TabStack.Navigator initialRouteName={RouteKeys.TabHome}>
              <TabStack.Screen
                name={RouteKeys.TabHome}
                component={HomePage}
                options={{
                  tabBarLabel: 'Books',
                  tabBarIcon: ({ color, size }) => (
                    <Text>📚</Text>
                  ),
                }}
              />
            </TabStack.Navigator>
          </GluestackUIProvider>
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  )

  expect(screen).toMatchSnapshot()
})

jest.mock('../../../service/wenqu', () => {
  return {
    __esModule: true,
    wenquRequest: jest.fn(() => {
      return {
        count: 1,
        books: [{
          doubanId: 1111,
          title: 'hhhhhhhh'
        }, {
          doubanId: 2222,
          title: '2222',
        }]
      }
    })
  }
})

test('home page renders with list', async () => {
  const TabStack = createBottomTabNavigator()
  const canvas = render(
    <MockedProvider mocks={[
      {
        request: {
          query: BooksDocument,
          variables: {
            id: 1,
            pagination: {
              limit: 10,
              offset: 0
            }
          }
        },
        result: {
          data: {
            books: [{
              doubanId: '1111',
            }, {
              doubanId: '2222'
            }],
            me: {
              id: 1,
              domain: '111',
              recents: [{
                id: 1,
                content: 'lll',
                bookID: '11'
              }, {
                id: 2,
                content: 'rrr',
                bookID: '22',
              }],
              recent3mReadings: ['11']
            }
          } as BooksQuery
        }
      }
    ]}>
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <Provider>
          <HydrateAtoms initialValues={[[uidAtom, 1]]}>
            <NavigationContainer>
              <GluestackUIProvider config={config}>
                <TabStack.Navigator initialRouteName={RouteKeys.TabHome}>
                  <TabStack.Screen
                    name={RouteKeys.TabHome}
                    component={HomePage}
                    options={{
                      tabBarLabel: 'Books',
                      tabBarIcon: ({ color, size }) => (
                        <Text>📚</Text>
                      ),
                    }}
                  />
                </TabStack.Navigator>
              </GluestackUIProvider>
            </NavigationContainer>
          </HydrateAtoms>
        </Provider>
      </NativeBaseProvider>
    </MockedProvider>
  )
  // make sure every thing rendered
  await act(() => { })
  expect(canvas).toMatchSnapshot()
})
