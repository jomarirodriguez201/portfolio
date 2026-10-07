'use strict';
const menu = document.getElementById('menu');
const toggle = document.getElementById('menuToggle');
function closeMenu() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); toggle.focus(); }
});
const cards = [...document.querySelectorAll('.project')];
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  let count = 0;
  cards.forEach(card => {
    const show = button.dataset.filter === 'all' || card.dataset.kind === button.dataset.filter;
    card.hidden = !show;
    if (show) count++;
  });
  document.getElementById('projectCount').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
}));
const dialog = document.getElementById('projectDialog');
const image = document.getElementById('dialogImage');
const video = document.getElementById('dialogVideo');
const gallery = document.getElementById('dialogGallery');
const links = document.getElementById('dialogLinks');
let opener;
function addLink(url, label) {
  const link = document.createElement('a');
  link.href = url; link.textContent = `${label} ↗`;
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `${label} (opens a new tab)`);
  links.append(link);
}
function openProject(card, button) {
  const data = card.dataset;
  opener = button;
  document.getElementById('dialogTitle').textContent = data.title;
  document.getElementById('dialogCategory').textContent = data.category;
  document.getElementById('dialogDescription').textContent = data.description;
  document.getElementById('dialogDetails').textContent = data.details || '';
  image.hidden = Boolean(data.video);
  video.hidden = !data.video;
  image.src = data.preview; image.alt = `${data.title} — full project preview`;
  if (data.video) { video.src = data.video; video.poster = data.preview; }
  links.replaceChildren();
  if (data.url) addLink(data.url, data.url2 ? 'Visit contact page' : 'Visit website');
  if (data.url2) addLink(data.url2, 'Visit appointment page');
  gallery.replaceChildren(); gallery.hidden = !data.preview2;
  if (data.preview2) {
    const views = [[data.preview, 'Contact page'], [data.preview2, data.label2]];
    views.forEach(([src, label], i) => {
      const viewButton = document.createElement('button');
      viewButton.type = 'button'; viewButton.textContent = label;
      viewButton.setAttribute('aria-pressed', String(i === 0));
      viewButton.addEventListener('click', () => {
        image.src = src; image.alt = `${data.title} — ${label}`;
        gallery.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === viewButton)));
      });
      gallery.append(viewButton);
    });
  }
  dialog.showModal(); dialog.scrollTop = 0; document.body.classList.add('dialog-open');
  document.getElementById('dialogClose').focus();
}
cards.forEach(card => card.querySelectorAll('.project-preview, .detail-button').forEach(button => {
  button.addEventListener('click', () => openProject(card, button));
}));
document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  video.pause(); video.removeAttribute('src'); video.load();
  document.body.classList.remove('dialog-open');
  opener?.focus();
});
// Native POST keeps delivery independent of JavaScript and retains FormSubmit's spam check.
// Activate the recipient once, using the confirmation email after the first hosted submission.
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
form.addEventListener('submit', event => {
  if (!form.reportValidity()) { event.preventDefault(); return; }
  if (form.elements['_honey'].value) { event.preventDefault(); return; }
  if (window.location.protocol === 'file:') {
    event.preventDefault();
    formNote.textContent = 'To send an inquiry, use the hosted website or email jomarirodriguez201@gmail.com directly.';
    return;
  }
  document.getElementById('formSource').value = window.location.origin + window.location.pathname;
  form.querySelector('button[type="submit"]').textContent = 'Continue to verification…';
  formNote.textContent = 'Complete the verification on the next page to finish sending your inquiry.';
  // No preventDefault: the browser posts the fields to the configured form endpoint.
});
window.addEventListener('pageshow', () => {
  form.querySelector('button[type="submit"]').innerHTML = 'Send inquiry <span>↗</span>';
  formNote.textContent = 'Your details are sent to Jomari via FormSubmit to respond to your inquiry.';
});
document.getElementById('year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        menu.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}
