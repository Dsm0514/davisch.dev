import { LOCALES, getCurrentDictionary, onLocaleChange, setLocale } from './i18n.js'

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]')
  const panel = document.querySelector('[data-menu-panel]')
  if (!toggle || !panel) return

  const closeMenu = () => {
    panel.dataset.open = 'false'
    toggle.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('overflow-hidden')
  }

  const openMenu = () => {
    panel.dataset.open = 'true'
    toggle.setAttribute('aria-expanded', 'true')
    document.body.classList.add('overflow-hidden')
  }

  toggle.addEventListener('click', () => {
    const isOpen = panel.dataset.open === 'true'
    isOpen ? closeMenu() : openMenu()
  })

  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu()
  })
}

function buildLanguageOption(locale, dict) {
  const li = document.createElement('li')
  li.setAttribute('role', 'none')

  const button = document.createElement('button')
  button.type = 'button'
  button.setAttribute('role', 'menuitemradio')
  button.dataset.localeOption = locale.code
  button.className =
    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-300 transition-colors duration-200 hover:bg-paper/5 hover:text-paper'

  button.innerHTML = `
    <img src="/assets/flags/bandeira-${locale.flag}.svg" alt="" aria-hidden="true" width="20" height="14" class="h-3.5 w-5 shrink-0 object-cover" />
    <span>${dict.langs[locale.code]}</span>
  `

  li.appendChild(button)
  return li
}

function initLanguageSwitcher() {
  const wrapper = document.querySelector('[data-lang-switcher]')
  const toggle = wrapper?.querySelector('[data-lang-toggle]')
  const menu = wrapper?.querySelector('[data-lang-menu]')
  const currentFlag = wrapper?.querySelector('[data-lang-current-flag]')
  const currentCode = wrapper?.querySelector('[data-lang-current-code]')

  if (!wrapper || !toggle || !menu) return

  const closeMenu = () => {
    menu.dataset.open = 'false'
    toggle.setAttribute('aria-expanded', 'false')
  }

  const openMenu = () => {
    menu.dataset.open = 'true'
    toggle.setAttribute('aria-expanded', 'true')
  }

  const renderOptions = (dict) => {
    menu.innerHTML = ''
    LOCALES.forEach((locale) => menu.appendChild(buildLanguageOption(locale, dict)))
  }

  const syncActiveState = (activeCode) => {
    const locale = LOCALES.find((item) => item.code === activeCode)
    if (!locale) return

    if (currentFlag) currentFlag.src = `/assets/flags/bandeira-${locale.flag}.svg`
    if (currentCode) currentCode.textContent = locale.short

    menu.querySelectorAll('[data-locale-option]').forEach((button) => {
      const isActive = button.dataset.localeOption === activeCode
      button.setAttribute('aria-checked', String(isActive))
      button.classList.toggle('text-paper', isActive)
    })
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.dataset.open === 'true'
    isOpen ? closeMenu() : openMenu()
  })

  menu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-locale-option]')
    if (!button) return
    setLocale(button.dataset.localeOption)
    closeMenu()
  })

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) closeMenu()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu()
  })

  renderOptions(getCurrentDictionary())
  syncActiveState(document.documentElement.lang)

  onLocaleChange((dict, locale) => {
    renderOptions(dict)
    syncActiveState(locale)
  })
}

function initHeaderScrollState() {
  const header = document.querySelector('[data-site-header]')
  if (!header) return

  const updateState = () => {
    header.dataset.scrolled = String(window.scrollY > 24)
  }

  updateState()
  window.addEventListener('scroll', updateState, { passive: true })
}

/** Marca na nav (desktop + menu mobile) qual seção está na tela no momento,
 * independente do hover. Uma faixa fina perto do centro do viewport decide
 * qual seção "conta" como atual — evita que duas seções grandes disputem o
 * estado ativo ao mesmo tempo. */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]')
  const navLinks = document.querySelectorAll('[data-nav-link]')
  if (!sections.length || !navLinks.length || typeof IntersectionObserver === 'undefined') return

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.dataset.active = String(link.dataset.navLink === id)
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id)
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )

  sections.forEach((section) => observer.observe(section))
}

export function initNav() {
  initMobileMenu()
  initLanguageSwitcher()
  initHeaderScrollState()
  initScrollSpy()
}
