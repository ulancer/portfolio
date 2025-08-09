// small interactions: mobile nav, smooth scroll, Formspree submit, year update
document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle){
  navToggle.addEventListener('click', function(){
    const open = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!open));
    nav.style.display = open ? 'none' : 'flex';
  });
}

// smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if (target){
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
      if (window.innerWidth < 860 && navToggle){
        nav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// contact form AJAX (Formspree)
const contactForm = document.getElementById('contactForm');
if (contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'Sending…';
    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok){
        status.textContent = 'Thanks — I’ll reply within 24 hours.';
        contactForm.reset();
      } else {
        const json = await res.json();
        status.textContent = json.error || 'Submission failed.';
      }
    } catch (err) {
      status.textContent = 'Network error — try emailing hello@ulancer.com';
    }
  });
}
