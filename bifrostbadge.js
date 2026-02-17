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
    ROOT:             '', /* REPLACE: Base URL for your corp drive folder */
    BLOCKLIST_URL:    '', /* REPLACE: URL to blocked_aliases.json */
    USER_FRAMES_URL:  '', /* REPLACE: URL to user_frames.json */
    PACK_MANIFEST_URL:'', /* REPLACE: URL to pack_manifest.json */
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
  // DATA FETCHING
  // ================================================================

  async function fetchJSON(url) {
    if (!url) return null;
    try {
      const resp = await fetch(url, { credentials: 'include' });
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      warn('Failed to fetch', url, e);
      return null;
    }
  }

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
    a.innerHTML = `<span class="Icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L9.5 5.5L16 8L9.5 10.5L8 16L6.5 10.5L0 8L6.5 5.5L8 0Z" fill="currentColor"/></svg></span>BifrostBadge`;
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
    const labHTML = generateLabHTML(alias, photoUrl, name, currentShorthand);
    const blob = new Blob([labHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  function generateLabHTML(alias, photoUrl, name, currentShorthand) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bifrost Card Effects Lab</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a12;color:#eee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem}
.lab-header{text-align:center;margin-bottom:2rem}
.lab-header h1{font-size:1.8rem;background:linear-gradient(135deg,#54a0ff,#00ff88,#e94560);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:0.5rem}
.lab-header .subtitle{color:#888;font-size:0.9rem}
.lab-header .alias{color:#54a0ff;font-family:monospace}
.lab-content{display:flex;gap:2rem;max-width:1000px;width:100%}
.preview-panel{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:1rem}
.controls-panel{flex:1;min-width:0}
.section{background:#16213e;border:1px solid #0f3460;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.section h3{font-size:0.9rem;color:#54a0ff;margin-bottom:0.75rem}
.pack-toggle{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.75rem;background:#0d0d1a;border:1px solid #333;border-radius:6px;margin-bottom:0.5rem;cursor:pointer;transition:border-color 0.2s}
.pack-toggle:hover{border-color:#54a0ff}
.pack-toggle.enabled{border-color:#00ff88;background:rgba(0,255,136,0.05)}
.pack-toggle .pack-name{color:#ccc;font-size:0.85rem}
.pack-toggle .pack-count{color:#666;font-size:0.75rem}
.pack-switch{width:40px;height:20px;background:#333;border-radius:10px;position:relative;transition:background 0.2s;flex-shrink:0}
.pack-switch.on{background:#00ff88}
.pack-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:white;border-radius:50%;transition:transform 0.2s}
.pack-switch.on::after{transform:translateX(20px)}
.effects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:0.5rem;margin-top:0.75rem}
.effect-btn{padding:0.5rem;background:#0d0d1a;border:1px solid #333;border-radius:6px;color:#ccc;font-size:0.8rem;cursor:pointer;transition:all 0.2s;text-align:center}
.effect-btn:hover{border-color:#54a0ff;color:#fff}
.effect-btn.active{border-color:#e94560;background:rgba(233,69,96,0.1);color:#e94560}
.shorthand-display{background:#0d0d1a;border:1px solid #333;border-radius:6px;padding:0.75rem;font-family:'JetBrains Mono',monospace;font-size:0.8rem;color:#00ff88;word-break:break-all;min-height:2.5rem}
.action-buttons{display:flex;gap:0.75rem;margin-top:1rem}
.action-btn{flex:1;padding:0.75rem 1rem;border:1px solid;border-radius:8px;font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s;text-align:center;user-select:none}
.action-btn.save{background:rgba(0,255,136,0.1);border-color:#00ff88;color:#00ff88}
.action-btn.save:hover{background:rgba(0,255,136,0.2);box-shadow:0 0 12px rgba(0,255,136,0.3)}
.action-btn.copy{background:rgba(84,160,255,0.1);border-color:#54a0ff;color:#54a0ff}
.action-btn.copy:hover{background:rgba(84,160,255,0.2);box-shadow:0 0 12px rgba(84,160,255,0.3)}
.action-btn.clear{background:rgba(233,69,96,0.1);border-color:#e94560;color:#e94560;flex:0.5}
.action-btn.clear:hover{background:rgba(233,69,96,0.2)}
.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);background:#16213e;border:1px solid #00ff88;color:#00ff88;padding:0.75rem 1.5rem;border-radius:8px;font-size:0.85rem;transition:transform 0.3s ease;z-index:999}
.toast.show{transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>
<div class="lab-header">
  <h1>Bifrost Card Effects Lab</h1>
  <div class="subtitle">Customizing badge for <span class="alias">@${alias}</span> &mdash; ${name.first} ${name.last}</div>
</div>
<div class="lab-content">
  <div class="preview-panel">
    <div style="width:200px;height:300px;background:#16213e;border:2px solid #0f3460;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
      <img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;" alt="${name.first}" onerror="this.style.display='none'"/>
    </div>
    <div style="color:#888;font-size:0.8rem;text-align:center;">Live preview coming soon</div>
  </div>
  <div class="controls-panel">
    <div class="section">
      <h3>Effect Packs</h3>
      <div id="packList"><div style="color:#666;font-size:0.85rem;">Loading packs...</div></div>
    </div>
    <div class="section">
      <h3>Available Effects</h3>
      <div id="effectsGrid" class="effects-grid">
        <div style="color:#666;font-size:0.85rem;grid-column:1/-1;">Enable a pack above to see effects</div>
      </div>
    </div>
    <div class="section">
      <h3>Current Shorthand</h3>
      <div class="shorthand-display" id="shorthandDisplay">${currentShorthand || 'No effects selected'}</div>
      <div class="action-buttons">
        <div class="action-btn save" id="btnSave">Apply Locally</div>
        <div class="action-btn copy" id="btnCopy">Copy for Slack</div>
        <div class="action-btn clear" id="btnClear">Clear</div>
      </div>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
const ALIAS = '${alias}';
const channel = new BroadcastChannel('${CONFIG.BROADCAST_CHANNEL}');
let currentShorthand = '${currentShorthand || ''}';

function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

document.getElementById('btnSave').addEventListener('click',()=>{
  channel.postMessage({type:'bifrost-save-local',alias:ALIAS,shorthand:currentShorthand});
  showToast('Saved locally! Effect applied on badge page.');
});

document.getElementById('btnCopy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(currentShorthand);
  }catch{const ta=document.createElement('textarea');ta.value=currentShorthand;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}
  showToast('Copied! Paste into the BifrostBadge Slack channel.');
});

document.getElementById('btnClear').addEventListener('click',()=>{
  currentShorthand='';
  document.getElementById('shorthandDisplay').textContent='No effects selected';
  channel.postMessage({type:'bifrost-clear-local',alias:ALIAS});
  showToast('Effects cleared.');
});
</script>
</body>
</html>`;
  }

  // ================================================================
  // BROADCAST CHANNEL LISTENER
  // ================================================================

  function setupBroadcastListener(alias) {
    const channel = new BroadcastChannel(CONFIG.BROADCAST_CHANNEL);
    channel.addEventListener('message', (event) => {
      const { type, alias: msgAlias, shorthand } = event.data;
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
    });
  }

  // ================================================================
  // BIFROST CARD RENDERING (Phase 2 — TODO)
  // ================================================================

  function applyBifrostFrame(alias, shorthand) {
    log('Applying frame:', shorthand, 'for', alias);
    // TODO Phase 2:
    // - Hide HyperBadge .Container or native .worker-badge
    // - Build Bifrost card DOM (layer-bottom/mid/top)
    // - Insert photo as art-image
    // - Insert name in text-zone
    // - Apply effects from shorthand via Bifrost engine
    // - Set up mousemove/leave for tilt + parallax
  }

  function removeBifrostFrame() {
    log('Removing frame');
    // TODO Phase 2:
    // - Remove injected Bifrost card
    // - Restore hidden HyperBadge or native badge
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

    // 3. Check blocklist
    const blocklist = await fetchJSON(CONFIG.BLOCKLIST_URL);
    if (Array.isArray(blocklist) && blocklist.includes(alias)) {
      log('Alias blocklisted — skipping');
      return;
    }

    // 4. Check database frames
    const userFrames = await fetchJSON(CONFIG.USER_FRAMES_URL);
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

  function start() { setTimeout(init, 1500); }

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start);
  }

})();
