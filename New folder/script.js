// script.js - Cleaned and optimized
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const navMenu = document.querySelector('#nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const skillBars = document.querySelectorAll('.skill-progress');
  const contactForm = document.getElementById('contact-form');
  const formStatusEl = document.getElementById('form-status');
  
  // Mobile menu toggles
  const mobileToggles = document.querySelectorAll('.mobile-menu-toggle');
  
  // Theme toggles
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeToggles = [themeToggleDesktop, themeToggleMobile].filter(Boolean);

  /* Header shadow on scroll */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* Mobile menu toggle */
  mobileToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Toggle aria on all mobile buttons for consistency
      mobileToggles.forEach(b => b.setAttribute('aria-expanded', String(!expanded)));
      navMenu.classList.toggle('active');
    });
  });

  /* Close mobile menu when nav link clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggles.forEach(b => b.setAttribute('aria-expanded', 'false'));
    });
  });

  /* Dark mode toggle */
  if (themeToggles.length) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
      document.body.classList.add('dark');
    }

    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    });
  }

  /* Active nav link on scroll */
  const handleActiveNav = () => {
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  
  window.addEventListener('scroll', handleActiveNav);
  handleActiveNav(); // Call once on load

  /* Skills animation */
  const animateSkills = () => {
    skillBars.forEach(bar => {
      if (bar.classList.contains('animated')) return;
      
      const top = bar.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        const target = bar.getAttribute('aria-valuenow') + '%';
        bar.style.width = '0';
        
        setTimeout(() => {
          bar.style.width = target;
          bar.classList.add('animated');
        }, 100);
      }
    });
  };
  
  window.addEventListener('scroll', animateSkills);
  animateSkills(); // Call once on load

  /* Contact form handling */
  if (contactForm && formStatusEl) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      formStatusEl.textContent = 'Sending...';
      formStatusEl.classList.add('visible');
      
      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        
        if (response.ok) {
          formStatusEl.textContent = '✅ Thanks! Your message has been sent.';
          formStatusEl.classList.add('success');
          contactForm.reset();
        } else {
          const data = await response.json();
          formStatusEl.textContent = data?.errors?.map(err => err.message).join(', ') || '⚠️ Oops! Something went wrong.';
          formStatusEl.classList.add('error');
        }
      } catch (err) {
        formStatusEl.textContent = '❌ Network error. Please try again.';
        formStatusEl.classList.add('error');
      }
      
      setTimeout(() => {
        formStatusEl.classList.remove('visible', 'success', 'error');
        formStatusEl.textContent = '';
      }, 5000);
    });
  }

  /* Reveal sections on scroll */
  const sections = document.querySelectorAll('section');
  const revealOnScroll = () => {
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        section.classList.add('visible');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Call once on load

  /* Smooth anchor scrolling */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});