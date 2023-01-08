import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ApolloProvider } from '@apollo/client';
// import App from './app'
import { client } from './utils/apollo'
import { NativeBaseProvider, Box } from "native-base";
import { TailwindProvider } from 'tailwind-rn';
import utilities from '../tailwind.json';

// import "fast-text-encoding"
// import './utils/init'
import { Provider } from 'jotai'
import { SWRConfig } from 'swr';
import { wenquRequest } from './service/wenqu';

function Root() {
  return (
    <ApolloProvider client={client}>
      <SWRConfig
        value={{
          fetcher: wenquRequest
        }}
      >
        <Provider>
          <NativeBaseProvider>
            <TailwindProvider utilities={utilities}>
              <NavigationContainer>
                {/* <App /> */}
              </NavigationContainer>
            </TailwindProvider>
          </NativeBaseProvider>
        </Provider>
      </SWRConfig>
    </ApolloProvider>
  )
}

export default Root