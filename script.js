// script.js

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const themeToggle = document.getElementById("theme-toggle");
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const skillBars = document.querySelectorAll(".skill-progress");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  /* ----------------------------
     Header shadow on scroll
  ---------------------------- */
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  /* ----------------------------
     Dark/Light Mode Toggle
  ---------------------------- */
  if (themeToggle) {
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark", currentTheme === "dark");

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }

  /* ----------------------------
     Mobile Menu Toggle
  ---------------------------- */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", !expanded);
      navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) =>
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ----------------------------
     Active Nav Link on Scroll
  ---------------------------- */
  window.addEventListener("scroll", () => {
    let current = "";
    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop - 70;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  /* ----------------------------
     Skills Animation on Scroll
  ---------------------------- */
  function animateSkills() {
    skillBars.forEach((bar) => {
      const barTop = bar.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (barTop < windowHeight - 100 && !bar.classList.contains("animated")) {
        const targetWidth = bar.getAttribute("aria-valuenow") + "%";
        bar.style.width = "0"; // reset
        setTimeout(() => {
          bar.style.width = targetWidth;
          bar.classList.add("animated");
        }, 100);
      }
    });
  }
  window.addEventListener("scroll", animateSkills);
  animateSkills(); // run on load in case already visible

  /* ----------------------------
     Project Filtering
  ---------------------------- */
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.getAttribute("data-filter");

        projectCards.forEach((card) => {
          card.classList.add("hidden");
          if (category === "all" || card.classList.contains(category)) {
            setTimeout(() => card.classList.remove("hidden"), 100);
          }
        });
      });
    });
  }

  /* ----------------------------
     Contact Form Handling
  ---------------------------- */
  if (form && formStatus) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      formStatus.textContent = "Sending...";
      formStatus.className = "form-status visible";

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          formStatus.textContent = "✅ Thanks! Your message has been sent.";
          form.reset();
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, "errors")) {
            formStatus.textContent = data.errors.map((err) => err.message).join(", ");
          } else {
            formStatus.textContent = "⚠️ Oops! Something went wrong.";
          }
        }
      } catch (error) {
        formStatus.textContent = "❌ Network error. Please try again.";
      }

      // fade out status after 5s
      setTimeout(() => {
        formStatus.classList.remove("visible");
      }, 5000);
    });
  }

  /* ----------------------------
   Reveal Sections on Scroll
    ---------------------------- */
    const sections = document.querySelectorAll("section");
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top < windowHeight - 100) {
          sec.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

  /* ----------------------------
     Smooth Scrolling
  ---------------------------- */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.hash) {
        e.preventDefault();
        document.querySelector(link.hash).scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});
