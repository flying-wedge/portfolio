/**
 * Brian Lang - Technical Software Architect Portfolio
 * Apple iOS 18 SpringBoard & Sheets Controller
 */

(function () {
  'use strict';

  // --- 1. APP SHEETS CONTROLLER (Slide-up sheets for apps & widgets) ---
  const sheets = document.querySelectorAll('.app-sheet');
  const homeBar = document.getElementById('ios-home-bar');

  function openSheet(sheetId) {
    const target = document.getElementById(sheetId);
    if (!target) return;

    // Close any other open sheet first
    sheets.forEach(s => {
      if (s !== target) s.classList.remove('open');
    });

    target.classList.add('open');

    // Scroll sheet to top
    const scrollBody = target.querySelector('.sheet-scroll-body');
    if (scrollBody) {
      scrollBody.scrollTop = 0;
    }
  }

  function closeAllSheets() {
    sheets.forEach(s => s.classList.remove('open'));
  }

  // Bind click on any launcher (Widgets, App Icons, Dock Apps)
  document.querySelectorAll('[data-launch]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = el.getAttribute('data-launch');
      if (targetId) {
        openSheet(targetId);
      }
    });

    // Support keyboard activation (Enter / Space)
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetId = el.getAttribute('data-launch');
        if (targetId) {
          openSheet(targetId);
        }
      }
    });
  });

  // Bind click on "Done" / close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllSheets();
    });
  });

  // Home bar click / tap: Dismiss all sheets back to SpringBoard
  if (homeBar) {
    homeBar.addEventListener('click', () => {
      closeAllSheets();
    });
  }

  // ESC key returns to Home screen
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSheets();
    }
  });

  // --- 2. DYNAMIC ISLAND CONTROLLER ---
  const dynamicIsland = document.getElementById('dynamic-island');
  let islandTimer = null;

  if (dynamicIsland) {
    function toggleIsland() {
      dynamicIsland.classList.toggle('expanded');
      if (islandTimer) clearTimeout(islandTimer);

      if (dynamicIsland.classList.contains('expanded')) {
        islandTimer = setTimeout(() => {
          dynamicIsland.classList.remove('expanded');
        }, 5000);
      }
    }

    dynamicIsland.addEventListener('click', (e) => {
      // Don't toggle if clicking the contact action button inside expanded island
      if (e.target.closest('.island-btn')) return;
      toggleIsland();
    });

    dynamicIsland.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleIsland();
      }
    });
  }

  // --- 3. COPY EMAIL CLIPBOARD HANDLER ---
  const copyBtn = document.getElementById('copy-email-btn');
  const copyLabel = document.getElementById('copy-label');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'brian.lang@robustcomputing.com';
      try {
        await navigator.clipboard.writeText(email);
        if (copyLabel) {
          copyLabel.textContent = 'copied!';
          setTimeout(() => {
            copyLabel.textContent = 'copy';
          }, 2000);
        }
      } catch (err) {
        // Fallback prompt
        window.prompt('Copy email to clipboard:', email);
      }
    });
  }

  // --- 4. LIVE iOS STATUS BAR CLOCK ---
  function updateClock() {
    const statusTime = document.getElementById('status-time');
    if (!statusTime) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // Format in 12-hour style without am/pm for authentic iOS top bar
    hours = hours % 12 || 12;
    statusTime.textContent = `${hours}:${minutes}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Expose methods for console/debugging
  window.openSheet = openSheet;
  window.closeAllSheets = closeAllSheets;

})();
