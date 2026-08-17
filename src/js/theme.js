const STORAGE_KEY = 'davisch-theme'

// Logo clara = clara o suficiente pra ler em fundo escuro; logo escura = tem
// contraste em fundo claro. Ou seja: tema escuro usa a logo clara, e vice-versa.
const LOGO_SRC = {
  nav: {
    dark: '/assets/images/logo-clara-davisch-dev-completa.svg',
    light: '/assets/images/logo-escura.svg'
  },
  footer: {
    dark: '/assets/images/desenho-logo-clara-davisch-dev.svg',
    light: '/assets/images/logo-escura-reduzida.svg'
  }
}

function detectInitialTheme() {
  const stored = document.documentElement.dataset.theme
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyLogos(theme) {
  document.querySelectorAll('[data-logo]').forEach((img) => {
    const src = LOGO_SRC[img.dataset.logo]?.[theme]
    if (src) img.src = src
  })
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090A15' : '#FDFDFD')
  document.querySelector('[data-theme-toggle]')?.setAttribute('aria-pressed', String(theme === 'dark'))
  applyLogos(theme)
}

export function initTheme() {
  const theme = detectInitialTheme()
  applyTheme(theme)

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  })
}
