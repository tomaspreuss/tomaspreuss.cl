// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();

const NAV_BAR = document.getElementById('navBar');
const NAV_LIST = document.getElementById('navList');
const HERO_HEADER = document.getElementById('heroHeader');
const HAMBURGER_BTN = document.getElementById('hamburgerBtn');
const NAV_LINKS = Array.from(document.querySelectorAll('.nav__list-link'));
const SERVICE_BOXES = document.querySelectorAll('.service-card__box');
const ACTIVE_LINK_CLASS = 'active';
const BREAKPOINT = 576;

let currentServiceBG = null;
let currentActiveLink = document.querySelector('.nav__list-link.active');

// Utilidades
const getNavHeight = () => (NAV_BAR ? NAV_BAR.getBoundingClientRect().height : 0);

const resetActiveState = () => {
  if (!NAV_LIST) return;
  NAV_LIST.classList.remove('nav--active');
  NAV_LIST.style.height = null;
  document.body.style.overflowY = null;
};

const addPaddingToHeroHeaderFn = () => {
  if (!HERO_HEADER) return;
  HERO_HEADER.style.paddingTop = `${getNavHeight()}px`;
};

// Init
addPaddingToHeroHeaderFn();
window.addEventListener('resize', () => {
  addPaddingToHeroHeaderFn();
  if (window.innerWidth >= BREAKPOINT) resetActiveState();
});

// Scrollspy simple
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('#heroHeader, #services, #works, #contact');
  const y = window.scrollY + getNavHeight() + 1;

  sections.forEach((section) => {
    if (!section) return;
    const top = section.offsetTop;
    if (y >= top) {
      const id = section.getAttribute('id');
      const link = NAV_LINKS.find(l => l.getAttribute('href')?.endsWith(`#${id}`));
      if (link && currentActiveLink !== link) {
        currentActiveLink?.classList.remove(ACTIVE_LINK_CLASS);
        link.classList.add(ACTIVE_LINK_CLASS);
        currentActiveLink = link;
      }
    }
  });
});

// Menú móvil
HAMBURGER_BTN?.addEventListener('click', () => {
  if (!NAV_LIST) return;
  const isActive = NAV_LIST.classList.toggle('nav--active');
  document.body.style.overflowY = isActive ? 'hidden' : null;
  NAV_LIST.style.height = isActive ? '100vh' : '0';
  HAMBURGER_BTN.setAttribute('aria-expanded', String(isActive));
});

// Cerrar menú al navegar
NAV_LINKS.forEach((link) => {
  link.addEventListener('click', () => {
    resetActiveState();
    link.blur();
  });
});

// Hover “glow” en tarjetas de servicios
SERVICE_BOXES.forEach((service) => {
  const moveBG = (x, y) => {
    if (!currentServiceBG) return;
    currentServiceBG.style.left = `${x}px`;
    currentServiceBG.style.top = `${y}px`;
  };

  service.addEventListener('mouseenter', (e) => {
    currentServiceBG = service.querySelector('.service-card__bg');
    if (!currentServiceBG) return;
    const rect = service.getBoundingClientRect();
    moveBG(e.clientX - rect.left, e.clientY - rect.top);
  });

  service.addEventListener('mousemove', (e) => {
    if (!currentServiceBG) return;
    const rect = service.getBoundingClientRect();
    moveBG(e.clientX - rect.left, e.clientY - rect.top);
  });

  service.addEventListener('mouseleave', () => {
    const img = service.querySelector('.service-card__illustration');
    if (!currentServiceBG || !img) { currentServiceBG = null; return; }
    const w = currentServiceBG.getBoundingClientRect().width;
    const h = currentServiceBG.getBoundingClientRect().height;
    moveBG(img.offsetLeft + w, img.offsetTop + h);
    currentServiceBG = null;
  });
});

// Smooth scroll (SweetScroll)
if (typeof SweetScroll !== 'undefined') {
  new SweetScroll({
    trigger: '.nav__list-link',
    easing: 'easeOutQuint',
    offset: () => getNavHeight() - 10
  });
}

// Validación mínima de formulario (demo)
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name || !email) {
    alert('Por favor, completa nombre y email.');
    return;
  }
  alert('Gracias. Responderé pronto.');
  e.target.reset();
});