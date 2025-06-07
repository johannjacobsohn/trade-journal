import { setDefaultOptions } from 'date-fns';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { de, enUS } from 'date-fns/locale';
import { Languages } from '@/enums/Languages.enum';
import translationDE from '@/localization/de/translation.json';
import translationEN from '@/localization/en/translation.json';
import { LocalStorage } from '@/services/LocalStorage';

const STORE_LANGUAGE = 'language';

const language: Languages | null = LocalStorage.getItem(STORE_LANGUAGE);

const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: Languages.EN,
  debug: process.env.NODE_ENV !== 'production',
  interpolation: {
    escapeValue: false,
  },
  lng: language || Languages.EN,
});

i18n.on('languageChanged', (lng) => {
  setDefaultOptions({ locale: lng === Languages.DE ? de : enUS });
  LocalStorage.setItem(STORE_LANGUAGE, lng);
});

setDefaultOptions({ locale: language === Languages.DE ? de : enUS });

export default i18n;
