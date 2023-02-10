import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ApolloProvider } from '@apollo/client';
import App from './app'
import { client } from './utils/apollo'
import { NativeBaseProvider, Box, extendTheme } from "native-base";
import { TailwindProvider } from 'tailwind-rn';
import utilities from '../tailwind.json';

import "fast-text-encoding"
import './utils/init'
import { Provider } from 'jotai'
import { SWRConfig } from 'swr';
import { wenquRequest, WenquSWRCache } from './service/wenqu';

function Root() {
  return (
    <ApolloProvider client={client}>
      <SWRConfig
        value={{
          fetcher: wenquRequest,
          provider: () => new WenquSWRCache(),
        }}
      >
        <Provider>
          <NativeBaseProvider
            theme={extendTheme({
              config: {
                useSystemColorMode: true
              },
              colors: {
                primary: {
                  50: 'rgba(4, 95, 176, 0.1)',
                  100: 'rgba(4, 95, 176, 0.2)',
                  200: 'rgba(4, 95, 176, 0.3)',
                  300: 'rgba(4, 95, 176, 0.4)',
                  400: 'rgba(4, 95, 176, 0.5)',
                  500: 'rgba(4, 95, 176, 0.6)',
                  600: 'rgba(4, 95, 176, 0.7)',
                  700: 'rgba(4, 95, 176, 0.8)',
                  800: 'rgba(4, 95, 176, 0.9)',
                  900: 'rgba(4, 95, 176, 1)',
                }
              }
            })}
          >
            <TailwindProvider utilities={utilities}>
              <NavigationContainer>
                <App />
              </NavigationContainer>
            </TailwindProvider>
          </NativeBaseProvider>
        </Provider>
      </SWRConfig>
    </ApolloProvider>
  )
}

export default Root