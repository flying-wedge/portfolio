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

  // --- 4. VCARD DOWNLOAD FEEDBACK ---
  const vcardBtn = document.getElementById('download-vcard-btn');
  const vcardBtnText = document.getElementById('vcard-btn-text');
  if (vcardBtn && vcardBtnText) {
    vcardBtn.addEventListener('click', () => {
      const originalText = vcardBtnText.textContent;
      vcardBtnText.textContent = 'saved!';
      setTimeout(() => {
        vcardBtnText.textContent = originalText;
      }, 2000);
    });
  }

  // --- 5. SPOTLIGHT SEARCH CONTROLLER (CONTACT DETAILS) ---
  const spotlightTrigger = document.getElementById('spotlight-trigger');
  const spotlightModal = document.getElementById('spotlight-modal');
  const spotlightClose = document.getElementById('spotlight-close');
  const spotlightInput = document.getElementById('spotlight-input');
  const spotlightResults = document.getElementById('spotlight-results');

  const contactSearchItems = [
    {
      title: 'Download Contact Card (vCard)',
      sub: 'Save Brian Lang (.vcf) directly to Apple / Google Contacts',
      target: 'assets/Brian_Lang.vcf',
      icon: '🪪',
      keywords: 'vcard contact card download vcf address book save phone number add brian lang',
      actionType: 'download'
    },
    {
      title: 'Phone Call: +1 (785) 550-3966',
      sub: 'Direct phone line to Brian Lang',
      target: 'tel:+17855503966',
      icon: '📞',
      keywords: 'phone call telephone mobile cell 785 550 3966 number voice call',
      actionType: 'link'
    },
    {
      title: 'SMS / iMessage: +1 (785) 550-3966',
      sub: 'Send text message or iMessage to Brian',
      target: 'sms:+17855503966',
      icon: '💬',
      keywords: 'sms text imessage message chat 785 550 3966 mobile',
      actionType: 'link'
    },
    {
      title: 'Email: brian.lang@robustcomputing.com',
      sub: 'Send email message via Gmail / default mail client',
      target: 'mailto:brian.lang@robustcomputing.com',
      icon: '✉️',
      keywords: 'email mail gmail message inbox brian lang robust computing robustcomputing',
      actionType: 'link'
    },
    {
      title: 'WhatsApp: @flyingwedge05',
      sub: 'Chat directly on WhatsApp with Brian',
      target: 'https://wa.me/flyingwedge05',
      icon: '🟢',
      keywords: 'whatsapp chat message green app flyingwedge05 online',
      actionType: 'external'
    },
    {
      title: 'Telegram: @flyingwedge72',
      sub: 'Chat directly on Telegram (t.me/flyingwedge72)',
      target: 'https://t.me/flyingwedge72',
      icon: '✈️',
      keywords: 'telegram chat message flyingwedge72 t.me app direct aviation plane blue',
      actionType: 'external'
    },
    {
      title: 'LinkedIn: Brian Lang',
      sub: 'linkedin.com/in/brian-lang-4b99282',
      target: 'https://www.linkedin.com/in/brian-lang-4b99282/',
      icon: '💼',
      keywords: 'linkedin profile network connect career resume social',
      actionType: 'external'
    },
    {
      title: 'GitHub: flying-wedge',
      sub: 'github.com/flying-wedge • Code Repositories & Architecture',
      target: 'https://github.com/flying-wedge',
      icon: '🐙',
      keywords: 'github code repo git projects open source repository architecture flying-wedge',
      actionType: 'external'
    },
    {
      title: 'Location & Availability',
      sub: 'Kansas City Area (CST / UTC-6) • Remote & Advisory Open',
      target: 'app-contact',
      icon: '📍',
      keywords: 'location city kansas missouri cst timezone remote hybrid advisory address area',
      actionType: 'sheet'
    },
    {
      title: 'Full Contact Sheet',
      sub: 'Open complete Contact Brian interactive sheet',
      target: 'app-contact',
      icon: '👤',
      keywords: 'contact profile brian lang info details sheet view',
      actionType: 'sheet'
    }
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

  function handleSearchItemAction(item) {
    closeSpotlight();
    if (item.actionType === 'download') {
      const a = document.createElement('a');
      a.href = item.target;
      a.download = 'Brian_Lang.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (item.actionType === 'external') {
      window.open(item.target, '_blank', 'noopener,noreferrer');
    } else if (item.actionType === 'link') {
      window.location.href = item.target;
    } else if (item.actionType === 'sheet') {
      openSheet(item.target);
    }
  }

  function renderSpotlightResults(query) {
    if (!spotlightResults) return;
    const cleanQuery = query.trim().toLowerCase();
    const filtered = cleanQuery
      ? contactSearchItems.filter(item =>
          item.title.toLowerCase().includes(cleanQuery) ||
          item.sub.toLowerCase().includes(cleanQuery) ||
          (item.keywords && item.keywords.toLowerCase().includes(cleanQuery))
        )
      : contactSearchItems;

    if (filtered.length === 0) {
      spotlightResults.innerHTML = `
        <div style="padding: 20px; text-align: center; color: rgba(235, 235, 245, 0.45); font-size: 13.5px;">
          No matching contact details found
        </div>`;
      return;
    }

    spotlightResults.innerHTML = filtered.map((item, idx) => `
      <div class="spotlight-item" data-index="${idx}" tabindex="0" role="button" aria-label="${item.title}">
        <span style="font-size: 20px; width: 28px; text-align: center;">${item.icon}</span>
        <div style="flex: 1; min-width: 0;">
          <div class="spotlight-item-title">${item.title}</div>
          <div class="spotlight-item-sub">${item.sub}</div>
        </div>
        <span style="color: rgba(235, 235, 245, 0.4); font-size: 13px; font-weight: 600;">→</span>
      </div>
    `).join('');

    spotlightResults.querySelectorAll('.spotlight-item').forEach(el => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      const item = filtered[idx];
      el.addEventListener('click', () => handleSearchItemAction(item));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearchItemAction(item);
        }
      });
    });
  }

  if (spotlightTrigger) {
    spotlightTrigger.addEventListener('click', openSpotlight);
    spotlightTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSpotlight();
      }
    });
  }
  if (spotlightClose) spotlightClose.addEventListener('click', closeSpotlight);
  if (spotlightModal) {
    spotlightModal.addEventListener('click', (e) => {
      if (e.target === spotlightModal) closeSpotlight();
    });
  }
  if (spotlightInput) {
    spotlightInput.addEventListener('input', (e) => renderSpotlightResults(e.target.value));
  }

  // --- 6. THEME APPEARANCE TOGGLES (LIGHT MODE & AURORA) ---
  const toggleLightMode = document.getElementById('toggle-light-mode');
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
