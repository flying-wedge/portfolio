/**
 * Brian Lang - Technical Software Architect Portfolio
 * Apple iOS 18 SpringBoard, Navigation Sheets, & Dynamic Island Controller
 */

(function () {
  'use strict';

  // --- 1. MODAL APP SHEETS CONTROLLER ---
  const sheets = document.querySelectorAll('.ios-sheet');
  const homeIndicator = document.getElementById('home-indicator');

  /**
   * Open an iOS modal sheet
   * @param {string} sheetId 
   */
  function openSheet(sheetId) {
    const target = document.getElementById(sheetId);
    if (!target) return;

    // Close active sheets
    sheets.forEach(s => {
      if (s !== target) s.classList.remove('active');
    });

    target.classList.add('active');

    // Scroll sheet to top
    const content = target.querySelector('.sheet-content');
    if (content) content.scrollTop = 0;
  }

  /**
   * Dismiss all sheets back to SpringBoard
   */
  function closeAllSheets() {
    sheets.forEach(s => s.classList.remove('active'));
  }

  // Bind click/tap on launchers (widgets, app grid icons, dock items)
  document.querySelectorAll('[data-launch]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = el.getAttribute('data-launch');
      if (targetId) {
        closeSpotlight();
        openSheet(targetId);
      }
    });

    // Keyboard support (Enter / Space)
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetId = el.getAttribute('data-launch');
        if (targetId) {
          closeSpotlight();
          openSheet(targetId);
        }
      }
    });
  });

  // Bind "Done" dismissal buttons
  document.querySelectorAll('[data-dismiss]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllSheets();
    });
  });

  // Home Indicator click dismisses open sheets
  if (homeIndicator) {
    homeIndicator.addEventListener('click', () => {
      closeAllSheets();
      closeSpotlight();
    });
  }

  // ESC key dismisses active sheet or spotlight
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSheets();
      closeSpotlight();
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
      // Ignore click if clicking the contact button inside
      if (e.target.closest('.island-action-btn')) return;
      toggleIsland();
    });

    dynamicIsland.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleIsland();
      }
    });
  }

  // --- 3. LIVE STATUS BAR CLOCK ---
  function updateClock() {
    const clock = document.getElementById('status-clock');
    if (!clock) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12;
    clock.textContent = `${hours}:${minutes}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // --- 4. 1-CLICK CLIPBOARD COPY (EMAIL) ---
  const copyBtn = document.getElementById('copy-email-action');
  const copyStatus = document.getElementById('copy-text-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'brian.lang@robustcomputing.com';
      try {
        await navigator.clipboard.writeText(email);
        if (copyStatus) {
          copyStatus.textContent = 'copied!';
          setTimeout(() => {
            copyStatus.textContent = 'copy';
          }, 2000);
        }
      } catch (err) {
        window.prompt('Copy email to clipboard:', email);
      }
    });
  }

  // --- 5. SPOTLIGHT SEARCH CONTROLLER ---
  const spotlightTrigger = document.getElementById('spotlight-trigger');
  const spotlightModal = document.getElementById('spotlight-modal');
  const spotlightClose = document.getElementById('spotlight-close');
  const spotlightInput = document.getElementById('spotlight-input');
  const spotlightResults = document.getElementById('spotlight-results');

  const searchableItems = [
    { title: 'Resume / Curriculum Vitae', sub: 'PDF, Work Experience, Education', target: 'app-resume', icon: '📄' },
    { title: 'Large Scale Transformations & Integrations', sub: 'Enterprise System Modernization, Architecture & Strategy', target: 'app-resume', icon: '🔄' },
    { title: 'Apache Kafka & Event Fabrics', sub: 'Streaming, Partitioning, Consumer Groups', target: 'app-skills', icon: '⚡' },
    { title: 'Go (Golang)', sub: 'Concurrency, Microservices, Network Engines', target: 'app-skills', icon: '🔷' },
    { title: 'Kubernetes & Docker', sub: 'Multi-Region Orchestration, Helm, Envoy', target: 'app-skills', icon: '☸️' },
    { title: 'AWS & Google Cloud (GCP)', sub: 'VPC Peering, IAM Zero-Trust, Serverless', target: 'app-skills', icon: '☁️' },
    { title: 'Apex Cloud Systems', sub: 'Staff Technical Architect (2023 - Present)', target: 'app-experience', icon: '💼' },
    { title: 'DataSphere Analytics', sub: 'Principal Systems Architect (2020 - 2023)', target: 'app-experience', icon: '📊' },
    { title: 'Terminal Console', sub: 'Interactive CLI Profile & Commands', target: 'app-terminal', icon: '💻' },
    { title: 'Contact Brian Lang', sub: '+1 (785) 550-3966 • brian.lang@robustcomputing.com • Kansas City Area / Remote', target: 'app-contact', icon: '✉️' }
  ];

  function openSpotlight() {
    if (!spotlightModal) return;
    spotlightModal.classList.add('active');
    spotlightModal.setAttribute('aria-hidden', 'false');
    if (spotlightInput) {
      spotlightInput.value = '';
      renderSpotlightResults('');
      setTimeout(() => spotlightInput.focus(), 50);
    }
  }

  function closeSpotlight() {
    if (!spotlightModal) return;
    spotlightModal.classList.remove('active');
    spotlightModal.setAttribute('aria-hidden', 'true');
  }

  function renderSpotlightResults(query) {
    if (!spotlightResults) return;
    const cleanQuery = query.trim().toLowerCase();
    const filtered = cleanQuery
      ? searchableItems.filter(item => 
          item.title.toLowerCase().includes(cleanQuery) || 
          item.sub.toLowerCase().includes(cleanQuery)
        )
      : searchableItems.slice(0, 5);

    if (filtered.length === 0) {
      spotlightResults.innerHTML = `
        <div style="padding: 16px; text-align: center; color: rgba(235, 235, 245, 0.4); font-size: 13px;">
          No matching skills or documents found
        </div>`;
      return;
    }

    spotlightResults.innerHTML = filtered.map(item => `
      <div class="spotlight-item" data-target="${item.target}" tabindex="0" role="button">
        <span style="font-size: 20px;">${item.icon}</span>
        <div>
          <div class="spotlight-item-title">${item.title}</div>
          <div class="spotlight-item-sub">${item.sub}</div>
        </div>
      </div>
    `).join('');

    spotlightResults.querySelectorAll('.spotlight-item').forEach(el => {
      el.addEventListener('click', () => {
        const target = el.getAttribute('data-target');
        closeSpotlight();
        openSheet(target);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const target = el.getAttribute('data-target');
          closeSpotlight();
          openSheet(target);
        }
      });
    });
  }

  if (spotlightTrigger) spotlightTrigger.addEventListener('click', openSpotlight);
  if (spotlightClose) spotlightClose.addEventListener('click', closeSpotlight);
  if (spotlightInput) {
    spotlightInput.addEventListener('input', (e) => renderSpotlightResults(e.target.value));
  }

  // --- 6. THEME APPEARANCE TOGGLES (LIGHT MODE, ANDROID 16 & AURORA) ---
  const toggleLightMode = document.getElementById('toggle-light-mode');
  const toggleAndroidMode = document.getElementById('toggle-android-mode');
  const appearanceSubtitle = document.getElementById('appearance-subtitle');

  function updateAppearanceSubtitle() {
    if (!appearanceSubtitle) return;
    const isAndroid = document.body.classList.contains('android-theme');
    appearanceSubtitle.textContent = isAndroid
      ? 'Switch to crisp Android 16 Light Appearance'
      : 'Switch to crisp iOS 18 Light Appearance';
  }

  if (toggleLightMode) {
    const savedTheme = localStorage.getItem('portfolio-theme-appearance');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      toggleLightMode.textContent = 'On';
      toggleLightMode.classList.add('active');
    }

    toggleLightMode.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      toggleLightMode.textContent = isLight ? 'On' : 'Off';
      toggleLightMode.classList.toggle('active', isLight);
      localStorage.setItem('portfolio-theme-appearance', isLight ? 'light' : 'dark');
    });
  }

  if (toggleAndroidMode) {
    const savedPlatform = localStorage.getItem('portfolio-platform-theme');
    if (savedPlatform === 'android16') {
      document.body.classList.add('android-theme');
      toggleAndroidMode.textContent = 'On';
      toggleAndroidMode.classList.add('active');
      updateAppearanceSubtitle();
    }

    toggleAndroidMode.addEventListener('click', () => {
      document.body.classList.toggle('android-theme');
      const isAndroid = document.body.classList.contains('android-theme');
      toggleAndroidMode.textContent = isAndroid ? 'On' : 'Off';
      toggleAndroidMode.classList.toggle('active', isAndroid);
      localStorage.setItem('portfolio-platform-theme', isAndroid ? 'android16' : 'ios18');
      updateAppearanceSubtitle();
    });
  }

  const toggleAurora = document.getElementById('toggle-aurora');
  if (toggleAurora) {
    toggleAurora.addEventListener('click', () => {
      document.body.classList.toggle('no-aurora');
      const isPlain = document.body.classList.contains('no-aurora');
      toggleAurora.textContent = isPlain ? 'Off' : 'On';
      toggleAurora.classList.toggle('active', !isPlain);
    });
  }

  // Expose global helpers
  window.openSheet = openSheet;
  window.closeAllSheets = closeAllSheets;

})();
