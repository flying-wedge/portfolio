/**
 * Triple OS Desktop Navigation & Window System
 * - macOS Tahoe/Sequoia (Menu Bar + Dock)
 * - Windows 11 Fluent (Taskbar + Start Menu)
 * - Fedora Linux GNOME 46 (Adwaita Top Bar + Dash Dock + Activities Overview)
 * - Light & Dark modes supported across all 3 OS environments
 * - Kansas State Powercat background for Dark Mode
 */

(function () {
  'use strict';

  let highestZ = 35;
  const OS_STORAGE_KEY = 'portfolio-os-preference';
  const THEME_STORAGE_KEY = 'portfolio-theme-preference';
  const html = document.documentElement;

  const OS_CYCLE = ['macos', 'windows', 'fedora'];

  // --- 1. CORE WINDOW CONTROLLER ---
  function bringToFront(win) {
    if (!win) return;
    highestZ += 2;
    win.style.zIndex = highestZ;
    document.querySelectorAll('.system-window').forEach(w => w.classList.remove('active'));
    win.classList.add('active');
  }

  function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    win.classList.remove('minimized');
    win.classList.remove('hidden');
    win.style.display = 'flex';
    
    bringToFront(win);
    updateActiveIndicators(windowId);
  }

  function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.add('hidden');
    win.style.display = 'none';
    win.classList.remove('active');
    updateActiveIndicators();
  }

  function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.add('minimized');
    win.classList.remove('active');
    updateActiveIndicators();
  }

  function zoomWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    if (win.getAttribute('data-zoomed') === 'true') {
      win.style.top = win.getAttribute('data-prev-top') || '80px';
      win.style.left = win.getAttribute('data-prev-left') || '100px';
      win.style.width = win.getAttribute('data-prev-width') || '700px';
      win.style.height = '';
      win.removeAttribute('data-zoomed');
    } else {
      win.setAttribute('data-prev-top', win.style.top || `${win.offsetTop}px`);
      win.setAttribute('data-prev-left', win.style.left || `${win.offsetLeft}px`);
      win.setAttribute('data-prev-width', win.style.width || `${win.offsetWidth}px`);
      
      const currentOS = html.getAttribute('data-os');
      const topOffset = currentOS === 'windows' ? '10px' : '38px';
      win.style.top = topOffset;
      win.style.left = '16px';
      win.style.width = 'calc(100vw - 32px)';
      win.setAttribute('data-zoomed', 'true');
    }
    bringToFront(win);
  }

  function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.classList.contains('hidden') || win.style.display === 'none') {
      openWindow(windowId);
    } else if (win.classList.contains('minimized')) {
      openWindow(windowId);
    } else if (win.classList.contains('active')) {
      minimizeWindow(windowId);
    } else {
      bringToFront(win);
      updateActiveIndicators(windowId);
    }
  }

  window.openWindow = openWindow;
  window.closeWindow = closeWindow;
  window.minimizeWindow = minimizeWindow;
  window.zoomWindow = zoomWindow;
  window.toggleWindow = toggleWindow;

  // --- 2. UPDATE ACTIVE UI INDICATORS ---
  function updateActiveIndicators(activeWindowId) {
    // macOS Menu Bar & Fedora GNOME Top Bar navigation pills
    document.querySelectorAll('.menubar-nav-btn, .gnome-nav-pill').forEach(btn => {
      const target = btn.getAttribute('data-target');
      if (target === activeWindowId) {
        btn.classList.add('active-nav');
      } else {
        btn.classList.remove('active-nav');
      }
    });

    // macOS Dock, Windows Taskbar, and Fedora GNOME Dash Dock
    ['.dock-app[data-target]', '.win-taskbar-icon[data-target]', '.dash-item[data-target]'].forEach(selector => {
      document.querySelectorAll(selector).forEach(item => {
        const target = item.getAttribute('data-target');
        const win = document.getElementById(target);
        if (win && !win.classList.contains('hidden') && win.style.display !== 'none') {
          item.classList.add('open');
        } else {
          item.classList.remove('open');
        }
      });
    });
  }

  // --- 3. UNIFIED NAVIGATION EVENT HANDLERS ---
  
  // (A) Top Bar Navigation Buttons
  document.querySelectorAll('.menubar-nav-btn, .gnome-nav-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      if (target) openWindow(target);
    });
  });

  // (B) Desktop Icons
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const target = icon.getAttribute('data-open');
      if (target) openWindow(target);
    });
  });

  // (C) In-content & App Launcher Navigation Buttons
  document.querySelectorAll('.nav-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      if (target) {
        openWindow(target);
        toggleStartMenu(false);
        toggleOverview(false);
      }
    });
  });

  // (D) macOS Dock, Windows Taskbar & Fedora GNOME Dash
  ['.dock-app[data-target]', '.win-taskbar-icon[data-target]', '.dash-item[data-target]'].forEach(selector => {
    document.querySelectorAll(selector).forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        if (target) toggleWindow(target);
      });
    });
  });

  // (E) Focus Window on Click
  document.querySelectorAll('.system-window').forEach(win => {
    win.addEventListener('mousedown', () => {
      bringToFront(win);
      updateActiveIndicators(win.id);
    });
  });

  // (F) macOS Traffic Lights
  document.querySelectorAll('.t-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(btn.getAttribute('data-window'));
    });
  });
  document.querySelectorAll('.t-min').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizeWindow(btn.getAttribute('data-window'));
    });
  });
  document.querySelectorAll('.t-max').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomWindow(btn.getAttribute('data-window'));
    });
  });

  // (G) Windows 11 Window Controls
  document.querySelectorAll('.win-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(btn.getAttribute('data-window'));
    });
  });
  document.querySelectorAll('.win-min').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizeWindow(btn.getAttribute('data-window'));
    });
  });
  document.querySelectorAll('.win-max').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomWindow(btn.getAttribute('data-window'));
    });
  });

  // (H) Fedora GNOME Window Controls
  document.querySelectorAll('.gnome-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(btn.getAttribute('data-window'));
    });
  });
  document.querySelectorAll('.gnome-min').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizeWindow(btn.getAttribute('data-window'));
    });
  });
  document.querySelectorAll('.gnome-max').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomWindow(btn.getAttribute('data-window'));
    });
  });

  // --- 4. DRAGGABLE WINDOW TITLEBARS ---
  document.querySelectorAll('.window-titlebar').forEach(titlebar => {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const windowId = titlebar.getAttribute('data-drag');
    const win = document.getElementById(windowId);

    titlebar.addEventListener('mousedown', (e) => {
      if (
        e.target.closest('.traffic-lights') || 
        e.target.closest('.win-window-controls') || 
        e.target.closest('.gnome-window-controls') ||
        e.target.closest('.window-actions') ||
        e.target.closest('button') ||
        e.target.closest('a')
      ) {
        return;
      }
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      bringToFront(win);
      updateActiveIndicators(win.id);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !win) return;
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;
      const currentOS = html.getAttribute('data-os');
      const minY = currentOS === 'windows' ? 8 : 34;
      newY = Math.max(minY, newY);
      win.style.left = `${newX}px`;
      win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });

  // --- 5. LAUNCHERS (Windows 11 Start Menu & Fedora GNOME Activities Overview) ---
  const startMenu = document.getElementById('win-start-menu');
  const startTrigger = document.getElementById('win-start-trigger');
  const gnomeOverview = document.getElementById('fedora-overview');
  const activitiesTrigger = document.getElementById('fedora-activities-trigger');

  function toggleStartMenu(forceState) {
    if (!startMenu) return;
    const shouldOpen = forceState !== undefined ? forceState : !startMenu.classList.contains('open');
    if (shouldOpen) startMenu.classList.add('open');
    else startMenu.classList.remove('open');
  }

  function toggleOverview(forceState) {
    if (!gnomeOverview) return;
    const shouldOpen = forceState !== undefined ? forceState : !gnomeOverview.classList.contains('open');
    if (shouldOpen) gnomeOverview.classList.add('open');
    else gnomeOverview.classList.remove('open');
  }

  window.toggleStartMenu = toggleStartMenu;
  window.toggleOverview = toggleOverview;

  if (startTrigger) {
    startTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });
  }

  if (activitiesTrigger) {
    activitiesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleOverview();
    });
  }

  document.addEventListener('click', (e) => {
    if (startMenu && startMenu.classList.contains('open')) {
      if (!startMenu.contains(e.target) && !e.target.closest('#win-start-trigger')) {
        toggleStartMenu(false);
      }
    }
    if (gnomeOverview && gnomeOverview.classList.contains('open')) {
      if (!gnomeOverview.contains(e.target) && !e.target.closest('#fedora-activities-trigger')) {
        toggleOverview(false);
      }
    }
  });

  // Task View Button (Windows 11)
  const taskViewBtn = document.getElementById('win-taskview-btn');
  if (taskViewBtn) {
    taskViewBtn.addEventListener('click', () => {
      ['window-terminal', 'window-resume', 'window-projects', 'window-skills', 'window-experience'].forEach((id, idx) => {
        const w = document.getElementById(id);
        if (w) {
          w.classList.remove('minimized');
          w.classList.remove('hidden');
          w.style.display = 'flex';
          w.style.top = `${50 + (idx * 30)}px`;
          w.style.left = `${60 + (idx * 40)}px`;
        }
      });
      updateActiveIndicators();
    });
  }

  // --- 6. TRIPLE OS CYCLE CONTROLLER ---
  function setOS(os) {
    html.setAttribute('data-os', os);
    localStorage.setItem(OS_STORAGE_KEY, os);
    toggleStartMenu(false);
    toggleOverview(false);
    updateActiveIndicators();
  }

  function cycleOS() {
    const current = html.getAttribute('data-os') || 'macos';
    const currentIndex = OS_CYCLE.indexOf(current);
    const nextOS = OS_CYCLE[(currentIndex + 1) % OS_CYCLE.length];
    setOS(nextOS);
  }

  window.setOS = setOS;
  window.cycleOS = cycleOS;

  // Cycle buttons across OS surfaces
  ['os-cycle-btn-macos', 'os-cycle-btn-win', 'os-cycle-btn-win-tray', 'os-cycle-btn-fedora'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', cycleOS);
  });

  // --- 7. THEME CONTROLLER (Dark / Light) ---
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const isDark = theme === 'dark';
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.textContent = isDark ? '🌙' : '☀️';
    });
    document.querySelectorAll('.theme-label').forEach(label => {
      label.textContent = isDark ? 'Dark' : 'Light';
    });
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  ['theme-toggle-macos', 'theme-toggle-win', 'theme-toggle-win-tray', 'theme-toggle-fedora', 'dock-theme-btn', 'dash-theme-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme);
  });

  // Apple Logo Trigger
  const appleBtn = document.getElementById('apple-menu-btn');
  if (appleBtn) {
    appleBtn.addEventListener('click', () => openWindow('window-terminal'));
  }

  // --- 8. LIVE CLOCK ENGINE ---
  function updateClocks() {
    const now = new Date();
    
    // Top Bar Clocks (macOS & Fedora GNOME)
    document.querySelectorAll('.live-clock').forEach(clock => {
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      clock.textContent = now.toLocaleString('en-US', options).replace(/,/g, '');
    });

    // Windows 11 Tray Clock & Date
    const winTimeEl = document.querySelector('.live-time-clock');
    const winDateEl = document.querySelector('.live-date');
    if (winTimeEl) {
      winTimeEl.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    if (winDateEl) {
      winDateEl.textContent = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);

  // Initialize
  setOS(localStorage.getItem(OS_STORAGE_KEY) || 'macos');
  setTheme(localStorage.getItem(THEME_STORAGE_KEY) || 'dark');
  openWindow('window-terminal');

})();
