document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero showreel: never autoplay for reduced-motion visitors (poster frame stands in).
const heroVideo = document.querySelector('.hero-showreel');

if (heroVideo && prefersReducedMotion) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
}

// Work loops: play muted while in view, pause when scrolled away.
// A visitor who takes manual control of a clip keeps it.
const autoplayVideos = document.querySelectorAll('video[data-autoplay]');

if (!prefersReducedMotion && 'IntersectionObserver' in window && autoplayVideos.length) {
  autoplayVideos.forEach((video) => {
    video.addEventListener('pointerdown', () => {
      video.dataset.userHold = '1';
    });
  });

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (video.dataset.userHold) return;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  autoplayVideos.forEach((video) => videoObserver.observe(video));
}
