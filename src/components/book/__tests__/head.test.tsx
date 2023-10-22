import 'react-native'
import React from 'react'
import { act, render, screen } from '@testing-library/react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'jotai'
import { uidAtom } from '../../../atomic'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BookHead from '../head'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'

test('head book will correctly rendering', async () => {
  const now = new Date()
  const st = createNativeStackNavigator()
  function BH() {
    return (
      <BookHead
        book={{
          id: 1,
          title: 'happy chinese year',
          author: 'annatarhe',
          summary: 'summmary',
          rating: 3,
          pubdate: now.toString(),
          totalPages: 333,
          originTitle: 'hhhhhh',
          image: 'x',
          doubanId: 1,
          press: 'sssssssssg',
          url: 'https://h.c.n.y/hcny',
          isbn: 'xxxx',
          tags: ['h', 'e', 'a'],
          authorIntro: 'z',
          createdAt: now.toString(),
          updatedAt: now.toString()
        }}
      />
    )
  }
  //ScreenComponentType
  // initialValues={[[uidAtom, 1]]}
  render(
    <NativeBaseProvider initialWindowMetrics={{
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }}>
      <GluestackUIProvider config={config}>
        <Provider >
          <NavigationContainer>
            <st.Navigator>
              <st.Screen
                component={BH}
                name='/h'
              />
            </st.Navigator>
          </NavigationContainer>
        </Provider>
      </GluestackUIProvider>
    </NativeBaseProvider>
  )
  // make sure every thing rendered
  await act(() => { })
  expect(screen).toMatchSnapshot()
})
