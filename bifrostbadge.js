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

  async function openEffectsLab(alias, photoUrl, name, currentShorthand) {
    // Engine + pack source was pre-fetched by the loader via GM_xmlhttpRequest
    const bifrostData = window.__bifrostData || {};
    const engineCode = bifrostData.engineSource || '';
    const packCodes = bifrostData.packSources || [];

    const labHTML = generateLabHTML(alias, photoUrl, name, currentShorthand, engineCode, packCodes);
    const blob = new Blob([labHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  function generateLabHTML(alias, photoUrl, name, currentShorthand, engineCode, packCodes) {
    // Escape </script> in source code so it doesn't break the blob HTML
    const escape = (code) => code.replace(/<\/script>/gi, '<\\/script>');
    const inlineScripts = [engineCode, ...packCodes]
      .filter(Boolean)
      .map(code => '<script>' + escape(code) + '<\/script>')
      .join('\n');

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
.lab-content{display:flex;gap:2rem;max-width:1100px;width:100%}
.preview-panel{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:1rem;position:sticky;top:2rem;align-self:flex-start}
.controls-panel{flex:1;min-width:0}
.section{background:#16213e;border:1px solid #0f3460;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.section h3{font-size:0.9rem;color:#54a0ff;margin-bottom:0.75rem}

/* Preview card */
.preview-boundary{padding:15px;margin:-15px;position:relative}
.bf-badge{
  --rotateX:0deg;--rotateY:0deg;--glossX:50%;--glossY:50%;
  --parallax-x:0px;--parallax-y:0px;
  --frame-color:#16213e;--frame-accent:#0f3460;--border-color:#0f3460;--border-width:2px;
  --frame-padding:10px;--card-radius:12px;--art-margin:11px;--window-h:0px;--text-zone-h:52px;
  width:200px;position:relative;overflow:hidden;cursor:pointer;
  border-radius:var(--card-radius);border:var(--border-width) solid var(--border-color);
  background:var(--frame-color);
  transform:perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY));
  transition:border-color 0.2s ease,box-shadow 0.2s ease;
}
.bf-badge:hover{border-color:#54a0ff;box-shadow:0 8px 25px rgba(84,160,255,0.2),0 0 20px rgba(84,160,255,0.1)}
.bf-badge-sizer{width:calc(100% - var(--frame-padding)*2);aspect-ratio:3/4;margin:var(--frame-padding) auto 0;padding-bottom:var(--text-zone-h);visibility:hidden;pointer-events:none}
.bf-layer-bottom{position:absolute;inset:0;z-index:1;transform:translateX(calc(var(--parallax-x)*-1)) translateY(calc(var(--parallax-y)*-1))}
.bf-art-image{display:block;position:absolute;top:calc(var(--frame-padding) - var(--art-margin));left:calc(var(--frame-padding) - var(--art-margin));width:calc(100% - var(--frame-padding)*2 + var(--art-margin)*2);height:calc(var(--window-h) + var(--art-margin)*2);object-fit:cover;object-position:center top}
.bf-layer-mid{position:absolute;inset:0;overflow:hidden;z-index:2;pointer-events:none;transform:translateX(calc(var(--parallax-x)*-0.5)) translateY(calc(var(--parallax-y)*-0.5))}
.bf-layer-top{position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;z-index:3;pointer-events:none}
.bf-frame-surface{position:absolute;inset:0;border-radius:var(--card-radius);overflow:hidden;background:var(--frame-color);
  clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,var(--frame-padding) var(--frame-padding),var(--frame-padding) calc(var(--frame-padding) + var(--window-h)),calc(100% - var(--frame-padding)) calc(var(--frame-padding) + var(--window-h)),calc(100% - var(--frame-padding)) var(--frame-padding),var(--frame-padding) var(--frame-padding))}
.bf-art-window-border{position:absolute;top:var(--frame-padding);left:var(--frame-padding);right:var(--frame-padding);height:var(--window-h);border:1px solid var(--frame-accent);pointer-events:none;z-index:4}
.bf-gloss-overlay{position:absolute;inset:0;border-radius:var(--card-radius);pointer-events:none;z-index:5;opacity:0;transition:opacity 0.3s ease;background:radial-gradient(circle at var(--glossX) var(--glossY),rgba(255,255,255,0.2) 0%,rgba(255,255,255,0.08) 25%,transparent 50%)}
.bf-badge:hover .bf-gloss-overlay{opacity:1}
.bf-text-zone{position:absolute;bottom:0;left:0;right:0;padding:8px var(--frame-padding) var(--frame-padding);text-align:center;z-index:6}
.bf-badge-name{font-size:0.85rem;font-weight:600;color:#eee;line-height:1.2}
.bf-badge-alias{font-size:0.7rem;color:#888;margin-top:2px;font-family:monospace}

/* Controls */
.pack-toggle{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.75rem;background:#0d0d1a;border:1px solid #333;border-radius:6px;margin-bottom:0.5rem;cursor:pointer;transition:border-color 0.2s}
.pack-toggle:hover{border-color:#54a0ff}
.pack-toggle.enabled{border-color:#00ff88;background:rgba(0,255,136,0.05)}
.pack-info{display:flex;flex-direction:column;gap:0.1rem}
.pack-name{color:#ccc;font-size:0.85rem}
.pack-count{color:#666;font-size:0.7rem}
.pack-switch{width:40px;height:20px;background:#333;border-radius:10px;position:relative;transition:background 0.2s;flex-shrink:0}
.pack-switch.on{background:#00ff88}
.pack-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:white;border-radius:50%;transition:transform 0.2s}
.pack-switch.on::after{transform:translateX(20px)}
.pack-effects{margin-top:0.5rem;display:none}
.pack-effects.visible{display:block}
.effects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:0.4rem}
.effect-btn{padding:0.4rem 0.5rem;background:#0d0d1a;border:1px solid #333;border-radius:6px;color:#ccc;font-size:0.75rem;cursor:pointer;transition:all 0.2s;text-align:center;user-select:none}
.effect-btn:hover{border-color:#54a0ff;color:#fff}
.effect-btn.active{border-color:#e94560;background:rgba(233,69,96,0.1);color:#e94560}
.zone-select{display:flex;gap:0.3rem;margin-top:0.3rem;justify-content:center}
.zone-btn{padding:0.2rem 0.4rem;background:#0d0d1a;border:1px solid #333;border-radius:4px;color:#888;font-size:0.65rem;cursor:pointer;transition:all 0.2s}
.zone-btn:hover{border-color:#54a0ff;color:#ccc}
.zone-btn.active{border-color:#e94560;color:#e94560}
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
    <div class="preview-boundary" id="previewBoundary">
      <div class="bf-badge" id="previewCard">
        <div class="bf-badge-sizer"></div>
        <div class="bf-layer-bottom" id="layerBottom">
          <img class="bf-art-image" src="${photoUrl}" alt="${name.first}" onerror="this.style.display='none'"/>
        </div>
        <div class="bf-layer-mid" id="layerMid"></div>
        <div class="bf-layer-top" id="layerTop">
          <div class="bf-frame-surface"></div>
          <div class="bf-art-window-border"></div>
        </div>
        <div class="bf-gloss-overlay" id="glossOverlay"></div>
        <div class="bf-text-zone" id="textZone">
          <div class="bf-badge-name">${name.first} ${name.last}</div>
          <div class="bf-badge-alias">@${alias}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="controls-panel">
    <div class="section">
      <h3>Effect Packs</h3>
      <div id="packList"></div>
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

<!-- Bifrost engine + packs inlined -->
${inlineScripts}

<script>
const ALIAS = '${alias}';
const CHANNEL = '${CONFIG.BROADCAST_CHANNEL}';
const channel = new BroadcastChannel(CHANNEL);

// Active selections: Map of effectId -> zone
const selections = new Map();

// ---- Card preview setup ----
const card = document.getElementById('previewCard');
const boundary = document.getElementById('previewBoundary');
const tiltState = { x: 0, y: 0 };

// Compute window height
function computeWindowH() {
  const padding = 10;
  const winW = card.offsetWidth - padding * 2;
  const winH = winW * (4/3);
  card.style.setProperty('--window-h', winH + 'px');
}
computeWindowH();
new ResizeObserver(computeWindowH).observe(card);
setTimeout(computeWindowH, 100);

// Tilt
boundary.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = rect.width/2, cy = rect.height/2;
  const nx = (x-cx)/cx, ny = (y-cy)/cy;
  tiltState.x = nx; tiltState.y = ny;
  card.style.setProperty('--rotateX', (ny*-12)+'deg');
  card.style.setProperty('--rotateY', (nx*12)+'deg');
  card.style.setProperty('--glossX', (x/rect.width*100)+'%');
  card.style.setProperty('--glossY', (y/rect.height*100)+'%');
  card.style.setProperty('--parallax-x', (nx*8.5)+'px');
  card.style.setProperty('--parallax-y', (ny*8.5)+'px');
});
boundary.addEventListener('mouseleave', () => {
  tiltState.x = 0; tiltState.y = 0;
  card.style.setProperty('--rotateX','0deg');
  card.style.setProperty('--rotateY','0deg');
  card.style.setProperty('--glossX','50%');
  card.style.setProperty('--glossY','50%');
  card.style.setProperty('--parallax-x','0px');
  card.style.setProperty('--parallax-y','0px');
});

// Init Bifrost engine with preview card
if (window.Bifrost) {
  Bifrost.init(card, {
    top: document.getElementById('layerTop'),
    mid: document.getElementById('layerMid'),
    bot: document.getElementById('layerBottom'),
    text: document.getElementById('textZone')
  }, tiltState, null);
}

// ---- Build pack UI ----
function buildPackUI() {
  const packList = document.getElementById('packList');
  packList.innerHTML = '';

  if (!window.Bifrost || Object.keys(Bifrost.packs).length === 0) {
    packList.innerHTML = '<div style="color:#666;font-size:0.85rem;">No packs loaded</div>';
    return;
  }

  for (const [packId, pack] of Object.entries(Bifrost.packs)) {
    const effectIds = Object.keys(pack.effects || {});
    const asciiIds = Object.keys(pack.ascii || {});

    const wrapper = document.createElement('div');

    // Toggle header
    const toggle = document.createElement('div');
    toggle.className = 'pack-toggle';
    toggle.innerHTML = '<div class="pack-info"><div class="pack-name">'
      + (pack.icon||'') + ' ' + pack.name
      + '</div><div class="pack-count">' + (effectIds.length + asciiIds.length) + ' effects</div></div>'
      + '<div class="pack-switch" id="switch-'+packId+'"></div>';

    // Effects container
    const effectsDiv = document.createElement('div');
    effectsDiv.className = 'pack-effects';
    effectsDiv.id = 'effects-' + packId;

    const grid = document.createElement('div');
    grid.className = 'effects-grid';

    // Regular effects
    for (const fxId of effectIds) {
      const fx = pack.effects[fxId];
      const zones = fx.zones || ['mid'];
      const btn = document.createElement('div');
      btn.className = 'effect-btn';
      btn.dataset.fxId = fxId;
      btn.dataset.zones = JSON.stringify(zones);
      btn.textContent = fx.name || fxId;
      btn.addEventListener('click', () => toggleEffect(fxId, zones, btn));
      grid.appendChild(btn);
    }

    // ASCII effects
    for (const [animId, anim] of Object.entries(pack.ascii || {})) {
      const btn = document.createElement('div');
      btn.className = 'effect-btn';
      btn.dataset.asciiId = animId;
      btn.textContent = (anim.icon||'') + ' ' + (anim.label||animId);
      btn.addEventListener('click', () => toggleAscii(animId, btn));
      grid.appendChild(btn);
    }

    effectsDiv.appendChild(grid);

    // Toggle click
    toggle.addEventListener('click', () => {
      const sw = document.getElementById('switch-'+packId);
      const ef = document.getElementById('effects-'+packId);
      const isOn = sw.classList.toggle('on');
      toggle.classList.toggle('enabled', isOn);
      ef.classList.toggle('visible', isOn);
    });

    wrapper.appendChild(toggle);
    wrapper.appendChild(effectsDiv);
    packList.appendChild(wrapper);
  }
}

// ---- Effect toggling ----
function toggleEffect(fxId, zones, btn) {
  if (selections.has(fxId)) {
    // Deactivate
    const zone = selections.get(fxId);
    if (Bifrost) Bifrost.deactivate(fxId, zone);
    selections.delete(fxId);
    btn.classList.remove('active');
  } else {
    // Activate on first available zone
    const zone = zones[0];
    if (Bifrost) Bifrost.activate(fxId, zone);
    selections.set(fxId, zone);
    btn.classList.add('active');
  }
  updateShorthand();
}

function toggleAscii(animId, btn) {
  const key = 'ascii:' + animId;
  if (selections.has(key)) {
    if (Bifrost) Bifrost.stopAscii();
    selections.delete(key);
    btn.classList.remove('active');
  } else {
    if (Bifrost) Bifrost.playAscii(animId, 'mid', 50, 50, '#00ff88');
    selections.set(key, 'mid');
    btn.classList.add('active');
  }
  updateShorthand();
}

function updateShorthand() {
  const parts = [];
  for (const [id, zone] of selections) {
    if (id.startsWith('ascii:')) {
      parts.push(id + '.' + zone);
    } else {
      parts.push(id + '.' + zone);
    }
  }
  currentShorthand = parts.join(',');
  document.getElementById('shorthandDisplay').textContent = currentShorthand || 'No effects selected';
}

let currentShorthand = '${currentShorthand || ''}';

// ---- Apply existing shorthand ----
if (currentShorthand && Bifrost) {
  Bifrost.applyShorthand(currentShorthand);
  // TODO: sync button states with applied shorthand
}

// ---- Toast ----
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// ---- Actions ----
document.getElementById('btnSave').addEventListener('click',()=>{
  channel.postMessage({type:'bifrost-save-local',alias:ALIAS,shorthand:currentShorthand});
  showToast('Saved locally! Effect applied on badge page.');
});

document.getElementById('btnCopy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('fx:'+currentShorthand);
  }catch{const ta=document.createElement('textarea');ta.value='fx:'+currentShorthand;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}
  showToast('Copied shorthand to clipboard.');
});

document.getElementById('btnClear').addEventListener('click',()=>{
  currentShorthand='';
  selections.clear();
  if (Bifrost) Bifrost.deactivateAll();
  document.querySelectorAll('.effect-btn.active').forEach(b=>b.classList.remove('active'));
  document.getElementById('shorthandDisplay').textContent='No effects selected';
  channel.postMessage({type:'bifrost-clear-local',alias:ALIAS});
  showToast('Effects cleared.');
});

// Build UI once DOM is ready
buildPackUI();
<\/script>
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

    // Build card DOM
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

    // Set up tilt/parallax
    const tiltState = setupTilt(card);

    // Compute window height after card is in DOM
    computeWindowH(card);

    // Initialize Bifrost engine with the card's layers
    if (window.Bifrost) {
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
      log('Bifrost engine not loaded — card rendered without effects');
    }

    log('Card injected');
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
      <div class="bf-badge">
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
      const winW = card.offsetWidth - padding * 2;
      const winH = winW * (4 / 3); // 3:4 ratio
      card.style.setProperty('--window-h', `${winH}px`);
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

  function start() { setTimeout(init, 1500); }

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start);
  }

})();
