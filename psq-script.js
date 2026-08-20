/* ---------- Scroll progress bar ---------- */
const progressBar = document.getElementById('scrollProgress');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('siteNav');
const onScroll = () => nav.classList.toggle('solid', window.scrollY > 60);
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile burger ---------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

/* ---------- Count-up stats ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = prefix + val.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
  });
}, { threshold: 0.4 });
countEls.forEach(el => countIO.observe(el));

/* ---------- Unit card fill bars trigger ---------- */
const unitCards = document.querySelectorAll('.unit-card');
const unitIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.3 });
unitCards.forEach(c => unitIO.observe(c));

/* ---------- Unit tab selector (Residences / Corporate Suites) ---------- */
const unitTabs = document.querySelectorAll('.unit-tab');
const unitViews = document.querySelectorAll('.unit-view');
function openUnitView(name) {
  unitTabs.forEach(t => t.classList.toggle('active', t.dataset.unit === name));
  unitViews.forEach(v => v.classList.toggle('active', v.dataset.view === name));
}
unitTabs.forEach(tab => tab.addEventListener('click', () => openUnitView(tab.dataset.unit)));
document.querySelectorAll('[data-open-unit]').forEach(a => {
  a.addEventListener('click', () => setTimeout(() => openUnitView(a.dataset.openUnit), 300));
});

/* ---------- Hero parallax on pointer move ---------- */
const heroSkyline = document.getElementById('heroSkyline');
const heroGlow = document.querySelector('.hero-glow');
if (heroSkyline && window.matchMedia('(pointer:fine)').matches) {
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    heroSkyline.style.transform = `translate(${x * 0.4}px, ${y * 0.3}px)`;
    if (heroGlow) heroGlow.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCap');
function openLightbox(src, cap) {
  lightboxImg.src = src;
  lightboxCap.textContent = cap || '';
  lightbox.classList.add('open');
}
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
document.querySelectorAll('.g-item').forEach(item => item.addEventListener('click', () =>
  openLightbox(item.dataset.full, item.dataset.cap)));

/* ---------- Compare strip active chip ---------- */
document.querySelectorAll('.compare-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.compare-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

/* ---------- Lead form ---------- */
const WEB3FORMS_ACCESS_KEY = 'c8878a10-8b2c-4b76-b356-bc29c6896248';
const form = document.getElementById('leadForm');
const fields = document.getElementById('formFields');
const success = document.getElementById('formSuccess');
const waLink = document.getElementById('waLink');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  const propertyField = document.getElementById('f-property').closest('.field');
  const nameField = document.getElementById('f-name').closest('.field');
  const phoneField = document.getElementById('f-phone').closest('.field');
  const emailField = document.getElementById('f-email').closest('.field');

  [propertyField, nameField, phoneField, emailField].forEach(f => f.classList.remove('invalid'));

  const property = document.getElementById('f-property').value;
  const name = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();

  if (!property) { propertyField.classList.add('invalid'); valid = false; }
  if (name.length < 2) { nameField.classList.add('invalid'); valid = false; }
  if (!/^[+0-9 ()-]{7,}$/.test(phone)) { phoneField.classList.add('invalid'); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailField.classList.add('invalid'); valid = false; }

  if (!valid) return;

  waLink.href = `https://wa.me/60126786593?text=${encodeURIComponent(
    `Hi Sherwin! I'm interested in Pavilion Square, Bukit Bintang.\n\nInterest: ${property}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}` +
    (message ? `\nMessage: ${message}` : '')
  )}`;

  const botcheck = document.querySelector('#leadForm [name="botcheck"]');
  if (!botcheck.checked) {
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New Pavilion Square Enquiry',
        from_name: 'Pavilion Square Website',
        property,
        name,
        phone,
        email,
        message
      })
    }).catch(err => console.error('Web3Forms submit failed:', err));
  }

  fields.style.display = 'none';
  success.classList.add('show');

  const basePath = window.location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  window.history.pushState({}, '', basePath + 'thankyou');
});
