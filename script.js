const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const siteHeader = document.querySelector('.site-header');
const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', document.body.classList.contains('inner-page') || window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navigation?.classList.toggle('is-open', open);
});

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
  navigation?.classList.remove('is-open');
};

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (menuButton?.getAttribute('aria-expanded') === 'true' && !siteHeader?.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

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
let enquiryAccepted = false;
const requestedRole = new URLSearchParams(window.location.search).get('role');
if (enquiryForm && !enquiryForm.elements.namedItem('enquiry_type') && ['Player', 'Coach', 'Club', 'Other'].includes(requestedRole)) {
  enquiryForm.elements.namedItem('role').value = requestedRole;
}
document.querySelectorAll('[data-audience]').forEach((link) => {
  link.addEventListener('click', () => {
    const role = enquiryForm?.elements.namedItem('role');
    if (role) role.value = link.dataset.audience;
  });
});

enquiryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (enquiryAccepted) return;
  if (!enquiryForm.reportValidity()) return;
  const data = new FormData(enquiryForm);
  const value = (key) => String(data.get(key) || '').trim();
  const isClubBrief = value('enquiry_type') === 'club_brief';
  const details = isClubBrief ? [
    `Name: ${value('name')}`,
    `Email: ${value('email')}`,
    `Club / organisation: ${value('club')}`,
    `Contact title: ${value('contact_title')}`,
    `Request: ${value('request_type')}`,
    `Position / coaching role: ${value('position')}`,
    value('competition') ? `Competition / level: ${value('competition')}` : '',
    value('location') ? `Club location: ${value('location')}` : '',
    `Target timing: ${value('timing')}`,
    value('terms') ? `Budget / terms: ${value('terms')}` : '',
    `\nProfile and project requirements:\n${value('requirements')}`,
    value('constraints') ? `\nPractical considerations:\n${value('constraints')}` : '',
  ] : [
    `Name: ${value('name')}`,
    `Email: ${value('email')}`,
    `I am a: ${value('role')}`,
    value('club') ? `Club / organisation: ${value('club')}` : '',
    `\n${value('message')}`,
  ];
  const body = details.filter(Boolean).join('\n');
  const subject = isClubBrief ? `Club brief — ${value('request_type')} — VERO Football Agency` : `${value('role')} enquiry — VERO Football Agency`;
  const prepared = document.getElementById('prepared-email');
  const emailLink = document.getElementById('open-email');
  const message = document.getElementById('prepared-message');
  const copyStatus = document.getElementById('copy-status');
  const submissionStatus = document.getElementById('submission-status');
  const sendButton = enquiryForm.querySelector('button[type="submit"]');
  emailLink.href = `mailto:verofootballagency@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  message.value = `Subject: ${subject}\n\n${body}`;
  copyStatus.textContent = '';
  prepared.hidden = true;
  submissionStatus.hidden = false;
  submissionStatus.classList.remove('is-error');
  submissionStatus.textContent = 'Sending your enquiry…';
  sendButton.disabled = true;
  try {
    const response = await fetch(enquiryForm.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'The mail server could not accept your enquiry.');
    enquiryAccepted = true;
    submissionStatus.textContent = `Thank you. The mail server accepted your ${isClubBrief ? 'club brief' : 'enquiry'} for VERO. If you do not hear back, email verofootballagency@gmail.com directly.`;
  } catch (error) {
    submissionStatus.classList.add('is-error');
    submissionStatus.textContent = `${error.message || 'The server could not accept your enquiry.'} Use the email option below instead.`;
    prepared.hidden = false;
  } finally {
    sendButton.disabled = enquiryAccepted;
    submissionStatus.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  }
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
