/* ========================================
   Virtual Machines — Educational Website
   Main JavaScript
   ======================================== */

(function () {
  'use strict';

  /* ============================
     Theme Management
     ============================ */
  var themeToggle = document.getElementById('theme-toggle');
  var themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

  function getStoredTheme() {
    try {
      return localStorage.getItem('vm-book-theme');
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem('vm-book-theme', theme);
    } catch (e) {
      // localStorage not available
    }
  }

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      // Update theme-color meta tag
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#0d1520');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      var metaThemeLight = document.querySelector('meta[name="theme-color"]');
      if (metaThemeLight) metaThemeLight.setAttribute('content', '#1e5ab4');
    }
  }

  // Initialize theme
  var storedTheme = getStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(getSystemPreference());
  }

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      setStoredTheme(newTheme);
    });
  }

  // Listen for system preference changes
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!getStoredTheme()) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (e) {
      // Older browsers may not support addEventListener on matchMedia
    }
  }

  /* ============================
     Reading Progress Bar
     ============================ */
  var progressBar = document.getElementById('progress-bar');
  var backToTop = document.getElementById('back-to-top');
  var raf = false;

  function onScroll() {
    if (raf) return;
    raf = true;
    requestAnimationFrame(function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) {
        progressBar.style.width = progress + '%';
      }
      if (backToTop) {
        if (scrollTop > 400) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      }
      raf = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================
     Back to Top
     ============================ */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================
     Smooth Scroll for Anchors
     ============================ */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

  /* ============================
     Auto-wrap Tables for Mobile
     ============================ */
  var tables = document.querySelectorAll('table');
  for (var j = 0; j < tables.length; j++) {
    var t = tables[j];
    if (!t.parentElement.classList.contains('table-wrap')) {
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    }
  }
})();
