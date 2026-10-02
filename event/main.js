// Shared layout, data and page behaviour for the Digital Agtech Indonesia event site.
// Each page sets <body data-page="..."> and leaves #site-header / #site-footer empty.

const REGISTER_URL = 'https://bit.ly/Agtech2026';
const EVENT_START = new Date('2026-10-04T10:00:00+07:00');
const arrow = '<svg class="i" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ico = id => `<svg viewBox="0 0 24 24"><use href="#${id}"/></svg>`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- data ---------- */
const SPEAKERS = [
  { name: 'Ahmad Syaifulloh', role: 'CTO Chickin', img: 'sp-ahmad' },
  { name: 'Rossena Karisma Rosul', role: 'Founder FDS', img: 'sp-rossena' },
  { name: 'Aryo Wiryawan', role: 'Founder JALA', img: 'sp-aryo' },
  { name: 'Andina Paramitha', role: 'Founder RVare.id', img: 'sp-andina' },
  { name: 'Asri Wijayanti', role: 'Founder MVP Room', img: 'sp-asri' },
  { name: 'Pukka Simbolon', role: 'Founder Capcapung', img: 'sp-pukka' },
  { name: 'Catur Sugiarto, Ph.D.', role: 'President AIBI', img: 'sp-catur' },
  { name: 'Rama Mamuaya', role: 'Tech. Investment. Policy', img: 'sp-rama' },
  { name: 'Dias Satria, Ph.D.', role: 'Head of Innovation Universitas Brawijaya', img: 'sp-dias' },
  { name: 'Justin Ahmed', role: 'Beanstalk Australia', img: 'sp-justin' },
];

const EVENTS = {
  webinar: [
    { title: 'Spotting Gaps in the AgriCulture Supply Chain', date: '29 September 2026', time: '09:00 AM – 03:00 PM', place: 'Zoom Meeting', img: 'event-1' },
    { title: 'Regenerative Business Models for Farmers', date: '04 October 2026', time: '10:00 AM – 01:00 PM', place: 'Zoom Meeting', img: 'event-2' },
    { title: 'Raising Your First Ideas in AgTech Round', date: '11 October 2026', time: '08:00 AM – 02:00 PM', place: 'Zoom Meeting', img: 'event-3' },
    { title: 'AI & Sensors: The Next Farm Frontier Technology', date: '18 October 2026', time: '01:00 PM – 05:00 PM', place: 'Zoom Meeting', img: 'event-4' },
  ],
  seminar: [
    { title: 'AgriStartup Summit 2026', date: '24 October 2026', time: '08:00 AM – 04:00 PM', place: 'Universitas Brawijaya, Malang', img: 'gallery-06' },
    { title: 'Funding Your Agritech Idea', date: '31 October 2026', time: '09:00 AM – 12:00 PM', place: 'Yogyakarta', img: 'gallery-08' },
  ],
  workshop: [
    { title: 'Intensive Workshop: From Farm to Startup — Malang', date: '21 November 2026', time: '08:00 AM – 05:00 PM', place: 'Malang Creative Center (MCC)', img: 'gallery-05' },
    { title: 'Intensive Workshop: From Farm to Startup — Yogyakarta', date: '28 November 2026', time: '08:00 AM – 05:00 PM', place: 'Yogyakarta', img: 'gallery-11' },
    { title: 'Intensive Workshop: From Farm to Startup — Lampung', date: '05 December 2026', time: '08:00 AM – 05:00 PM', place: 'Bandar Lampung', img: 'gallery-12' },
  ],
};

const NEWS = [
  { title: 'How Technology Is Transforming Agriculture for a Smarter Future', img: 'news-1', alt: 'Aerial view of a sprayer tractor crossing crop rows' },
  { title: 'Computer Vision Is Catching Disease in Greenhouse Crops', img: 'news-2', alt: 'Rows of tomato plants inside a greenhouse' },
  { title: 'Vertical Farming Reaches Cost Parity With Field Crops', img: 'news-3', alt: 'Two researchers inspecting seedlings in a vertical farm' },
  { title: 'Regenerative Soil Startups Draw $2.4B in Climate-Focused VC Investment', img: 'news-4', alt: 'Young corn plants growing in dark soil' },
  { title: 'Harvest Automation Startups Are Closing the Agricultural Labor Gap', img: 'news-5', alt: 'Aerial view of harvesters working a field' },
  { title: 'IoT Soil Sensors Cut Water Use by 30% Across California Row Crops', img: 'news-6', alt: 'Rows of crops at sunset' },
];

const GALLERY = [
  'Workshop participants cheering with their idea boards',
  'A mentor speaking with participants during a session',
  'Participants mapping ideas with sticky notes on a wall',
  'A participant writing on cards at a workshop table',
  'Teams building prototypes around a table',
  'Audience listening to a presentation at Kita Tani Muda',
  'Participants discussing around a table',
  'Mentors and participants at a networking session',
  'Participants working together on a group exercise',
  'A team presenting their idea board',
  'A participant reviewing a business model canvas',
  'Participants holding up a board of sticky notes',
  'A participant adding ideas to a sticky-note board',
  'A crowded hands-on session at a workshop table',
  'A participant arranging sticky notes on a board',
];

/* ---------- header & footer ---------- */
const page = document.body.dataset.page || 'home';
const NAV = [
  { label: 'Home', href: 'index.html', id: 'home' },
  { label: 'About', href: 'index.html#about', id: 'about' },
  { label: 'Events', href: 'index.html#events', id: 'events' },
  { label: 'Gallery', href: 'gallery.html', id: 'gallery' },
  { label: 'News', href: 'news.html', id: 'news' },
  // A null href renders the item as a non-clickable "Segera hadir" entry.
  { label: 'Program', id: 'program', items: [
    ['Self-Learning Program', null], ['Diagnose Test', null], ['Business Incubation', null], ['Courses', null],
  ] },
  { label: 'Learning', id: 'learning', items: [
    ['Jagoan Tani Banyuwangi', '#'], ['Kita Tani Muda Semarang', '#'],
  ] },
];
const chev = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const active = ['event', 'speakers'].includes(page) ? 'events' : page;
  el.className = 'nav';
  el.innerHTML = `
  <div class="wrap nav-inner">
    <a href="index.html" class="brand" aria-label="Digital Agtech Indonesia — home">Digital<br>Agtech<br>Indonesia</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span><span></span></button>
    <nav id="menu" class="menu" aria-label="Main">
      ${NAV.map(n => n.items ? `
        <div class="drop">
          <button type="button" aria-expanded="false">${n.label}${chev}</button>
          <div class="drop-panel">${n.items.map(([l, h]) => h
            ? `<a href="${h}">${l}</a>`
            : `<span class="soon" aria-disabled="true">${l}<small>Segera hadir</small></span>`).join('')}</div>
        </div>` : `<a class="menu-link${n.id === active ? ' active' : ''}" href="${n.href}"${n.id === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
      <div class="menu-cta">
        <a href="#" class="btn btn-outline">Login</a>
        <a href="${REGISTER_URL}" target="_blank" rel="noopener" class="btn btn-primary">Register</a>
      </div>
    </nav>
  </div>`;

  const menuBtn = el.querySelector('.menu-btn');
  const menu = el.querySelector('#menu');
  const setOpen = open => {
    menu.classList.toggle('open', open);
    el.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  };
  menuBtn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  const drops = [...el.querySelectorAll('.drop')];
  const closeDrops = except => drops.forEach(d => {
    if (d === except) return;
    d.classList.remove('open');
    d.querySelector('button').setAttribute('aria-expanded', 'false');
  });
  drops.forEach(d => d.querySelector('button').addEventListener('click', e => {
    e.stopPropagation();
    const open = !d.classList.contains('open');
    closeDrops(d);
    d.classList.toggle('open', open);
    e.currentTarget.setAttribute('aria-expanded', open);
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.drop')) closeDrops(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrops(); setOpen(false); } });
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.className = 'footer' + (el.dataset.flush !== undefined ? ' flush' : '');
  el.innerHTML = `
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <p class="foot-brand">Agtech</p>
        <p class="foot-desc">Southeast Asia’s leading platform for agritech founders, innovators, and young agricultural entrepreneurs.</p>
        <div class="foot-social">
          <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.2-.8.5-1.6.8-2.5 1A4 4 0 0 0 12 8.9 11.4 11.4 0 0 1 3.7 4.7a4 4 0 0 0 1.2 5.4c-.6 0-1.3-.2-1.8-.5 0 2 1.4 3.6 3.2 4a4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 2 18.1 11.4 11.4 0 0 0 8.2 20c7.4 0 11.5-6.2 11.5-11.5v-.5c.9-.6 1.6-1.3 2.3-2.1z"/></svg></a>
          <a href="#" aria-label="Instagram">${ico('ic-ig')}</a>
          <a href="#" aria-label="LinkedIn">${ico('ic-in')}</a>
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/></svg></a>
        </div>
      </div>
      <div>
        <p class="foot-h">${page === 'home' ? 'Program' : 'Events'}</p>
        <ul><li><a href="index.html#events">AgriStartup Summit 2026</a></li><li><a href="event.html">From Farm to Startup</a></li><li><a href="index.html#events">Funding Your Agritech Idea</a></li><li><a href="index.html#events">View All Events</a></li><li><a href="gallery.html">Past Events</a></li></ul>
      </div>
      <div>
        <p class="foot-h">About</p>
        <ul><li><a href="speakers.html">Speakers</a></li><li><a href="index.html#partners">Partners</a></li><li><a href="gallery.html">Documentation</a></li><li><a href="mailto:agtech@gmail.com">Contact Us</a></li><li><a href="#">Privacy Policy</a></li></ul>
      </div>
      <div>
        <p class="foot-h">Stay Updated</p>
        <p class="foot-desc">Get early access to events, speaker announcements, and agritech insights.</p>
        <form class="subscribe">
          <label class="sr" for="email">Email</label>
          <input id="email" type="email" placeholder="Your email" required>
          <button type="submit">Go</button>
        </form>
        <p class="foot-contact"><b>Contact</b><a href="mailto:agtech@gmail.com">agtech@gmail.com</a><span>Malang, Indonesia</span></p>
      </div>
    </div>
    <div class="foot-bottom">
      <p>© 2026 powered by Jagoan Indonesia. All rights reserved.</p>
      <p><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a></p>
    </div>
  </div>`;
  el.querySelector('.subscribe').addEventListener('submit', e => {
    e.preventDefault();
    e.target.querySelector('input').value = '';
    e.target.querySelector('button').textContent = '✓';
  });
}

/* ---------- reusable renderers ---------- */
function speakerCard(s) {
  return `
  <article class="speaker">
    <div class="speaker-photo"><img src="img/${s.img}.jpg" alt="${esc(s.name)}" loading="lazy"></div>
    <div class="speaker-body">
      <h3>${esc(s.name)}</h3><p>${esc(s.role)}</p>
      <div class="socials"><a href="#" aria-label="${esc(s.name)} on LinkedIn">${ico('ic-in')}</a><a href="#" aria-label="${esc(s.name)} on Instagram">${ico('ic-ig')}</a></div>
    </div>
  </article>`;
}
function newsCard(n) {
  return `
  <article class="news">
    <a class="news-img" href="news-detail.html" tabindex="-1" aria-hidden="true"><img src="img/${n.img}.jpg" alt="" loading="lazy"></a>
    <div class="news-body">
      <p class="byline">${ico('ic-user')}Digital AgTech Editorial Team</p>
      <h3><a href="news-detail.html">${esc(n.title)}</a></h3>
      <a href="news-detail.html" class="more" aria-label="View details: ${esc(n.title)}">View Details ${arrow}</a>
    </div>
  </article>`;
}
function fill(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

function initEventTabs() {
  const grid = document.getElementById('event-grid');
  if (!grid) return;
  const render = type => {
    grid.innerHTML = EVENTS[type].map((e, i) => `
      <article class="ecard" style="animation-delay:${i * 60}ms">
        <img src="img/${e.img}.jpg" alt="" loading="lazy">
        <div class="ecard-body">
          <h3>${esc(e.title)}</h3>
          <ul class="meta">
            <li>${ico('ic-cal')}${e.date}</li>
            <li>${ico('ic-clock')}${e.time}</li>
            <li>${ico('ic-pin')}${esc(e.place)}</li>
          </ul>
          <a href="event.html" class="btn btn-primary">Detail Event</a>
        </div>
      </article>`).join('');
  };
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.setAttribute('aria-selected', b === btn));
    render(btn.dataset.type);
  }));
  render('webinar');
}

function initCounters() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    obs.unobserve(e.target);
    if (reduce) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + '+';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(c => obs.observe(c));
}

function initCountdown() {
  const box = document.getElementById('countdown');
  if (!box) return;
  const parts = ['days', 'hours', 'minutes', 'seconds'].map(k => box.querySelector(`[data-cd="${k}"]`));
  const tick = () => {
    let s = Math.max(0, Math.floor((EVENT_START - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    parts.forEach((el, i) => { el.textContent = String(v[i]).padStart(2, '0'); });
    if (s === 0) { box.querySelector('.cd-top b').textContent = 'The event has started'; clearInterval(timer); }
  };
  const timer = setInterval(tick, 1000);
  tick();
}

function initDetailTabs() {
  const tabs = [...document.querySelectorAll('.dtabs [role="tab"]')];
  if (!tabs.length) return;
  const show = (id, focus) => {
    const tab = tabs.find(t => t.dataset.tab === id) || tabs[0];
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById('panel-' + t.dataset.tab).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); });
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      show(next.dataset.tab, true);
      history.replaceState(null, '', '#' + next.dataset.tab);
    });
  });
  show(location.hash.slice(1));
}

function initLightbox() {
  const grid = document.querySelector('[data-lightbox]');
  if (!grid) return;
  const items = [...grid.querySelectorAll('button')];
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<img alt=""><button class="lb-close" aria-label="Close">×</button><button class="lb-prev" aria-label="Previous photo">‹</button><button class="lb-next" aria-label="Next photo">›</button>';
  document.body.appendChild(lb);
  const img = lb.querySelector('img');
  let idx = 0, opener;
  const open = i => {
    idx = (i + items.length) % items.length;
    const src = items[idx].querySelector('img');
    img.src = src.src; img.alt = src.alt;
    lb.classList.add('open');
  };
  const close = () => { lb.classList.remove('open'); opener && opener.focus(); };
  items.forEach((b, i) => b.addEventListener('click', () => { opener = b; open(i); lb.querySelector('.lb-close').focus(); }));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => open(idx - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => open(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(idx - 1);
    if (e.key === 'ArrowRight') open(idx + 1);
  });
}

/* ---------- icon sprite ---------- */
const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="ic-in" viewBox="0 0 24 24"><path d="M6.5 9.5v8M6.5 6.5v.01M10.5 17.5v-8M10.5 12.5c0-1.7 1.3-3 3-3s3 1.3 3 3v5"/></symbol>
  <symbol id="ic-ig" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2v.01"/></symbol>
  <symbol id="ic-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></symbol>
  <symbol id="ic-cal" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></symbol>
  <symbol id="ic-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
  <symbol id="ic-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></symbol>
  <symbol id="ic-globe2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></symbol>
  <symbol id="ic-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></symbol>
  <symbol id="ic-rocket" viewBox="0 0 24 24"><path d="M14.5 4.5c2.5-1.4 5-1.5 5-1.5s-.1 2.5-1.5 5l-6.5 6.5-3.5-3.5z"/><path d="M8 11 5 10.5l3-3h4.5M13 16l.5 3 3-3v-4.5M8 16c-1.2 1.2-3.5 1.5-3.5 1.5S4.8 15.2 6 14"/></symbol>
  <symbol id="ic-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M7 5.5c1.5 1.5 1 3 2.5 3.5s2.5 0 3 1.5-1.5 2-1 3.5 2 1.5 2 3.5M17.5 6.5c-1 .5-2 1.5-1.5 3s2 1 3 2"/></symbol>
  <symbol id="ic-users" viewBox="0 0 24 24"><circle cx="8" cy="8" r="2.8"/><circle cx="16" cy="8" r="2.8"/><path d="M3 19c0-3 2.2-5 5-5s5 2 5 5M11 19c0-3 2.2-5 5-5s5 2 5 5"/></symbol>
  <symbol id="ic-mentor" viewBox="0 0 24 24"><circle cx="7" cy="9" r="2.6"/><path d="M2.5 20.5c0-3 2-5 4.5-5s4.5 2 4.5 5M10 3.5h11v9h-6l-3 2.5v-2.5h-2zM13 8l1.8 1.8L18 6.5"/></symbol>
  <symbol id="ic-sprout" viewBox="0 0 24 24"><path d="M5 13h14l-1.6 7H6.6zM12 13V8M12 8c0-2.5-2-4-4.5-4 0 2.5 2 4 4.5 4zM12 8c0-2.5 2-4 4.5-4 0 2.5-2 4-4.5 4z"/></symbol>
  <symbol id="ic-tools" viewBox="0 0 24 24"><path d="M14.5 6.5a3.5 3.5 0 0 0 4.6 4.3l-8.3 8.3a1.8 1.8 0 0 1-2.6-2.6l8.3-8.3a3.5 3.5 0 0 0-2-1.7zM4 4l4.5 4.5M3.5 7.5l4-4M14 14l5.5 5.5"/></symbol>
  <symbol id="ic-hands" viewBox="0 0 24 24"><path d="M2.5 11.5 6 8l3 1 3-2 3.5 1 3-1 3 3.5M6 8l-2 6 5 4.5c.8.7 2 .6 2.6-.2l4.9-5.8M9 9l3.5 3.5M12 13l2.5 2.5M10 15l2 2"/></symbol>
  <symbol id="ic-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></symbol>
  <symbol id="ic-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
</svg>`;

/* ---------- boot ---------- */
document.body.insertAdjacentHTML('afterbegin', SPRITE);
renderHeader();
renderFooter();
document.querySelectorAll('[data-register]').forEach(a => { a.href = REGISTER_URL; a.target = '_blank'; a.rel = 'noopener'; });

fill('speakers-preview', SPEAKERS.slice(0, 4).map(speakerCard).join(''));
fill('speakers-all', SPEAKERS.map(speakerCard).join(''));
fill('news-preview', NEWS.slice(0, 3).map(newsCard).join(''));
fill('news-all', NEWS.map(newsCard).join(''));
fill('gallery-preview', GALLERY.slice(0, 3).map((alt, i) =>
  `<img src="img/gallery-${String(i + 1).padStart(2, '0')}.jpg" alt="${esc(alt)}" loading="lazy" style="border-radius:12px">`).join(''));
fill('gallery-all', GALLERY.map((alt, i) =>
  `<button type="button" aria-label="Open photo: ${esc(alt)}"><img src="img/gallery-${String(i + 1).padStart(2, '0')}.jpg" alt="${esc(alt)}" loading="lazy"></button>`).join(''));

initEventTabs();
initCounters();
initCountdown();
initDetailTabs();
initLightbox();
