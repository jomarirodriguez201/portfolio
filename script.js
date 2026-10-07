const loader=document.getElementById('loader');
window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('hide'),650));
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>20));
const toggle=document.getElementById('menuToggle'), menu=document.getElementById('menu');
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const lightbox=document.getElementById('lightbox'), img=document.getElementById('lightboxImg'), title=document.getElementById('lightboxTitle'), cat=document.getElementById('lightboxCategory');
document.querySelectorAll('[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.project');img.src=btn.dataset.lightbox;img.alt=card.dataset.title;title.textContent=card.dataset.title;cat.textContent=card.dataset.category;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));
function closeBox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.getElementById('lightboxClose').addEventListener('click',closeBox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox()});
const form=document.getElementById('contactForm');const note=document.getElementById('formNote');
form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const subject=encodeURIComponent(`Portfolio inquiry — ${data.get('type')}`);const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject Type: ${data.get('type')}\n\n${data.get('message')}`);window.location.href=`mailto:jomarirodriguez.digitalproducts@gmail.com?subject=${subject}&body=${body}`;note.textContent='Opening your email app with the message prepared…';});
