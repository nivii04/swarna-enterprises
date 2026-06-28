"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const sections = document.querySelectorAll("main section[id]");
  const statsSection = document.querySelector(".stats-section");
  const statNumbers = document.querySelectorAll(".stat-item strong");

  const closeMobileMenu = () => {
    if (!navToggle || !navMenu || !navbar) return;

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
    navbar.classList.remove("active");
  };

  const openMobileMenu = () => {
    if (!navToggle || !navMenu || !navbar) return;

    navToggle.setAttribute("aria-expanded", "true");
    navToggle.classList.add("active");
    navMenu.classList.add("active");
    navbar.classList.add("active");
  };

  if (navToggle && navMenu && navbar) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);

        if (target) {
          event.preventDefault();

          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });

          closeMobileMenu();
        }
      } else {
        closeMobileMenu();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!navbar || !navMenu || !navToggle) return;

    const isMenuOpen = navMenu.classList.contains("active");
    const clickedInsideNav = navbar.contains(event.target);

    if (isMenuOpen && !clickedInsideNav) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }
  });

  const updateHeaderState = () => {
    if (!header) return;

    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (href === `#${sectionId}` || (sectionId === "home" && href === "index.html")) {
        link.classList.add("active");
      } else if (href && href.startsWith("#")) {
        link.classList.remove("active");
      } else if (href === "index.html" && sectionId !== "home") {
        link.classList.remove("active");
      }
    });
  };

  if (sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const parseCounterValue = (value) => {
    const number = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[0-9]/g, "");

    return {
      target: Number.isNaN(number) ? 0 : number,
      suffix
    };
  };

  const animateCounter = (element, duration = 1800) => {
    const originalValue = element.textContent.trim();
    const { target, suffix } = parseCounterValue(originalValue);
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * target);

      element.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  if (statsSection && statNumbers.length) {
    let countersAnimated = false;

    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            statNumbers.forEach((number) => animateCounter(number));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    statsObserver.observe(statsSection);
  }

  const revealTargets = document.querySelectorAll(
    ".fade-in, .fade-in-left, .fade-in-right, .section-heading, .about-image, .about-content, .feature-card, .category-card, .stat-item, .cta-content"
  );

  if (revealTargets.length) {
    revealTargets.forEach((element) => {
      element.classList.add("reveal-ready");

      if (
        !element.classList.contains("fade-in") &&
        !element.classList.contains("fade-in-left") &&
        !element.classList.contains("fade-in-right")
      ) {
        element.classList.add("fade-in");
      }
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -70px 0px"
      }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }
});