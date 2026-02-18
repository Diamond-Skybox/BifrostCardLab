/**
 * BifrostBadge — Bifrost Card Effects for employee badges
 * Loaded by bifrostbadge-loader.user.js
 */
(function () {
  'use strict';

  // ================================================================
  // CONFIG — Replace these URLs with your corp drive paths
  // ================================================================
  const CONFIG = {
    VERSION: '0.1.0',
    BROADCAST_CHANNEL: 'bifrost-badge-lab',
    DEBUG: true,
  };

  // ================================================================
  // LOGGING
  // ================================================================
  const log = (...args) => {
    if (CONFIG.DEBUG) console.log('[BifrostBadge]', ...args);
  };
  const warn = (...args) => console.warn('[BifrostBadge]', ...args);

  // ================================================================
  // LOCAL STORAGE (replaces GM_getValue/GM_setValue)
  // Since we're loaded as a page script, we use localStorage
  // ================================================================
  const store = {
    get(key, fallback = null) {
      try {
        const val = localStorage.getItem('bifrost_' + key);
        return val !== null ? JSON.parse(val) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('bifrost_' + key, JSON.stringify(value)); }
      catch (e) { warn('localStorage write failed:', e); }
    },
    remove(key) {
      try { localStorage.removeItem('bifrost_' + key); }
      catch (e) { warn('localStorage remove failed:', e); }
    }
  };

  // ================================================================
  // ALIAS EXTRACTION
  // ================================================================

  function extractAlias() {
    // 1. Native badge login div
    const loginDiv = document.querySelector('.worker-badge .login, div.login');
    if (loginDiv) {
      const alias = loginDiv.textContent.trim();
      if (alias) return alias;
    }

    // 2. HyperBadge's Username div
    const hbUsername = document.querySelector('.HyperBadge .Username');
    if (hbUsername) {
      const alias = hbUsername.textContent.trim().replace('@', '');
      if (alias) return alias;
    }

    // 3. URL fallback — /users/{alias}
    const urlMatch = window.location.pathname.match(/\/users\/([^/?#]+)/);
    if (urlMatch) return urlMatch[1];

    return null;
  }

  // ================================================================
  // BADGE PHOTO URL
  // ================================================================

  function getBadgePhotoUrl(alias) {
    return `https://badgephotos.corp.amazon.com/?uid=${alias}`;
  }

  function getFullBadgePhotoUrl(alias) {
    return `https://badgephotos.corp.amazon.com/?fullsizeimage=1&give404ifmissing=1&uid=${alias}`;
  }

  // ================================================================
  // NAME EXTRACTION
  // ================================================================

  function extractName() {
    // HyperBadge elements
    const hbFirst = document.querySelector('.HyperBadge .FirstName');
    const hbLast = document.querySelector('.HyperBadge .LastName');
    if (hbFirst && hbLast) {
      return { first: hbFirst.textContent.trim(), last: hbLast.textContent.trim() };
    }

    // Native badge
    const nameDiv = document.querySelector('.worker-badge .name, div.name');
    if (nameDiv) {
      const strong = nameDiv.querySelector('strong');
      const paragraphs = nameDiv.querySelectorAll('p');
      if (strong && paragraphs.length >= 2) {
        return { first: strong.textContent.trim(), last: paragraphs[1].textContent.trim() };
      }
    }

    return { first: '', last: '' };
  }

  // ================================================================
  // DETECTION
  // ================================================================

  function detectBadgeState() {
    const hyperBadge = document.querySelector('div.HyperBadge');
    const nativeBadge = document.querySelector('div.employee-badge');

    return {
      hasHyperBadge: !!hyperBadge,
      hasNativeBadge: !!nativeBadge,
      hyperBadgeEl: hyperBadge,
      nativeBadgeEl: nativeBadge,
      hyperBadgeMenu: hyperBadge ? hyperBadge.querySelector('div.Menu ul') : null,
      hyperBadgeContainer: hyperBadge ? hyperBadge.querySelector('div.Container') : null,
    };
  }

  // ================================================================
  // BUTTON INJECTION
  // ================================================================

  function createBifrostMenuButton(onClick) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'Button';
    a.href = '#';
    a.innerHTML = `BifrostBadge<span class="Icon"></span>`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      onClick();
    });
    li.appendChild(a);
    return li;
  }

  function createStandaloneButton(onClick) {
    const btn = document.createElement('div');
    btn.id = 'bifrost-badge-activate';
    btn.className = 'bifrost-activate-btn';
    btn.textContent = '✦ BifrostBadge Effects';
    btn.addEventListener('click', onClick);
    return btn;
  }

  function injectButton(badgeState, onClick) {
    const existing = document.getElementById('bifrost-badge-activate');
    if (existing) existing.remove();

    // Also remove any previously injected HyperBadge menu item
    const existingMenuItem = document.querySelector('.bifrost-menu-item');
    if (existingMenuItem) existingMenuItem.remove();

    if (badgeState.hasHyperBadge && badgeState.hyperBadgeMenu) {
      log('Injecting into HyperBadge menu');
      const menuBtn = createBifrostMenuButton(onClick);
      menuBtn.classList.add('bifrost-menu-item');
      badgeState.hyperBadgeMenu.appendChild(menuBtn);
    } else if (badgeState.hasNativeBadge) {
      log('Injecting standalone button');
      const btn = createStandaloneButton(onClick);
      badgeState.nativeBadgeEl.parentNode.insertBefore(
        btn,
        badgeState.nativeBadgeEl.nextSibling
      );
    } else {
      warn('No badge element found');
    }
  }

  // ================================================================
  // EFFECTS LAB (Blob URL)
  // ================================================================

  function openEffectsLab(alias, photoUrl, name, currentShorthand) {
    const bifrostData = window.__bifrostData || {};
    const root = bifrostData.root || '';
    const labUrl = root + '/lab.html'
      + '?alias=' + encodeURIComponent(alias)
      + '&photo=' + encodeURIComponent(photoUrl)
      + '&name=' + encodeURIComponent(name.first + ' ' + name.last)
      + '&fx=' + encodeURIComponent(currentShorthand || '');
    window.open(labUrl, '_blank');
  }

  // ================================================================
  // BROADCAST CHANNEL LISTENER
  // ================================================================

  function setupBroadcastListener(alias) {
    // BroadcastChannel — works for same-origin tabs
    const channel = new BroadcastChannel(CONFIG.BROADCAST_CHANNEL);
    channel.addEventListener('message', (event) => {
      handleLabMessage(event.data, alias);
    });

    // postMessage — works cross-origin (lab on drive-render -> phonetool)
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type && event.data.type.startsWith('bifrost-')) {
        handleLabMessage(event.data, alias);
      }
    });
  }

  function handleLabMessage(data, alias) {
    const { type, alias: msgAlias, shorthand } = data;
    if (msgAlias !== alias) return;

    switch (type) {
      case 'bifrost-save-local':
        log('Saving local frame:', shorthand);
        store.set('frame_' + alias, shorthand);
        applyBifrostFrame(alias, shorthand);
        break;
      case 'bifrost-clear-local':
        log('Clearing local frame');
        store.remove('frame_' + alias);
        removeBifrostFrame();
        break;
    }
  }

  // ================================================================
  // BIFROST CARD RENDERING
  // ================================================================

  // Card state
  let bifrostCardEl = null;
  let hiddenElements = [];

  /**
   * Build and inject the Bifrost badge card.
   */
  function applyBifrostFrame(alias, shorthand) {
    log('Applying frame:', shorthand, 'for', alias);

    // Remove existing Bifrost card if re-applying
    if (bifrostCardEl) removeBifrostFrame();

    const badgeState = detectBadgeState();
    const name = extractName();
    const photoUrl = getFullBadgePhotoUrl(alias);

    // Hide existing badge rendering
    if (badgeState.hasHyperBadge && badgeState.hyperBadgeContainer) {
      badgeState.hyperBadgeContainer.style.display = 'none';
      hiddenElements.push(badgeState.hyperBadgeContainer);
    } else if (badgeState.hasNativeBadge) {
      const workerBadge = badgeState.nativeBadgeEl.querySelector('.worker-badge');
      if (workerBadge) {
        workerBadge.style.display = 'none';
        hiddenElements.push(workerBadge);
      }
    }

    // Build card DOM — renders immediately with photo, frame, tilt
    const card = buildBifrostCard(photoUrl, name, alias);

    // Insert into page
    if (badgeState.hasHyperBadge && badgeState.hyperBadgeContainer) {
      badgeState.hyperBadgeContainer.parentNode.insertBefore(
        card, badgeState.hyperBadgeContainer
      );
    } else if (badgeState.hasNativeBadge) {
      const workerBadge = badgeState.nativeBadgeEl.querySelector('.worker-badge');
      if (workerBadge) {
        workerBadge.parentNode.insertBefore(card, workerBadge);
      } else {
        badgeState.nativeBadgeEl.prepend(card);
      }
    }

    bifrostCardEl = card;

    // Set up tilt/parallax immediately — card is interactive right away
    const tiltState = setupTilt(card);

    // Compute window height after card is in DOM
    computeWindowH(card);

    log('Card injected');

    // Apply effects once engine is available
    applyEffectsWhenReady(card, tiltState, shorthand);
  }

  function applyEffectsWhenReady(card, tiltState, shorthand) {
    if (window.Bifrost && Object.keys(Bifrost.packs).length > 0) {
      // Engine ready — apply now
      const badgeEl = card.querySelector('.bf-badge');
      const layerEls = {
        top: card.querySelector('.bf-layer-top'),
        mid: card.querySelector('.bf-layer-mid'),
        bot: card.querySelector('.bf-layer-bottom'),
        text: card.querySelector('.bf-text-zone'),
      };
      Bifrost.init(badgeEl, layerEls, tiltState, null);

      if (shorthand) {
        Bifrost.applyShorthand(shorthand);
      }
      log('Bifrost engine initialized with', Object.keys(Bifrost.packs).length, 'packs');
    } else {
      // Engine not loaded yet — poll until ready
      log('Waiting for Bifrost engine...');
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (window.Bifrost && Object.keys(Bifrost.packs).length > 0) {
          clearInterval(poll);
          const badgeEl = card.querySelector('.bf-badge');
          const layerEls = {
            top: card.querySelector('.bf-layer-top'),
            mid: card.querySelector('.bf-layer-mid'),
            bot: card.querySelector('.bf-layer-bottom'),
            text: card.querySelector('.bf-text-zone'),
          };
          Bifrost.init(badgeEl, layerEls, tiltState, null);
          if (shorthand) Bifrost.applyShorthand(shorthand);
          log('Bifrost engine initialized (after', attempts * 200 + 'ms wait),', Object.keys(Bifrost.packs).length, 'packs');
        } else if (attempts > 50) { // 10 second timeout
          clearInterval(poll);
          log('Bifrost engine failed to load after 10s');
        }
      }, 200);
    }
  }

  /**
   * Build the Bifrost card DOM structure.
   * Badge photos are 3:4 ratio.
   */
  function buildBifrostCard(photoUrl, name, alias) {
    const boundary = document.createElement('div');
    boundary.className = 'bifrost-boundary';
    boundary.id = 'bifrost-badge-card';

    boundary.innerHTML = `
      <div class="bf-badge has-gloss">
        <div class="bf-badge-sizer"></div>
        <div class="bf-layer-bottom">
          <img class="bf-art-image" src="${photoUrl}" alt="${name.first} ${name.last}" />
        </div>
        <div class="bf-layer-mid"></div>
        <div class="bf-layer-top">
          <div class="bf-frame-surface"></div>
          <div class="bf-art-window-border"></div>
        </div>
        <div class="bf-gloss-overlay"></div>
        <div class="bf-text-zone">
          <div class="bf-badge-name">${name.first} ${name.last}</div>
          <div class="bf-badge-alias">@${alias}</div>
        </div>
      </div>
    `;

    return boundary;
  }

  /**
   * Compute --window-h from card width for the clip-path.
   */
  function computeWindowH(boundary) {
    const card = boundary.querySelector('.bf-badge');
    if (!card) return;

    const update = () => {
      const padding = 10; // --frame-padding
      const textZoneH = 52; // --text-zone-h
      const artMargin = 11; // --art-margin
      const winW = card.offsetWidth - padding * 2;
      if (winW <= 0) return;
      const winH = winW * (4 / 3); // 3:4 ratio
      card.style.setProperty('--window-h', `${winH}px`);
      // Explicit height to ensure text zone fits
      const totalH = padding + winH + textZoneH + padding;
      card.style.height = `${totalH}px`;
      // Explicit image dimensions as backup
      const img = card.querySelector('.bf-art-image');
      if (img) {
        img.style.top = (padding - artMargin) + 'px';
        img.style.left = (padding - artMargin) + 'px';
        img.style.width = (winW + artMargin * 2) + 'px';
        img.style.height = (winH + artMargin * 2) + 'px';
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(card);
    // Store observer for cleanup
    card._resizeObserver = observer;
  }

  /**
   * Set up tilt and parallax on mousemove.
   */
  function setupTilt(boundary) {
    const card = boundary.querySelector('.bf-badge');
    if (!card) return { x: 0, y: 0 };

    const tiltState = { x: 0, y: 0 };

    boundary.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      tiltState.x = normX;
      tiltState.y = normY;

      card.style.setProperty('--rotateX', `${normY * -12}deg`);
      card.style.setProperty('--rotateY', `${normX * 12}deg`);
      card.style.setProperty('--glossX', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glossY', `${(y / rect.height) * 100}%`);
      card.style.setProperty('--parallax-x', `${normX * 8.5}px`);
      card.style.setProperty('--parallax-y', `${normY * 8.5}px`);
    });

    boundary.addEventListener('mouseleave', () => {
      tiltState.x = 0;
      tiltState.y = 0;

      card.style.setProperty('--rotateX', '0deg');
      card.style.setProperty('--rotateY', '0deg');
      card.style.setProperty('--glossX', '50%');
      card.style.setProperty('--glossY', '50%');
      card.style.setProperty('--parallax-x', '0px');
      card.style.setProperty('--parallax-y', '0px');
    });

    return tiltState;
  }

  /**
   * Remove Bifrost card and restore original badge.
   */
  function removeBifrostFrame() {
    log('Removing frame');

    // Deactivate all effects
    if (window.Bifrost) {
      Bifrost.deactivateAll();
    }

    if (bifrostCardEl) {
      const card = bifrostCardEl.querySelector('.bf-badge');
      if (card && card._resizeObserver) {
        card._resizeObserver.disconnect();
      }
      bifrostCardEl.remove();
      bifrostCardEl = null;
    }

    // Restore hidden elements
    hiddenElements.forEach(el => {
      el.style.display = '';
    });
    hiddenElements = [];
  }

  // ================================================================
  // MAIN
  // ================================================================

  async function init() {
    log('Initializing v' + CONFIG.VERSION);

    // 1. Extract alias
    const alias = extractAlias();
    if (!alias) { warn('No alias found — aborting'); return; }
    log('Alias:', alias);

    // 2. Extract name + photo
    const name = extractName();
    const photoUrl = getFullBadgePhotoUrl(alias);
    log('Name:', name.first, name.last);

    // 3. Check blocklist (pre-loaded by loader via GM_xmlhttpRequest)
    const bifrostData = window.__bifrostData || {};
    const blocklist = bifrostData.blocklist;
    if (Array.isArray(blocklist) && blocklist.includes(alias)) {
      log('Alias blocklisted — skipping');
      return;
    }

    // 4. Check database frames (pre-loaded by loader)
    const userFrames = bifrostData.userFrames;
    const dbFrame = userFrames ? userFrames[alias] : null;
    if (dbFrame) {
      log('Database frame found:', dbFrame);
      applyBifrostFrame(alias, dbFrame);
      // Locked — no edit button
      return;
    }

    // 5. Check local save
    const localFrame = store.get('frame_' + alias);
    if (localFrame) {
      log('Local frame found:', localFrame);
      applyBifrostFrame(alias, localFrame);
    }

    // 6. Detect badge & inject button
    const badgeState = detectBadgeState();
    log('State:', { hb: badgeState.hasHyperBadge, native: badgeState.hasNativeBadge });

    injectButton(badgeState, () => {
      const current = store.get('frame_' + alias, '');
      openEffectsLab(alias, photoUrl, name, current);
    });

    // 7. Listen for lab messages
    setupBroadcastListener(alias);

    log('Ready');
  }

  // ================================================================
  // STARTUP — delay to let HyperBadge inject first
  // ================================================================

  function start() { setTimeout(init, 500); }

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start);
  }

})();
