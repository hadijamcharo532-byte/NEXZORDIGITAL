/**
 * NEXZOR DIGITAL - Vanilla JavaScript
 * Features: Mobile nav, smooth scroll, scroll animations,
 * form validation, particle system, counter animation
 */

(function() {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const particlesContainer = document.getElementById('particles');
  const contactForm = document.getElementById('contactForm');
  const yearEl = document.getElementById('year');
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const statNumbers = document.querySelectorAll('.stat-number');

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  function toggleNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleNav);

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleNav();
      }
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      toggleNav();
    }
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Hero elements animate immediately
  document.querySelectorAll('.hero .reveal-up').forEach(el => {
    el.classList.add('visible');
  });

  // ============================================
  // Particle System
  // ============================================
  function createParticles() {
    if (!particlesContainer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.3 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
      `;

      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  // ============================================
  // Counter Animation
  // ============================================
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);

      el.textContent = current + (target >= 10 ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ============================================
  // Contact Form Validation & Submission
  // ============================================
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return '';
    }
  };

  function validateField(field) {
    const name = field.name;
    const errorEl = document.getElementById(name + 'Error');
    const validator = validators[name];

    if (!validator) return true;

    const error = validator(field.value);

    if (error) {
      field.classList.add('error');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  // Real-time validation
  ['name', 'email', 'message'].forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    }
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fields = ['name', 'email', 'message'];
    let isValid = true;

    fields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field && !validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Simulate form submission
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');

    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      successMsg.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 5000);
    }, 1500);
  });

  // ============================================
  // Footer Year
  // ============================================
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // Active Nav Link on Scroll
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  // ============================================
  // Parallax Effect on Hero (subtle)
  // ============================================
  const heroBg = document.querySelector('.hero-bg');

  function handleParallax() {
    if (!heroBg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ============================================
  // Keyboard Navigation Support
  // ============================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleNav();
    }
  });

  // ============================================
  // Preload Hero Animations
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
  });

})();
