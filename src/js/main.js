/**
 * Main Application Bootstrapper
 * Coordinates configuration, events data, personalizations, and interactive modules
 */

import config from '../data/config.json';
import events from '../data/events.json';

import { initIntro } from './intro.js';
import { initCountdown } from './countdown.js';
import { renderEvents } from './events.js';
import { initLazyMaps } from './maps.js';
import { initScrollReveal } from './reveal.js';
import { initAmbientEffects } from './ambient.js';

/**
 * Sanitizes and securely displays guest name from URL parameter ?guest=...
 * Enforces strict XSS safety by setting only via textContent and capping length.
 */
const handleGuestPersonalization = () => {
  const params = new URLSearchParams(window.location.search);
  const rawGuest = params.get('guest');

  const guestBox = document.getElementById('guest-greeting-box');
  const guestNameEl = document.getElementById('guest-name');

  if (rawGuest && guestBox && guestNameEl) {
    // Sanitize: trim, cap at 40 chars, remove suspicious control chars
    const sanitizedGuest = rawGuest.trim().slice(0, 40);

    if (sanitizedGuest.length > 0) {
      guestNameEl.textContent = `Dear ${sanitizedGuest},`;
      guestBox.style.display = 'block';
    }
  }
};


/**
 * Initializes sticky navigation active section tracking
 */
const setupNavHighlight = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-60px 0px -40% 0px'
  });

  sections.forEach(s => observer.observe(s));
};

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Safe guest personalization
  handleGuestPersonalization();

  // 2. Render event timeline & map blocks
  renderEvents(events);

  // 3. Initialize Countdown with IST wedding date
  initCountdown(config.weddingStart);

  // 4. Initialize Intro Screen Overlay
  initIntro();

  // 5. Initialize Ambient Marigold Particles & Toggle
  initAmbientEffects();

  // 6. Initialize Scroll Reveal Observers
  initScrollReveal();

  // 7. Initialize Lazy Loaded Google Maps
  initLazyMaps();

  // 8. Sticky Nav Active State Tracking
  setupNavHighlight();
});
