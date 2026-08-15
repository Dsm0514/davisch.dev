import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fontes self-hosted terminam de carregar um instante depois do primeiro
 * paint e podem mudar a altura de blocos de texto. Sem recalcular os pontos
 * de disparo do ScrollTrigger depois disso, alguma animação pode disparar na
 * posição errada. Roda uma vez após o carregamento e observa o corpo da
 * página como rede de segurança contra qualquer mudança futura de altura. */
function keepTriggersInSync() {
  const refresh = () => ScrollTrigger.refresh()

  document.fonts?.ready?.then(refresh)
  window.addEventListener('load', refresh)

  if (typeof ResizeObserver === 'undefined') return

  let frame = null
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(refresh)
  })
  observer.observe(document.body)
}

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('[data-hero-eyebrow]', { opacity: 0, y: 20, duration: 0.6 })
    .from(
      '[data-hero-title-line] > span',
      { yPercent: 130, opacity: 0, duration: 0.9, stagger: 0.08 },
      '-=0.25'
    )
    .from('[data-hero-subtitle]', { opacity: 0, y: 20, duration: 0.6 }, '-=0.45')
    .from('[data-hero-actions] > *', { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, '-=0.35')
    .from('[data-hero-media]', { opacity: 0, scale: 1.04, duration: 1 }, '-=0.7')

  return tl
}

function scrollReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((item) => {
    if (item.dataset.revealBound) return
    item.dataset.revealBound = 'true'

    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%', once: true }
    })
  })
}

function parallaxLayers() {
  gsap.utils.toArray('[data-speed]').forEach((el) => {
    if (el.dataset.parallaxBound) return
    el.dataset.parallaxBound = 'true'

    const speed = parseFloat(el.dataset.speed) || 0.2
    const section = el.closest('[data-parallax-section]') || el

    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
    })
  })
}

function counters() {
  gsap.utils.toArray('[data-counter]').forEach((el) => {
    if (el.dataset.counterBound) return
    el.dataset.counterBound = 'true'

    const target = parseFloat(el.dataset.counterTarget) || 0
    const prefix = el.dataset.counterPrefix || ''
    const suffix = el.dataset.counterSuffix || ''
    const counter = { value: 0 }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`
          }
        })
      }
    })
  })
}

/** Slideshow "estilo tela de carregamento" (fade cruzado + zoom lento
 * contínuo) para a galeria da página de projeto. Cada slide ocupa sua vez
 * dando zoom in; a troca pro próximo é um crossfade, nunca um corte seco. O
 * último slide sempre aponta pro primeiro, então o loop nunca mostra costura
 * — o fade-in do slide 0 acontece bem na emenda do timeline com repeat:-1. */
function initGallerySlideshow() {
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const slides = gallery.querySelectorAll('[data-gallery-slide]')
    if (!slides.length) return

    gsap.set(slides, { opacity: 0, scale: 1 })
    gsap.set(slides[0], { opacity: 1 })

    if (slides.length < 2 || prefersReducedMotion()) return

    const SLIDE_DURATION = 5
    const FADE_DURATION = 1.4
    const timeline = gsap.timeline({ repeat: -1 })

    slides.forEach((slide, index) => {
      const next = slides[(index + 1) % slides.length]
      const start = index * SLIDE_DURATION
      const crossfadeStart = start + SLIDE_DURATION - FADE_DURATION

      timeline
        .to(slide, { scale: 1.12, duration: SLIDE_DURATION, ease: 'none' }, start)
        .to(slide, { opacity: 0, duration: FADE_DURATION, ease: 'power1.inOut' }, crossfadeStart)
        .to(next, { opacity: 1, duration: FADE_DURATION, ease: 'power1.inOut' }, crossfadeStart)
        .set(slide, { scale: 1 }, start + SLIDE_DURATION)
    })
  })
}

function navLinkHovers() {
  document.querySelectorAll('[data-hover-scale]').forEach((el) => {
    el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.04, duration: 0.3, ease: 'power2.out' }))
    el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' }))
  })
}

/** Remove ScrollTriggers cujo elemento-gatilho já não está no DOM (ex: cards
 * de projeto recriados na troca de idioma). */
function cleanupOrphanTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger && !document.body.contains(trigger.trigger)) trigger.kill()
  })
}

export function initAnimations() {
  document.documentElement.dataset.jsReady = 'true'
  initGallerySlideshow()

  if (prefersReducedMotion()) {
    gsap.set(
      '[data-reveal], [data-hero-title-line] > span, [data-hero-eyebrow], [data-hero-subtitle], [data-hero-actions] > *, [data-hero-media]',
      { opacity: 1, y: 0, scale: 1, yPercent: 0 }
    )
    return
  }

  keepTriggersInSync()
  heroIntro()
  scrollReveals()
  parallaxLayers()
  counters()
  navLinkHovers()
}

/** Chame depois de recriar conteúdo dinâmico (ex: troca de idioma) para que
 * os novos nós entrem nas animações de scroll. */
export function refreshDynamicAnimations() {
  if (prefersReducedMotion()) {
    gsap.set('[data-reveal]', { opacity: 1, y: 0 })
    return
  }

  cleanupOrphanTriggers()
  scrollReveals()
  counters()
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
