// helpers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

// set year for footer
(() => {
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;
})();

// smooth scroll & highlight nav on scroll
(() => {
  const navLinks = $$('.nav-links a[href^="#"]');
  const sections = $$('main section[id], main section');
  const offset = 84; 

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      
      history.replaceState(null, '', href);
    });
  });

  // highlight on scroll (throttle using requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      navLinks.forEach(link => link.classList.remove('active'));
      sections.forEach(section => {
        const id = section.id;
        if (!id) return;
        const top = section.offsetTop - offset - 10;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          const active = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (active) active.classList.add('active');
        }
      });
      ticking = false;
    });
  }, { passive: true });
})();


// Header shrink on scroll
(() => {
  const header = document.querySelector('.header');
  if (!header) return;
  const shrinkAt = 40;
  const onScroll = () => {
    if (window.scrollY > shrinkAt) header.classList.add('shrink');
    else header.classList.remove('shrink');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Contact form->modal interaction
(() => {
  const form = document.querySelector('.contact-form');
  const backdrop = document.getElementById('modal-backdrop');

  function openModal() {
    if (!backdrop) return;
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    const close = backdrop.querySelector('.modal-close');
    if (close) close.focus();
  }
  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  // attach close button
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-close')) closeModal();
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) closeModal();
  });

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="fullname"]')?.value.trim();
    const email = form.querySelector('input[name="email"]')?.value.trim();
    // simple validation
    if (!name || !email) {
      const note = document.createElement('div');
      note.textContent = 'Please fill in the required fields.';
      note.style.color = '#b45309';
      note.style.marginTop = '.35rem';
      form.appendChild(note);
      setTimeout(() => note.remove(), 3000);
      return;
    }

    // simulate sending
    const submit = form.querySelector('button[type="submit"]');
    const prev = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending...';
    setTimeout(() => {
      submit.disabled = false;
      submit.textContent = prev;
      form.reset();
      openModal();
    }, 900);
  });
})();

// Booking modal logic
const bookingModal = document.getElementById("booking-modal");
const bookingSuccess = document.getElementById("booking-success");
const bookButtons = document.querySelectorAll(".advisor .btn.btn-primary");
const bookSubmit = document.getElementById("book-submit");
const modalCloses = document.querySelectorAll(".modal-close");

// Open booking modal
bookButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    bookingModal.classList.add("open");
  });
});

// Confirm booking
bookSubmit.addEventListener("click", () => {
  const date = document.getElementById("booking-date").value;
  const time = document.getElementById("booking-time").value;

  if (!date || !time) {
    alert("Please select a date and time before confirming.");
    return;
  }

  bookingModal.classList.remove("open");
  bookingSuccess.classList.add("open");
});

// Close modals
modalCloses.forEach(btn => {
  btn.addEventListener("click", () => {
    bookingModal.classList.remove("open");
    bookingSuccess.classList.remove("open");
  });
});

// Hero image slideshow
(() => {
  const slides = $$('.hero-card .slide');
  let current = 0;

  if (slides.length === 0) return;

  slides[current].classList.add('active');

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();


//show focus outlines only on keyboard navigation
(() => {
  const body = document.body;
  function handleKey(e){ if (e.key === 'Tab') body.classList.add('show-focus'); }
  function handleMouse(){ body.classList.remove('show-focus'); }
  window.addEventListener('keydown', handleKey);
  window.addEventListener('mousedown', handleMouse);
})();
