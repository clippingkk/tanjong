import 'react-native'
import React from 'react'
import ProfilePage from '../profile.page'
import nock from 'nock'
import { act, render, screen } from '@testing-library/react-native'
import { ApolloProvider } from '@apollo/client'
import { client } from '../../../utils/apollo'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteKeys, TabRouteParamList } from '../../../routes'
import { NativeBaseProvider, Text } from 'native-base'
import { MockedProvider } from "@apollo/client/testing"
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { uidAtom } from '../../../atomic'
import { BooksDocument, BooksQuery, ProfileDocument, ProfileQuery } from '../../../schema/generated'
import { HydrateAtoms } from '../../../../mocks/HydrateAtoms'

test('profile page renders with permission block', async () => {
  const TabStack = createBottomTabNavigator<TabRouteParamList>()
  render(
    <ApolloProvider client={client}>
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <NavigationContainer>
          <GluestackUIProvider config={config}>
            <TabStack.Navigator initialRouteName={RouteKeys.TabProfile}>
              <TabStack.Screen
                name={RouteKeys.TabProfile}
                component={ProfilePage}
                options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                    <Text>🏠</Text>
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

test('profile page renders with list', async () => {
  const TabStack = createBottomTabNavigator<TabRouteParamList>()
  const canvas = render(
    <MockedProvider mocks={[
      {
        request: {
          query: ProfileDocument,
          variables: { "id": 1, "pagination": { "recents": { "lastId": 1073741824, "limit": 10 } } }
        },
        result: {
          data: {
            me: {
              id: 1,
              domain: '111',
              name: 'namename',
              avatar: 'https://avatar.com.example/annatarhe.com',
              email: '1@1.com',
              bio: 'bio',
              password: '',
              phone: '123',
              checked: true,
              createdAt: '',
              updatedAt: '',
              premiumEndAt: '2099-10-10 11:11:11',
              wechatOpenid: '',
              isFan: false,
              clippingsCount: 99,
              followers: [],
              analysis: {
                monthly: [],
                daily: [],
              },
              comments: [],
              recents: [{
                id: 1,
                content: 'lll',
                title: 'hello',
                bookID: '1111',
                createdAt: '2011-10-10 11:11:11',
                pageAt: '8888'
              }, {
                id: 2,
                content: 'rrr',
                title: 'world',
                bookID: '2222',
                createdAt: '2011-10-10 11:11:11',
                pageAt: '8888'
              }],
              recent3mReadings: ['11']
            }
          } as ProfileQuery
        }
      },
      {
        request: {
          query: ProfileDocument,
          variables: { "id": 1, "pagination": { "recents": { "lastId": 2, "limit": 10 } } },
        },
        result: {
          data: {
            me: {
              id: 1,
              domain: '111',
              name: 'namename',
              avatar: 'https://avatar.com.example/annatarhe.com',
              email: '1@1.com',
              bio: 'bio',
              password: '',
              phone: '123',
              checked: true,
              createdAt: '',
              updatedAt: '',
              premiumEndAt: '2099-10-10 11:11:11',
              wechatOpenid: '',
              isFan: false,
              clippingsCount: 99,
              followers: [],
              analysis: {
                monthly: [],
                daily: [],
              },
              comments: [],
              recents: [],
              recent3mReadings: ['11']
            }
          } as ProfileQuery
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
                <TabStack.Navigator initialRouteName={RouteKeys.TabProfile}>
                  <TabStack.Screen
                    name={RouteKeys.TabProfile}
                    component={ProfilePage}
                    options={{
                      tabBarLabel: 'Books',
                      tabBarIcon: ({ color, size }) => (
                        <Text>🏠</Text>
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
  const nameDoms = canvas.getAllByText('namename')
  // in real world should be 1
  expect(nameDoms).toHaveLength(2)
  expect(canvas.getByText('PREMIUM')).toBeTruthy()
  expect(canvas).toMatchSnapshot()
})