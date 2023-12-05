import 'react-native'
import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react-native'
import { ApolloProvider } from '@apollo/client'
import { client } from '../../../utils/apollo'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteKeys, RouteParamList, TabRouteParamList } from '../../../routes'
import { NativeBaseProvider, Text } from 'native-base'
import { MockedProvider } from "@apollo/client/testing"
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { uidAtom } from '../../../atomic'
import { BookDocument, BookQuery, BooksDocument, BooksQuery, ProfileDocument, ProfileQuery } from '../../../schema/generated'
import { HydrateAtoms } from '../../../../mocks/HydrateAtoms'
import { GraphQLError } from 'graphql'
import { getMockedRouteNavigation, mockedBook } from '../../../../mocks/data'
import BookPage from '../book.page'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

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

test('book page renders with permission block', async () => {
  const navigation = getMockedRouteNavigation()
  const st = createNativeStackNavigator<RouteParamList>()
  const canvas = render(
    <MockedProvider mocks={[
      {
        delay: 30,
        request: {
          query: BookDocument,
          variables: {
            id: 1077528,
            pagination: {
              limit: 10,
              offset: 10
            }
          }
        },
        result: {
          data: {
            book: {
              "doubanId": "27036197",
              "startReadingAt": "2023-11-27T18:37:10Z",
              "lastReadingAt": "2023-12-01T09:42:59Z",
              "isLastReadingBook": true,
              "clippingsCount": 10,
              "clippings": [],
            }
          }
        }
      },
      {
        delay: 30,
        request: {
          query: BookDocument,
          variables: {
            id: 1077528,
            pagination: {
              limit: 10,
              offset: 0
            }
          }
        },
        result: {
          data: {
            book: {
              "doubanId": "27036197",
              "startReadingAt": "2023-11-27T18:37:10Z",
              "lastReadingAt": "2023-12-01T09:42:59Z",
              "isLastReadingBook": true,
              "clippingsCount": 10,
              "clippings": [
                {
                  "id": 70710,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "The desperation created by total war in Europe and the fear that it would spread to much of the rest of the globe was in the minds of all those who experienced it, regardless of where they experienced it.",
                  "createdAt": "2023-12-01T09:42:59Z",
                  "pageAt": "#419-420",
                  "__typename": "Clipping"
                },
                {
                  "id": 70709,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "It was the World War I generation who went on to shape the Cold War. All the elements of the Great War were in it: fear, uncertainty, the need for something to believe in, and the demand to create a better world.",
                  "createdAt": "2023-12-01T09:42:29Z",
                  "pageAt": "#418-419",
                  "__typename": "Clipping"
                },
                {
                  "id": 70708,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "But worse than the physical effects of total war were its psychological consequences. A whole generation of Europeans learned that killing, destroying, and hating your neighbors were regular, normal aspects of life, and that the moral certainties of the nineteenth century were mainly empty phrases.",
                  "createdAt": "2023-12-01T09:37:58Z",
                  "pageAt": "#411-413",
                  "__typename": "Clipping"
                },
                {
                  "id": 70707,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "THE FIRST OPENING for the Russian revolutionaries came very unexpectedly. In 1905, the Russian empire lost its war against Japan, and the shock of defeat set off massive antigovernment demonstrations in Moscow and St. Petersburg.",
                  "createdAt": "2023-12-01T09:30:03Z",
                  "pageAt": "#391-393",
                  "__typename": "Clipping"
                },
                {
                  "id": 70706,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "All of this fueled anticapitalist resistance in Russia both on the Right and the Left in the years before World War I. The few who believed in the ideas of liberal capitalism were often lost in the melee.",
                  "createdAt": "2023-12-01T09:20:54Z",
                  "pageAt": "#375-376",
                  "__typename": "Clipping"
                },
                {
                  "id": 70705,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "What pushed him to intervene was German submarine warfare against international shipping between the United States and the Allied countries.",
                  "createdAt": "2023-11-30T09:39:55Z",
                  "pageAt": "#352-353",
                  "__typename": "Clipping"
                },
                {
                  "id": 70704,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "Others believed that in a world of expanding empires the United States had to lead from the front. Instead of only acting as an example it had to intervene to set the world right; the world needed not only American ideas but American power.",
                  "createdAt": "2023-11-30T09:35:34Z",
                  "pageAt": "#338-340",
                  "__typename": "Clipping"
                },
                {
                  "id": 70703,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "Marx’s followers stressed the need for relentless class-struggle and for conquering political power through revolution. They saw the workers as having no homeland and no king. They saw the struggle for a new world as having no borders, while most of their rivals were nationalist and, in some cases, imperialist.",
                  "createdAt": "2023-11-29T09:19:59Z",
                  "pageAt": "#200-202",
                  "__typename": "Clipping"
                },
                {
                  "id": 70702,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "Marx’s adherents, who called themselves Communists after his Manifesto, in the nineteenth century never constituted more than small groups, but they had an influence far greater than their numbers. What characterized them were to a large extent the intensity of their beliefs and their fundamental internationalism.",
                  "createdAt": "2023-11-29T09:18:06Z",
                  "pageAt": "#197-199",
                  "__typename": "Clipping"
                },
                {
                  "id": 70701,
                  "bookID": "27036197",
                  "title": "Odd Arne Westad - The Cold War_ A World History-Basic Books",
                  "content": "My argument, if there is one argument in such a lengthy book, is that the Cold War was born from the global transformations of the late nineteenth century and was buried as a result of tremendously rapid changes a hundred years later. Both as an ideological conflict and as an international system it can therefore only be grasped in terms of economic, social, and political change that is much broader and deeper than the events created by the Cold War itself.",
                  "createdAt": "2023-11-27T18:44:48Z",
                  "pageAt": "#112-116",
                  "__typename": "Clipping"
                }
              ],
              "__typename": "Book"
            }
          } as BookQuery
        }
      }
    ]}>
      <NativeBaseProvider initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <HydrateAtoms initialValues={[[uidAtom, 1]]}>
          <GluestackUIProvider config={config}>
            <NavigationContainer>
              <st.Navigator>
                <st.Screen
                  component={BookPage}
                  name={RouteKeys.BookDetail}
                  initialParams={{
                    book: mockedBook
                  }}
                />
              </st.Navigator>
            </NavigationContainer>
          </GluestackUIProvider>
        </HydrateAtoms>
      </NativeBaseProvider>
    </MockedProvider>
  )

  await waitFor(() =>
    expect(screen.getByText('The desperation created by total war in Europe and the fear that it would spread to much of the rest of the globe was in the minds of all those who experienced it, regardless of where they experienced it.')).toBeOnTheScreen()
  )
  // expect(canvas.getByText('2222')).toBeTruthy()
  // expect(canvas.getByText('lorem')).toBeTruthy()
  expect(canvas).toMatchSnapshot()
})
