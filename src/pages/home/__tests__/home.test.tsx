import 'react-native'
import React from 'react'
import HomePage from '../home.page'
import nock from 'nock'
import { act, render, screen } from '@testing-library/react-native'
import "fast-text-encoding"
import { ApolloProvider } from '@apollo/client'
import { client } from '../../../utils/apollo'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteKeys } from '../../../routes'
import { NativeBaseProvider, Text } from 'native-base'
import { MockedProvider } from "@apollo/client/testing"
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { uidAtom } from '../../../atomic'
import { BooksDocument, BooksQuery } from '../../../schema/generated'
import { WenquSearchResponse } from '../../../service/wenqu'

test('home page renders with permission block', async () => {
  const TabStack = createBottomTabNavigator()
  render(
    <ApolloProvider client={client}>
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <NavigationContainer>
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
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  )

  expect(screen).toMatchSnapshot()
})

test('home page renders with list', async () => {
  const TabStack = createBottomTabNavigator()
  nock('https://wenqu.annatarhe.cn')
    .get('/books/search?dbId=11')
    .reply(200, {
      count: 1,
      books: [{
        doubanId: 11,
        title: 'hhhhhhhh'
      }, {
        doubanId: 22,
        title: '2222',
      }]
    } as WenquSearchResponse)

  const d = render(
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
              doubanId: '11',
            }, {
              doubanId: '22'
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
        <Provider initialValues={[[uidAtom, 1]]}>
          <NavigationContainer>
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
          </NavigationContainer>
        </Provider>
      </NativeBaseProvider>
    </MockedProvider>
  )
  // make sure every thing rendered
  await act(() => {})
  expect(screen).toMatchSnapshot()
})
