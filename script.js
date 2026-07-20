/* -------------------------------------------------------------
   Blog Du Webdesign - Main Scripts
   Designed with attention ♥ by Tristan
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initScrollReveal();
  initTextSplit();
  initMagneticButtons();
  initMobileMenu();
  initScrollProgress();
  initProjectFilter();
  initContactForm();
});

/* ==========================================
   Custom Cursor
   ========================================== */
function initCustomCursor() {
  // Disable on mobile/touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  document.body.appendChild(cursor);
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth follow animation for the outer circle
  function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect classes
  const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .logo-item, .service-row, .form-checkbox-label');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ==========================================
   Scroll Progress Bar
   ========================================== */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

/* ==========================================
   Scroll Reveal (Intersection Observer)
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   Text Split Animation (Hero Title)
   ========================================== */
function initTextSplit() {
  const splitTitles = document.querySelectorAll('.hero-title-split');
  splitTitles.forEach(title => {
    const text = title.textContent.trim();
    const words = text.split(' ');
    title.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.transitionDelay = `${index * 0.1}s`;
      if (index < words.length - 1) {
        span.style.marginRight = '0.25em';
      }
      title.appendChild(span);
    });

    // Force reflow and set visible
    setTimeout(() => {
      const spans = title.querySelectorAll('span');
      spans.forEach(s => s.style.opacity = '1');
      spans.forEach(s => s.style.transform = 'translateY(0)');
    }, 100);
  });
}

/* ==========================================
   Magnetic Buttons
   ========================================== */
function initMagneticButtons() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const magneticWrappers = document.querySelectorAll('.magnetic-wrap');
  
  magneticWrappers.forEach(wrap => {
    const trigger = wrap.querySelector('a, button');
    
    wrap.addEventListener('mousemove', (e) => {
      const bounds = wrap.getBoundingClientRect();
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;
      
      trigger.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    wrap.addEventListener('mouseleave', () => {
      trigger.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================
   Mobile Burger Menu
   ========================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close overlay on link click
  const overlayLinks = overlay.querySelectorAll('a');
  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   Project Category Filter
   ========================================== */
function initProjectFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = card.classList.contains('even') ? 'translateY(60px)' : 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   Contact / Rendez-vous Form
   ========================================== */
function initContactForm() {
  const form = document.getElementById('rdvForm');
  const successPane = document.querySelector('.form-success-pane');
  if (!form || !successPane) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check basic validation
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    });

    if (!isValid) return;

    // Simulate submission with cool micro-animation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmission en cours...';

    setTimeout(() => {
      // Hide form, show success message
      form.style.display = 'none';
      successPane.style.display = 'block';
      
      // Auto scroll to success pane smoothly
      successPane.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  });
}
