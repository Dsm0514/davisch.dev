import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'
import de from '../locales/de.json'

const STORAGE_KEY = 'davisch-lang'

const dictionaries = { 'pt-BR': ptBR, en, es, fr, de }

export const LOCALES = [
  { code: 'pt-BR', flag: 'br', short: 'PT' },
  { code: 'en', flag: 'us', short: 'EN' },
  { code: 'es', flag: 'es', short: 'ES' },
  { code: 'fr', flag: 'fr', short: 'FR' },
  { code: 'de', flag: 'de', short: 'DE' }
]

const DEFAULT_LOCALE = 'pt-BR'
const listeners = new Set()

const getDictionary = (locale) => dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]

const getNested = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)

function matchBrowserLocale() {
  const browserLangs = navigator.languages?.length ? navigator.languages : [navigator.language]

  for (const lang of browserLangs) {
    const exact = LOCALES.find((locale) => locale.code.toLowerCase() === lang.toLowerCase())
    if (exact) return exact.code

    const prefix = lang.split('-')[0].toLowerCase()
    const byPrefix = LOCALES.find((locale) => locale.code.split('-')[0].toLowerCase() === prefix)
    if (byPrefix) return byPrefix.code
  }

  return DEFAULT_LOCALE
}

function detectInitialLocale() {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (saved && dictionaries[saved]) return saved
  return matchBrowserLocale()
}

function applyStaticNodes(dict) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getNested(dict, el.dataset.i18n)
    if (value === undefined) return

    if (el.dataset.i18nTarget === 'html') {
      el.innerHTML = value
    } else {
      el.textContent = value
    }
  })

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':').map((part) => part.trim())
      const value = getNested(dict, key)
      if (attr && value !== undefined) el.setAttribute(attr, value)
    })
  })
}

function applyMetaTags(dict) {
  document.title = dict.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', dict.meta.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', dict.meta.description)
}

function applyLocale(locale) {
  const dict = getDictionary(locale)
  document.documentElement.lang = locale

  applyMetaTags(dict)
  applyStaticNodes(dict)
  listeners.forEach((callback) => callback(dict, locale))
}

export function getCurrentLocale() {
  return document.documentElement.lang || DEFAULT_LOCALE
}

export function getCurrentDictionary() {
  return getDictionary(getCurrentLocale())
}

export function onLocaleChange(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function setLocale(locale) {
  if (!dictionaries[locale]) return
  localStorage.setItem(STORAGE_KEY, locale)
  applyLocale(locale)
  document.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }))
}

export function initI18n() {
  const initialLocale = detectInitialLocale()
  applyLocale(initialLocale)
  return initialLocale
}
