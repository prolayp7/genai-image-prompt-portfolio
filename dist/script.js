const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

const orb = document.querySelector('.cursor-orb');
window.addEventListener('pointermove', (event) => {
  orb.style.left = `${event.clientX}px`;
  orb.style.top = `${event.clientY}px`;
});

document.getElementById('copy-json').addEventListener('click', async (event) => {
  const value = document.getElementById('json-code').textContent;
  await navigator.clipboard.writeText(value);
  event.currentTarget.textContent = 'Copied ✓';
  window.setTimeout(() => { event.currentTarget.textContent = 'Copy JSON'; }, 1600);
});
