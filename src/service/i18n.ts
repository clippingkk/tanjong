import i18n, { Module, NewableModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, NativeModules, Platform } from 'react-native'
import * as RNLocalize from "react-native-localize"

import en from '../l10n/en.json'
import zh from '../l10n/zhCN.json'
import ko from '../l10n/ko.json'
import { storage } from '../utils/storage';

const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: async (cb: any) => {
    const storedLng = storage.getString('lng')
    if (storedLng) {
      return Promise.resolve(storedLng)
    }
    const locale =
      Platform.OS === 'ios' ?
        NativeModules.SettingsManager.getConstants().settings.AppleLocale :
        NativeModules.I18nManager.localeIdentifier;

    const l = locale.split('_')[0]
    return Promise.resolve(l)
  },
  cacheUserLanguage: async (lng: string) => {
    storage.set('lng', lng)
  }
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init<any>({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      },
      ko: {
        translation: ko
      },
    },
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false // not needed for react
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;