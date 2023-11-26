// import '@formatjs/intl-pluralrules/polyfill'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ApolloProvider } from '@apollo/client';
import App from './app'
import { client } from './utils/apollo'
import { NativeBaseProvider, Box, extendTheme } from "native-base";
import { TailwindProvider } from 'tailwind-rn';
import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import utilities from '../tailwind.json';

import "fast-text-encoding"
import './utils/init'
import i18nInstance from './service/i18n'
import { Provider } from 'jotai'
import { I18nextProvider } from 'react-i18next';
import { StripeProvider } from '@stripe/stripe-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeConfigs } from './constants/config';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { mmkvStoragePersister } from './utils/storage';
import { useColorScheme } from 'react-native';

const qc = new QueryClient({})

function Root() {
  const c = useColorScheme()
  return (
    <PersistQueryClientProvider client={qc} persistOptions={{ persister: mmkvStoragePersister }}>
      <I18nextProvider i18n={i18nInstance}>
        <ApolloProvider client={client}>
          <Provider>
            <GluestackUIProvider
              colorMode={c === 'dark' ? 'dark' : 'light'}
              config={config}
            >
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
                  <StripeProvider
                    publishableKey={StripeConfigs.publishableKey}
                    urlScheme={StripeConfigs.urlScheme}
                    merchantIdentifier={StripeConfigs.merchantIdentifier}
                  >
                    <NavigationContainer>
                      <App />
                    </NavigationContainer>
                  </StripeProvider>
                </TailwindProvider>
              </NativeBaseProvider>
            </GluestackUIProvider>
          </Provider>
        </ApolloProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
  )
}

export default Root