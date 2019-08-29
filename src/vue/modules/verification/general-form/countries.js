import translations from '@/i18n/ru.countries'

import { byAlpha2 } from 'iso-country-codes'

function getCountryCodes () {
  return Object
    .keys(byAlpha2)
    .map(code => ({ code, translation: translations[code] }))
}

export const COUNTRIES = getCountryCodes()
