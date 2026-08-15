import './style.css'
import { initI18n, getCurrentDictionary, onLocaleChange } from './js/i18n.js'
import { renderDynamicContent } from './js/content.js'
import { initNav } from './js/nav.js'
import { initAnimations, refreshDynamicAnimations } from './js/animations.js'
import { initTheme } from './js/theme.js'

initI18n()
renderDynamicContent(getCurrentDictionary())
initNav()
initAnimations()
initTheme()

onLocaleChange((dict) => {
  renderDynamicContent(dict)
  refreshDynamicAnimations()
})

document.querySelectorAll('[data-current-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear())
})
