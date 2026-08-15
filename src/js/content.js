// Conteúdo estrutural que não depende de tradução (nomes de tecnologias e
// redes sociais são universais).
// Django e Bootstrap ainda usam ícone placeholder (letra), sem arquivo real
// deles em assets/icons ainda.

export const SKILLS = [
  { name: 'Python', icon: '/assets/icons/python.svg' },
  { name: 'Django', icon: '/assets/icons/django-placeholder.svg' },
  { name: 'HTML5', icon: '/assets/icons/html.svg' },
  { name: 'CSS3', icon: '/assets/icons/css.svg' },
  { name: 'JavaScript', icon: '/assets/icons/javascript.svg' },
  { name: 'Bootstrap', icon: '/assets/icons/bootstrap-placeholder.svg' },
  { name: 'Git', icon: '/assets/icons/git-placeholder.svg' },
  { name: 'Shopify', icon: '/assets/icons/shopify.svg' },
  { name: 'Magnific', icon: '/assets/icons/magnific.svg' },
  { name: 'Liquid', icon: '/assets/icons/liquid.svg' }
]

// Ícone por tecnologia nas tags dos cards de projeto — só as que já temos
// arquivo em assets/icons; o resto cai pra texto puro.
const TAG_ICONS = {
  HTML: '/assets/icons/html.svg',
  CSS: '/assets/icons/css.svg',
  JavaScript: '/assets/icons/javascript.svg',
  Python: '/assets/icons/python.svg',
  Vue: '/assets/icons/vue.svg',
  Git: '/assets/icons/git-placeholder.svg',
  Figma: '/assets/icons/figma.svg',
  Tailwind: '/assets/icons/tailwind.svg',
  Bootstrap: '/assets/icons/bootstrap-placeholder.svg',
  Django: '/assets/icons/django-placeholder.svg',
  Shopify: '/assets/icons/shopify.svg',
  Magnific: '/assets/icons/magnific.svg',
  Liquid: '/assets/icons/liquid.svg'
}

export const SOCIALS = [
  { name: 'GitHub', icon: '/assets/icons/github.svg', href: 'https://github.com/Dsm0514' },
  { name: 'LinkedIn', icon: '/assets/icons/linkedin.svg', href: 'https://www.linkedin.com/in/davi-schmitz-mariano-b0013621b/' },
  { name: 'Instagram', icon: '/assets/icons/instagram.svg', href: 'https://www.instagram.com/davisch.dev/' },
  { name: 'Blog', icon: '/assets/icons/blog-placeholder.svg', href: 'https://dsm0514.github.io/mitzideas/' },
  { name: 'Email', icon: '/assets/icons/email-placeholder.svg', href: 'mailto:davimarianosm@gmail.com' }
]

const el = (tag, className, html) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (html !== undefined) node.innerHTML = html
  return node
}

function renderProjects(dict) {
  const grid = document.getElementById('projects-grid')
  if (!grid) return

  grid.innerHTML = ''

  dict.projects.items.forEach((project) => {
    const card = el(
      'article',
      'group relative flex flex-col gap-6 border-t border-gray-800 py-10 lg:flex-row lg:items-center lg:gap-10'
    )
    card.dataset.reveal = ''

    const thumb = project.image
      ? `<picture>
          <source type="image/webp" srcset="${project.image}.webp" />
          <img
            src="${project.image}.png"
            alt=""
            class="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </picture>`
      : `<div class="flex h-full w-full items-center justify-center border border-dashed border-gray-600 text-center text-xs uppercase tracking-widest text-gray-400">
          Imagem do projeto
        </div>`

    const thumbBoxClass = project.image
      ? 'aspect-[16/10] w-full shrink-0 lg:w-96'
      : 'aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-gray-800 lg:w-72'

    card.innerHTML = `
      <div class="${thumbBoxClass}" role="img" aria-label="${project.title}">
        ${thumb}
      </div>

      <div class="flex flex-1 flex-col gap-3">
        <h3 class="font-display text-2xl text-paper md:text-3xl">${project.title}</h3>
        <p class="max-w-xl text-sm text-gray-400 md:text-base">${project.description}</p>
        <ul class="flex flex-wrap gap-2 pt-1">
          ${project.tags
            .map((tag) => {
              const icon = TAG_ICONS[tag]
              const iconHtml = icon
                ? `<span aria-hidden="true" class="icon-mask h-3 w-3 bg-current" style="mask-image:url(${icon}); -webkit-mask-image:url(${icon});"></span>`
                : ''
              return `<li class="flex items-center gap-1.5 rounded-full border border-gray-800 px-3 py-1 text-xs text-gray-400">${iconHtml}${tag}</li>`
            })
            .join('')}
        </ul>
      </div>

      <div class="flex shrink-0 flex-col items-start gap-3 self-start lg:items-end lg:self-center">
        ${
          project.link
            ? `<a
                href="${project.link}"
                target="_blank"
                rel="noopener noreferrer"
                class="link-underline flex items-center gap-2 text-sm text-paper"
                aria-label="${dict.projects.viewProject}: ${project.title}"
              >
                ${dict.projects.viewProject}
                <span aria-hidden="true" class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>`
            : ''
        }
        ${
          project.repo
            ? `<a
                href="${project.repo}"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-300 hover:text-paper"
                aria-label="${dict.projects.viewRepo}: ${project.title}"
              >
                <span aria-hidden="true" class="icon-mask h-4 w-4 bg-current" style="mask-image:url(/assets/icons/github.svg); -webkit-mask-image:url(/assets/icons/github.svg);"></span>
                ${dict.projects.viewRepo}
              </a>`
            : ''
        }
      </div>
    `

    grid.appendChild(card)
  })
}

function renderStats(dict) {
  const container = document.getElementById('about-stats')
  if (!container) return

  // PLACEHOLDER: "Projetos entregues" (índice 1) comentado até termos algum
  // projeto entregue de fato — descomente a linha abaixo pra reativar.
  const stats = dict.about.stats.filter((_, index) => index !== 1)
  // const stats = dict.about.stats

  container.innerHTML = ''
  // Classes por extenso (não interpoladas) pra o Tailwind conseguir gerar o CSS.
  container.className = stats.length === 3 ? 'grid grid-cols-3 gap-6' : 'grid grid-cols-2 gap-6'

  stats.forEach((stat) => {
    const block = el('div', 'flex flex-col gap-2 border-t border-gray-800 pt-4')
    const numeric = parseFloat(stat.value.replace(/[^0-9.]/g, '')) || 0
    const prefix = stat.value.match(/^[^0-9]*/)?.[0] ?? ''
    const suffix = stat.value.match(/[^0-9]*$/)?.[0] ?? ''

    block.innerHTML = `
      <span
        class="font-display text-4xl text-paper md:text-5xl"
        data-counter
        data-counter-target="${numeric}"
        data-counter-prefix="${prefix}"
        data-counter-suffix="${suffix}"
      >${prefix}0${suffix}</span>
      <span class="text-sm text-gray-400">${stat.label}</span>
    `
    container.appendChild(block)
  })
}

// Renderiza a lista 4x lado a lado: a animação translada a faixa em -25% do
// próprio comprimento (a largura de 1 cópia), então a cópia seguinte entra
// exatamente onde a anterior terminou — sem esse "espelho" o loop mostraria
// um salto no final. Duas cópias não bastam: em telas largas (site vai até
// 1920px) a faixa de uma cópia só é mais estreita que a viewport, e sobra um
// vão vazio depois do último item (Git) antes do loop reiniciar.
function renderSkills() {
  const container = document.getElementById('skills-grid')
  if (!container || container.dataset.rendered) return

  const buildItem = (skill, isDuplicate) => {
    const item = el(
      'div',
      'marquee-item flex w-36 shrink-0 flex-col items-center gap-4 rounded-2xl border border-gray-800 px-6 py-10 text-center'
    )
    if (isDuplicate) item.setAttribute('aria-hidden', 'true')
    item.innerHTML = `
      <span
        aria-hidden="true"
        class="icon-mask h-10 w-10 bg-gray-300"
        style="mask-image:url(${skill.icon}); -webkit-mask-image:url(${skill.icon});"
      ></span>
      <span class="text-sm text-gray-300">${skill.name}</span>
    `
    return item
  }

  SKILLS.forEach((skill) => container.appendChild(buildItem(skill, false)))
  SKILLS.forEach((skill) => container.appendChild(buildItem(skill, true)))
  SKILLS.forEach((skill) => container.appendChild(buildItem(skill, true)))
  SKILLS.forEach((skill) => container.appendChild(buildItem(skill, true)))

  container.dataset.rendered = 'true'
}

// Botões circulares só com ícone (nome vai em aria-label/title). Em texto +
// ícone, os 5 links juntos ("GitHub", "LinkedIn"...) não cabem numa tela de
// celular e furam a largura da página — por isso o formato compacto.
function renderSocials() {
  document.querySelectorAll('[data-socials]').forEach((container) => {
    if (container.dataset.rendered) return

    SOCIALS.forEach((social) => {
      const link = el(
        'a',
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-800 text-gray-300 transition-colors duration-300 hover:border-paper hover:text-paper md:h-14 md:w-14'
      )
      link.href = social.href
      link.title = social.name
      link.setAttribute('aria-label', social.name)
      if (social.href.startsWith('http')) {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
      }
      link.innerHTML = `
        <span
          aria-hidden="true"
          class="icon-mask h-5 w-5 bg-current md:h-6 md:w-6"
          style="mask-image:url(${social.icon}); -webkit-mask-image:url(${social.icon});"
        ></span>
      `
      container.appendChild(link)
    })

    container.dataset.rendered = 'true'
  })
}

export function renderDynamicContent(dict) {
  renderProjects(dict)
  renderStats(dict)
  renderSkills()
  renderSocials()
}
