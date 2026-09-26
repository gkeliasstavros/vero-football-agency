const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const siteHeader = document.querySelector('.site-header');
const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navigation.classList.toggle('is-open', open);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
  navigation.classList.remove('is-open');
}));

document.getElementById('year').textContent = String(new Date().getFullYear());

const galleryButtons = [...document.querySelectorAll('.gallery-open')];
const photoDialog = document.querySelector('.image-dialog');
const dialogImage = photoDialog?.querySelector('img');
const counter = photoDialog?.querySelector('.dialog-counter');
let selectedPhoto = 0;

function showPhoto(index) {
  if (!photoDialog || !dialogImage || !galleryButtons.length) return;
  selectedPhoto = (index + galleryButtons.length) % galleryButtons.length;
  const sourceImage = galleryButtons[selectedPhoto].querySelector('img');
  dialogImage.src = sourceImage.currentSrc || sourceImage.src;
  dialogImage.alt = sourceImage.alt;
  counter.textContent = `${String(selectedPhoto + 1).padStart(2, '0')} / ${String(galleryButtons.length).padStart(2, '0')}`;
}

galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
  showPhoto(index);
  photoDialog.showModal();
  photoDialog.querySelector('.dialog-close').focus();
}));

photoDialog?.querySelector('.dialog-close')?.addEventListener('click', () => photoDialog.close());
photoDialog?.querySelector('.dialog-prev')?.addEventListener('click', () => showPhoto(selectedPhoto - 1));
photoDialog?.querySelector('.dialog-next')?.addEventListener('click', () => showPhoto(selectedPhoto + 1));
photoDialog?.addEventListener('click', (event) => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(selectedPhoto - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(selectedPhoto + 1); }
});

const enquiryForm = document.getElementById('enquiry-form');
const requestedRole = new URLSearchParams(window.location.search).get('role');
if (enquiryForm && ['Player', 'Coach', 'Club', 'Other'].includes(requestedRole)) {
  enquiryForm.elements.namedItem('role').value = requestedRole;
}
document.querySelectorAll('[data-audience]').forEach((link) => {
  link.addEventListener('click', () => {
    const role = enquiryForm?.elements.namedItem('role');
    if (role) role.value = link.dataset.audience;
  });
});

enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  const data = new FormData(enquiryForm);
  const value = (key) => String(data.get(key) || '').trim();
  const details = [
    `Name: ${value('name')}`,
    `Email: ${value('email')}`,
    `I am a: ${value('role')}`,
    value('club') ? `Club / organisation: ${value('club')}` : '',
  ].filter(Boolean).join('\n');
  const body = `${details}\n\n${value('message')}`;
  const subject = `${value('role')} enquiry — VERO Football Agency`;
  const prepared = document.getElementById('prepared-email');
  const emailLink = document.getElementById('open-email');
  const message = document.getElementById('prepared-message');
  const status = document.getElementById('copy-status');
  emailLink.href = `mailto:verofootballagency@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  message.value = `Subject: ${subject}\n\n${body}`;
  status.textContent = '';
  prepared.hidden = false;
  prepared.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});

document.getElementById('copy-email')?.addEventListener('click', async () => {
  const message = document.getElementById('prepared-message');
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = 'Email details copied. Paste them into a message to the address above.';
  } catch {
    message.focus();
    message.select();
    status.textContent = 'Select and copy the highlighted text, then email it to the address above.';
  }
});
