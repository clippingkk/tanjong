import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import App from './app'
import { client } from './utils/apollo'
import { NativeBaseProvider, Box } from "native-base";
import { TailwindProvider } from 'tailwind-rn';
import utilities from '../tailwind.json';

import "fast-text-encoding"
import './utils/init'
import { Provider } from 'jotai'
import { ApolloProvider } from '@apollo/client';

function Root() {
  return (
    <ApolloProvider client={client}>
      <Provider>
        <NativeBaseProvider>
          <TailwindProvider utilities={utilities}>
            <NavigationContainer>
              <App />
            </NavigationContainer>
          </TailwindProvider>
        </NativeBaseProvider>
      </Provider>
    </ApolloProvider>
  )
}

export default Root