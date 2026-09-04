/**
 * Brian Lang - Technical Software Architect Portfolio
 * Pure Apple iOS 18 Controller
 * Handles view transitions, Dynamic Island interaction, dock navigation, and live system clocks.
 */

(function () {
  'use strict';

  // --- 1. VIEW NAVIGATION CONTROLLER ---
  const views = document.querySelectorAll('.ios-view');
  const dockButtons = document.querySelectorAll('.ios-dock-btn');

  function navigateTo(targetViewId) {
    const target = document.getElementById(targetViewId);
    if (!target) return;

    // Transition views
    views.forEach(v => {
      v.classList.remove('active');
    });
    target.classList.add('active');

    // Update Dock active indicator
    dockButtons.forEach(btn => {
      if (btn.getAttribute('data-navigate') === targetViewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Auto-scroll new view to top
    const scrollContainer = target.querySelector('.ios-scrollable-content');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }

  window.navigateTo = navigateTo;

  // Click bindings for navigation elements
  document.querySelectorAll('[data-navigate]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-navigate');
      if (target) navigateTo(target);
    });
  });

  // Back button bindings (return to homescreen)
  document.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('view-homescreen');
    });
  });

  // Hero Widget click opens About View
  const heroWidget = document.getElementById('hero-widget');
  if (heroWidget) {
    heroWidget.addEventListener('click', () => {
      navigateTo('view-about');
    });
  }

  // Home Indicator Bar click returns to Homescreen
  const homeBar = document.getElementById('ios-home-bar');
  if (homeBar) {
    homeBar.addEventListener('click', () => {
      navigateTo('view-homescreen');
    });
  }

  // --- 2. DYNAMIC ISLAND CONTROLLER ---
  const dynamicIsland = document.getElementById('dynamic-island');
  if (dynamicIsland) {
    dynamicIsland.addEventListener('click', (e) => {
      // Avoid collapsing if clicked directly on connect link
      if (e.target.closest('.island-action-pill')) return;
      
      dynamicIsland.classList.toggle('expanded');
      
      if (dynamicIsland.classList.contains('expanded')) {
        setTimeout(() => {
          if (dynamicIsland.classList.contains('expanded')) {
            dynamicIsland.classList.remove('expanded');
          }
        }, 5000);
      }
    });
  }

  // --- 3. SHARE SHEET API / CLIPBOARD FALLBACK ---
  const shareBtn = document.getElementById('btn-share-portfolio');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Brian Lang | Technical Software Architect',
        text: 'Check out Brian Lang - Technical Software Architect Portfolio (Distributed Systems, Cloud & High-Availability).',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // Share was cancelled or failed silently
        }
      } else {
        // Fallback: Copy URL to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Portfolio link copied to clipboard!');
        } catch (err) {
          alert('Brian Lang - Technical Software Architect: brianlang.dev');
        }
      }
    });
  }

  // Copy Email Button
  const copyBtn = document.getElementById('btn-copy-email');
  const copyStatus = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('brian.lang@robustcomputing.com');
        if (copyStatus) {
          copyStatus.textContent = 'Copied!';
          setTimeout(() => { copyStatus.textContent = 'Copy'; }, 2000);
        }
      } catch (err) {
        if (copyStatus) copyStatus.textContent = 'Copied!';
      }
    });
  }

  // --- 4. LIVE iOS SYSTEM CLOCKS ---
  function updateClocks() {
    const now = new Date();

    // Status Bar Clock (e.g. 9:41)
    const statusClock = document.getElementById('status-clock');
    if (statusClock) {
      statusClock.textContent = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      });
    }

    // Homescreen Big Clock
    const bigClock = document.getElementById('home-bigclock');
    if (bigClock) {
      bigClock.textContent = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      });
    }

    // Homescreen Weekday & Date (e.g. Thursday, September 3)
    const weekdayEl = document.getElementById('home-weekday');
    if (weekdayEl) {
      weekdayEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);

})();
