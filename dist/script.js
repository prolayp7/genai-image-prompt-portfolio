const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
} else document.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
async function copyText(value, success) {
  try { await navigator.clipboard.writeText(value); showToast(success); }
  catch { showToast('Clipboard unavailable. Select and copy the text manually.'); }
}
document.getElementById('copy-email').addEventListener('click', () => copyText('connect.prolay@gmail.com', 'Email copied to clipboard.'));

const menuButton = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
});

const reviewButton = document.getElementById('review-toggle');
reviewButton.addEventListener('click', () => {
  const active = document.body.classList.toggle('quick-review');
  reviewButton.textContent = active ? 'Full Portfolio' : '3-Minute Review';
  reviewButton.setAttribute('aria-pressed', String(active));
  const target = document.getElementById(location.hash.slice(1));
  if (active && target && !target.getClientRects().length) location.hash = '#top';
});
const creativeButton = document.getElementById('creative-view');
const technicalButton = document.getElementById('technical-view');
function setView(view) {
  const technical = view === 'technical';
  document.body.classList.toggle('technical-view', technical);
  document.querySelectorAll('[data-technical]').forEach((node) => { node.hidden = !technical; });
  creativeButton.setAttribute('aria-pressed', String(!technical));
  technicalButton.setAttribute('aria-pressed', String(technical));
  try { localStorage.setItem('portfolio-view', view); } catch {}
}
creativeButton.addEventListener('click', () => setView('creative'));
technicalButton.addEventListener('click', () => setView('technical'));
try { if (localStorage.getItem('portfolio-view') === 'technical') setView('technical'); } catch {}

const progress = document.getElementById('progress-fill');
let scrollScheduled = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  scrollScheduled = false;
}
addEventListener('scroll', () => {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
updateProgress();
document.getElementById('back-to-top').addEventListener('click', () => scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' }));

const dialog = document.getElementById('artwork-dialog');
const triggers = [...document.querySelectorAll('.artwork-trigger')];
const art = document.getElementById('dialog-art');
let selected = 0;
let returnFocus;
const details = {
  '01-chaotic-birthday': ['Chaotic Birthday', 'Glitch Garden Letters', 'Joyful celebration with room for a personal message', 'Surreal tiered cake; botanical watercolor, fluorescent risograph, edge glitches; reserve upper-left message space.'],
  '02-tender-apology': ['Awkward, but Sincere', 'Tender Brutalism', 'Communicate vulnerability through one honest gesture', 'Hard sheltering geometry, vulnerable pencil character and one repaired object.'],
  '03-cosmic-friendship': ['Same Sky, Different Wi-Fi', 'Cosmic Scrapbook', 'Make distance feel connected', 'Two personal worlds joined by one luminous thread and layered paper ephemera.'],
  '04-breakup-recovery': ['Water Yourself', 'Neo-Bauhaus Surrealism', 'Show recovery as self-reclamation', 'Cracked disco ball grows; discarded red flags become birds.'],
  'before-birthday': ['Chaotic Birthday — initial generation', 'Glitch Garden Letters', 'Find an energetic birthday composition', 'Early exploration with multiple competing objects; later revised for focal clarity.'],
  'before-apology': ['Apology — initial generation', 'Tender Brutalism', 'Find a sincere apology image', 'Early exploration; later revised toward one hesitant character and one repaired object.']
};
function showArtwork(index) {
  selected = (index + triggers.length) % triggers.length;
  const image = triggers[selected].querySelector('img');
  const key = image.getAttribute('src').split('/').pop().replace(/\.webp$/, '');
  const info = details[key] || [image.closest('figure,article')?.querySelector('figcaption b,figcaption, h3')?.textContent?.trim() || image.alt, key.includes('glitch') ? 'Glitch Garden Letters' : key.includes('tender') ? 'Tender Brutalism' : key.includes('cosmic') ? 'Cosmic Scrapbook' : 'Style range study', image.alt, key.includes('glitch') ? 'Botanical watercolor, fluorescent halftone and edge glitches; reserve quiet message space.' : key.includes('tender') ? 'Sheltering geometry, soft paper character and one repaired object.' : key.includes('cosmic') ? 'Two separate worlds, one luminous connection and layered personal ephemera.' : 'Prompt excerpt unavailable for this style-range study.'];
  art.src = image.src.replace('.webp', '.png');
  art.alt = image.alt;
  document.getElementById('dialog-title').textContent = info[0];
  document.getElementById('dialog-style').textContent = info[1];
  document.getElementById('dialog-emotion').textContent = info[2];
  document.getElementById('dialog-prompt').textContent = info[3];
  document.getElementById('dialog-count').textContent = `Artwork ${selected + 1} of ${triggers.length}`;
}
triggers.forEach((button, index) => button.addEventListener('click', () => {
  returnFocus = button;
  showArtwork(index);
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  document.getElementById('dialog-close').focus();
}));
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
document.getElementById('dialog-prev').addEventListener('click', () => showArtwork(selected - 1));
document.getElementById('dialog-next').addEventListener('click', () => showArtwork(selected + 1));
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showArtwork(selected - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showArtwork(selected + 1); }
  if (event.key === 'Tab') {
    const items = [...dialog.querySelectorAll('button')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; art.src = 'assets/01-chaotic-birthday.webp'; returnFocus?.focus(); });
const compareRange = document.getElementById('comparison-range');
compareRange.addEventListener('input', () => {
  document.querySelector('.drag-stage').style.setProperty('--split', `${compareRange.value}%`);
  compareRange.setAttribute('aria-valuetext', `${compareRange.value} percent final image`);
});

nav.addEventListener('keydown', event => { if (event.key === 'Escape') { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus(); } });
