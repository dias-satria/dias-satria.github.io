// Mobile menu
const nav = document.querySelector('.nav');
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// Highlight the nav link for the section in view
const links = [...menu.querySelectorAll(':scope > a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const href = e.target.classList.contains('hero') ? '#top' : '#' + e.target.id;
    const hit = links.find(l => l.getAttribute('href') === href);
    if (hit) links.forEach(l => l.classList.toggle('active', l === hit));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('.hero, #about, #events, #gallery, #news').forEach(el => spy.observe(el));

// Hero slider
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dots button')];
let current = 0, timer;
function show(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle('is-active', n === current));
  dots.forEach((d, n) => d.setAttribute('aria-selected', n === current));
}
function play() { clearInterval(timer); timer = setInterval(() => show(current + 1), 6000); }
dots.forEach((d, n) => d.addEventListener('click', () => { show(n); play(); }));
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) play();

// Upcoming events with type tabs
const EVENTS = {
  webinar: [
    { title: 'Spotting Gaps in the AgriCulture Supply Chain', date: '29 September 2026', time: '09:00 AM – 03:00 PM', place: 'Zoom Meeting', img: 'img/event-1.jpg' },
    { title: 'Regenerative Business Models for Farmers', date: '04 October 2026', time: '10:00 AM – 01:00 PM', place: 'Zoom Meeting', img: 'img/event-2.jpg' },
    { title: 'Raising Your First Ideas in AgTech Round', date: '11 October 2026', time: '08:00 AM – 02:00 PM', place: 'Zoom Meeting', img: 'img/event-3.jpg' },
    { title: 'AI & Sensors: The Next Farm Frontier Technology', date: '18 October 2026', time: '01:00 PM – 05:00 PM', place: 'Zoom Meeting', img: 'img/event-4.jpg' },
  ],
  seminar: [
    { title: 'AgriStartup Summit 2026: Building the Ecosystem', date: '24 October 2026', time: '08:00 AM – 04:00 PM', place: 'Universitas Brawijaya, Malang', img: 'img/event-3.jpg' },
    { title: 'Funding Your Agritech Idea', date: '31 October 2026', time: '09:00 AM – 12:00 PM', place: 'Yogyakarta', img: 'img/event-2.jpg' },
    { title: 'Data-Driven Farming for Smallholders', date: '07 November 2026', time: '01:00 PM – 04:00 PM', place: 'Bandar Lampung', img: 'img/event-1.jpg' },
    { title: 'From Lab to Market: Commercialising Agri Research', date: '14 November 2026', time: '09:00 AM – 01:00 PM', place: 'Universitas Brawijaya, Malang', img: 'img/event-4.jpg' },
  ],
  workshop: [
    { title: 'Intensive Workshop: From Farm to Startup — Malang', date: '21 November 2026', time: '08:00 AM – 05:00 PM', place: 'Malang', img: 'img/gallery-1.jpg' },
    { title: 'Intensive Workshop: From Farm to Startup — Yogyakarta', date: '28 November 2026', time: '08:00 AM – 05:00 PM', place: 'Yogyakarta', img: 'img/gallery-3.jpg' },
    { title: 'Intensive Workshop: From Farm to Startup — Lampung', date: '05 December 2026', time: '08:00 AM – 05:00 PM', place: 'Bandar Lampung', img: 'img/gallery-2.jpg' },
    { title: 'Pitch Clinic: Telling Your AgTech Story', date: '12 December 2026', time: '01:00 PM – 04:00 PM', place: 'Zoom Meeting', img: 'img/event-3.jpg' },
  ],
};
const grid = document.getElementById('event-grid');
const ico = id => `<svg viewBox="0 0 24 24"><use href="#${id}"/></svg>`;
function renderEvents(type) {
  grid.innerHTML = EVENTS[type].map((e, i) => `
    <article class="ecard" style="animation-delay:${i * 60}ms">
      <img src="${e.img}" alt="" loading="lazy">
      <div class="ecard-body">
        <h3>${e.title}</h3>
        <ul class="meta">
          <li>${ico('ic-cal')}${e.date}</li>
          <li>${ico('ic-clock')}${e.time}</li>
          <li>${ico('ic-pin')}${e.place}</li>
        </ul>
        <a href="#current" class="btn btn-primary">Detail Event</a>
      </div>
    </article>`).join('');
}
document.querySelectorAll('.tabs button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b === btn));
  renderEvents(btn.dataset.type);
}));
renderEvents('webinar');

// Count-up stats when visible
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + '+';
      if (p < 1) requestAnimationFrame(step);
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(step);
    countObs.unobserve(el);
  });
}, { threshold: .5 });
counters.forEach(c => countObs.observe(c));
