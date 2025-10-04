// script.js - Professional portfolio with advanced interactions
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const navMenu = document.querySelector('#nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const skillBars = document.querySelectorAll('.skill-progress');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contact-form');
  const formStatusEl = document.getElementById('form-status');
  const backToTopBtn = document.getElementById('back-to-top');
  const preloader = document.querySelector('.preloader');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  // Mobile menu toggles
  const mobileToggles = document.querySelectorAll('.mobile-menu-toggle');
  
  // Theme toggles
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeToggles = [themeToggleDesktop, themeToggleMobile].filter(Boolean);

  // Hide preloader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 500);
  });

  /* Header shadow on scroll */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    
    // Show/hide back to top button
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  /* Mobile menu toggle */
  mobileToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Toggle aria on all mobile buttons for consistency
      mobileToggles.forEach(b => b.setAttribute('aria-expanded', String(!expanded)));
      navMenu.classList.toggle('active');
      btn.classList.toggle('active');
    });
  });

  /* Close mobile menu when nav link clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggles.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.classList.remove('active');
      });
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
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  
  window.addEventListener('scroll', handleActiveNav);
  handleActiveNav(); // Call once on load

  /* Typing animation for hero subtitle */
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const roles = ['Frontend Developer', 'UI/UX Designer', 'Web Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before new role
      }
      
      setTimeout(type, typingSpeed);
    };
    
    // Start typing animation
    setTimeout(type, 1000);
  }

  /* Counter animation for stats */
  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          setTimeout(updateCounter, 20);
        } else {
          counter.textContent = target;
        }
      };
      
      // Start counter when element is in viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !counter.classList.contains('animated')) {
            updateCounter();
            counter.classList.add('animated');
          }
        });
      });
      
      observer.observe(counter);
    });
  };
  
  animateCounters();

  /* Skills animation */
  const animateSkills = () => {
    skillBars.forEach(bar => {
      if (bar.classList.contains('animated')) return;
      
      const top = bar.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        const target = bar.getAttribute('data-level') + '%';
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

  /* Project filtering */
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        projectCards.forEach((card, index) => {
          if (category === 'all' || card.dataset.category === category) {
            // Add staggered animation
            setTimeout(() => {
              card.classList.remove('hidden');
              card.classList.add('visible');
            }, index * 100);
          } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
          }
        });
      });
    });
  }

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
          formStatusEl.classList.remove('error');
          formStatusEl.classList.add('success');
          contactForm.reset();
        } else {
          const data = await response.json();
          formStatusEl.textContent = data?.errors?.map(err => err.message).join(', ') || '⚠️ Oops! Something went wrong.';
          formStatusEl.classList.remove('success');
          formStatusEl.classList.add('error');
        }
      } catch (err) {
        formStatusEl.textContent = '❌ Network error. Please try again.';
        formStatusEl.classList.remove('success');
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

  /* Back to top button */
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* Smooth anchor scrolling */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* Initialize particles background for hero section */
  const initParticles = () => {
    const particlesBg = document.querySelector('.particles-bg');
    if (!particlesBg) return;
    
    // Create a subtle parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      particlesBg.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
  };
  
  initParticles();

  /* Add hover effect to project cards */
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
});