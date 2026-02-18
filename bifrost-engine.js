/**
 * BIFROST CORE ENGINE
 * Effect renderer, plugin registry, dynamic UI builder
 * No effects included — all effects come from theme packs
 */

window.Bifrost = (() => {
  // ============================================================
  // STATE
  // ============================================================
  const packs = {};
  const effects = {};       // flat lookup: { effectId: { pack, def } }
  const active = {};         // { 'effectId-zone': { ctx, packId, effectId, zone } }
  const activeText = new Set();
  let asciiState = null;
  let card, layers, tiltState, uiPanel;
  let parallaxEnabled = true, parallaxStrength = 8;

  // ============================================================
  // REGISTRATION
  // ============================================================
  function registerPack(packDef) {
    packs[packDef.id] = packDef;
    for (const [fxId, fxDef] of Object.entries(packDef.effects || {})) {
      // If no pack already owns this name, allow short form
      const globalId = fxId;
      if (effects[globalId] && effects[globalId].pack.id !== packDef.id) {
        // Conflict — store under full path only
        effects[`${packDef.id}.${fxId}`] = { pack: packDef, def: fxDef };
      } else {
        effects[globalId] = { pack: packDef, def: fxDef };
      }
      // Always store full path
      effects[`${packDef.id}.${fxId}`] = { pack: packDef, def: fxDef };
    }
    console.log(`[Bifrost] Registered pack: ${packDef.icon || '📦'} ${packDef.name} (${Object.keys(packDef.effects || {}).length} effects)`);
    if (uiPanel) rebuildUI();
  }

  // ============================================================
  // EFFECT LIFECYCLE
  // ============================================================
  function activate(effectId, zone) {
    const key = `${effectId}-${zone}`;
    if (active[key]) return;

    const entry = effects[effectId];
    if (!entry) { console.warn(`[Bifrost] Unknown effect: ${effectId}`); return; }
    const { pack, def } = entry;
    console.log(`[Bifrost] Activating ${effectId}.${zone} (type: ${def.type || 'standard'}, hasInit: ${!!def.init}, hasCss: ${!!def.css})`);

    // Lazy CSS injection
    if (!def._cssInjected && def.css) {
      const style = document.createElement('style');
      style.textContent = def.css;
      style.dataset.bfPack = pack.id;
      style.dataset.bfEffect = effectId;
      document.head.appendChild(style);
      def._cssInjected = true;
    }

    // --- TEXT EFFECTS ---
    if (def.type === 'text' && def.textClass) {
      const tz = (layers && layers.text) || document.getElementById('textZone');
      if (tz) {
        tz.classList.add(def.textClass);
        const ctx = { container: null, card, zone: 'text', layer: tz, tiltState, interval: null, data: { _textClass: def.textClass } };
        if (def.init) def.init(ctx);
        active[key] = { ctx, packId: pack.id, effectId, zone: 'text' };
      }
      return;
    }

    // --- BORDER EFFECTS ---
    if (def.type === 'border' || zone === 'border') {
      const ctx = { container: null, card, zone: 'border', layer: card, tiltState, interval: null, data: {} };
      if (def.className) {
        card.classList.add(def.className);
        ctx.data._className = def.className;
      }
      if (def.init) def.init(ctx);
      active[key] = { ctx, packId: pack.id, effectId, zone: 'border' };
      if (pack.onEffectChange) pack.onEffectChange(getPackActive(pack.id), active);
      return;
    }

    // --- STANDARD EFFECTS ---
    const layer = getLayer(zone);
    const container = document.createElement('div');
    container.className = `bf-fx-container bf-${effectId.replace(/\./g, '-')}-${zone}`;
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit;';
    const zi = { top: '6', mid: '3', bot: '1' }[zone] || '3';
    container.style.zIndex = zi;
    layer.appendChild(container);

    // Build context
    const ctx = {
      container,
      card,
      zone,
      layer,
      tiltState,
      interval: null,
      data: {},
      el(tag, className) {
        const e = document.createElement(tag);
        if (className) e.className = className;
        container.appendChild(e);
        return e;
      }
    };

    if (def.init) {
      def.init(ctx);
    } else if (def.className) {
      card.classList.add(def.className);
      ctx.data._className = def.className;
    }
    active[key] = { ctx, packId: pack.id, effectId, zone };

    if (pack.onEffectChange) {
      pack.onEffectChange(getPackActive(pack.id), active);
    }
  }

  function deactivate(effectId, zone) {
    const key = `${effectId}-${zone}`;
    const entry = active[key];
    if (!entry) return;

    const { ctx, packId } = entry;
    const e = effects[effectId];

    // Text effect cleanup
    if (ctx.data && ctx.data._textClass) {
      const tz = (layers && layers.text) || document.getElementById('textZone');
      if (tz) tz.classList.remove(ctx.data._textClass);
    }

    // Border className cleanup
    if (ctx.data && ctx.data._className) {
      card.classList.remove(ctx.data._className);
    }

    // Standard cleanup
    if (e && e.def.cleanup) e.def.cleanup(ctx);

    if (ctx.interval) clearInterval(ctx.interval);
    if (ctx.animFrame) cancelAnimationFrame(ctx.animFrame);
    if (ctx.container) ctx.container.remove();
    delete active[key];

    if (ctx._appliedClass) {
      const target = zone === 'border' || zone === 'card' ? card : getLayer(zone);
      target.classList.remove(ctx._appliedClass);
    }

    const pack = packs[packId];
    if (pack && pack.onEffectChange) {
      pack.onEffectChange(getPackActive(packId), active);
    }
  }

  function toggle(effectId, zone) {
    const key = `${effectId}-${zone}`;
    if (active[key]) {
      deactivate(effectId, zone);
      return false;
    } else {
      activate(effectId, zone);
      return true;
    }
  }

  function deactivateAll() {
    for (const key of Object.keys(active)) {
      const { effectId, zone } = active[key];
      deactivate(effectId, zone);
    }
    // Clear text effects
    const tz = (layers && layers.text) || document.getElementById('textZone');
    if (tz) {
      for (const cls of activeText) tz.classList.remove(cls);
      activeText.clear();
    }
    // Clear ascii
    if (asciiState) {
      clearInterval(asciiState.iv);
      asciiState.el.remove();
      asciiState = null;
    }
  }

  // ============================================================
  // TEXT EFFECTS
  // ============================================================
  function toggleText(cls) {
    const tz = (layers && layers.text) || document.getElementById('textZone');
    console.log(`[Bifrost] toggleText('${cls}'), textZone:`, tz, 'layers.text:', layers?.text);
    if (!tz) return;
    if (activeText.has(cls)) {
      tz.classList.remove(cls);
      activeText.delete(cls);
      return false;
    } else {
      // Find and inject CSS for this text effect if not already done
      for (const [fxId, entry] of Object.entries(effects)) {
        if (entry.def.textClass === cls && entry.def.css && !entry.def._cssInjected) {
          const style = document.createElement('style');
          style.textContent = entry.def.css;
          style.dataset.bfEffect = fxId;
          document.head.appendChild(style);
          entry.def._cssInjected = true;
          break;
        }
      }
      tz.classList.add(cls);
      activeText.add(cls);
      return true;
    }
  }

  // ============================================================
  // ASCII ANIMATIONS
  // ============================================================
  function playAscii(animName, zone, x, y, color) {
    // Find the animation across all packs
    let anim = null;
    for (const pack of Object.values(packs)) {
      if (pack.ascii && pack.ascii[animName]) {
        anim = pack.ascii[animName];
        break;
      }
    }
    if (!anim) { console.warn(`[Bifrost] ASCII animation not found: ${animName}`); return; }

    stopAscii();

    const layer = getLayer(zone);
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit;';
    container.style.zIndex = { top: '6', mid: '3', bot: '1' }[zone] || '3';
    layer.appendChild(container);

    const pre = document.createElement('pre');
    pre.style.cssText = `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);color:${color};font-size:10px;opacity:0.8;text-shadow:0 0 4px ${color};font-family:'JetBrains Mono','Courier New',monospace;white-space:pre;line-height:1.1;pointer-events:none;text-align:center;`;
    container.appendChild(pre);

    const maxW = Math.max(...anim.frames.map(f => f.length));
    const padded = anim.frames.map(f => f.padEnd(maxW));
    let idx = 0;
    pre.textContent = padded[0];

    const iv = setInterval(() => {
      idx = (idx + 1) % padded.length;
      pre.textContent = padded[idx];
    }, anim.speed);

    asciiState = { iv, el: container, pre, name: animName, zone, x, y, color };
  }

  function stopAscii() {
    if (asciiState) {
      clearInterval(asciiState.iv);
      asciiState.el.remove();
      asciiState = null;
    }
  }

  function updateAsciiPos(x, y) {
    if (asciiState && asciiState.pre) {
      asciiState.pre.style.left = `${x}%`;
      asciiState.pre.style.top = `${y}%`;
      asciiState.x = x;
      asciiState.y = y;
    }
  }

  // ============================================================
  // BORDER EFFECTS (class-based)
  // ============================================================
  function activateBorder(effectId, zone) {
    const key = `${effectId}-${zone}`;
    if (active[key]) return;

    const entry = effects[effectId];
    if (!entry) return;
    const { pack, def } = entry;

    // Inject CSS if needed
    if (!def._cssInjected && def.css) {
      const style = document.createElement('style');
      style.textContent = def.css;
      document.head.appendChild(style);
      def._cssInjected = true;
    }

    const ctx = { container: null, card, zone, layer: card, tiltState, interval: null, data: {} };

    if (def.className) {
      card.classList.add(def.className);
      ctx._appliedClass = def.className;
    }

    if (def.init) def.init(ctx);

    active[key] = { ctx, packId: pack.id, effectId, zone };
  }

  // ============================================================
  // SHORTHAND
  // ============================================================
  function buildShorthand() {
    const parts = ['tilt', 'parallax', 'gloss.top'];
    for (const key of Object.keys(active)) {
      const { effectId, zone } = active[key];
      parts.push(`${effectId}.${zone}`);
    }
    for (const cls of activeText) {
      parts.push(`${cls.replace('text-', '')}.text`);
    }
    if (asciiState) {
      const ac = asciiState.color.replace('#', '');
      parts.push(`ascii:${asciiState.name}.${asciiState.zone}@${asciiState.x}/${asciiState.y}/${ac}`);
    }
    return `fx:${parts.join(',')}`;
  }

  function applyShorthand(str) {
    deactivateAll();
    const raw = str.trim();
    const s = raw.startsWith('fx:') ? raw.slice(3) : raw;
    const tokens = s.split(',').map(t => t.trim()).filter(Boolean);
    console.log(`[Bifrost] Applying shorthand: ${tokens.length} tokens`, tokens);

    for (const token of tokens) {
      if (['tilt', 'parallax', 'gloss.top'].includes(token)) continue;

      // ASCII
      if (token.startsWith('ascii:')) {
        const asciiStr = token.slice(6);
        const atIdx = asciiStr.indexOf('@');
        let nameZone, x = 50, y = 50, color = '#00ff88';
        if (atIdx !== -1) {
          nameZone = asciiStr.slice(0, atIdx);
          const params = asciiStr.slice(atIdx + 1).split('/');
          if (params[0]) x = parseInt(params[0]);
          if (params[1]) y = parseInt(params[1]);
          if (params[2]) color = '#' + params[2];
        } else {
          nameZone = asciiStr;
        }
        const dotIdx = nameZone.lastIndexOf('.');
        const animName = nameZone.slice(0, dotIdx);
        const zone = nameZone.slice(dotIdx + 1);
        playAscii(animName, zone, x, y, color);
        continue;
      }

      // Text effects
      const dotIdx = token.lastIndexOf('.');
      if (dotIdx === -1) continue;
      const fxName = token.slice(0, dotIdx);
      const zone = token.slice(dotIdx + 1);

      if (zone === 'text') {
        toggleText(`text-${fxName}`);
        continue;
      }

      // Regular effects
      if (effects[fxName]) {
        const def = effects[fxName].def;
        if (def.type === 'border' || zone === 'border') {
          activateBorder(fxName, zone);
        } else {
          activate(fxName, zone);
        }
      }
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================
  function getLayer(zone) {
    if (layers) {
      return {
        top: layers.top,
        mid: layers.mid,
        bot: layers.bot,
        border: card,
        card: card
      }[zone] || card;
    }
    // Fallback to getElementById for standalone lab usage
    return {
      top: document.getElementById('layerTop'),
      mid: document.getElementById('layerMid'),
      bot: document.getElementById('layerBottom'),
      border: card,
      card: card
    }[zone] || card;
  }

  function getPackActive(packId) {
    const result = new Map();
    for (const [key, entry] of Object.entries(active)) {
      if (entry.packId === packId) {
        result.set(entry.effectId, entry);
      }
    }
    return result;
  }

  function getAllAsciiAnims() {
    const all = {};
    for (const pack of Object.values(packs)) {
      if (pack.ascii) {
        for (const [name, anim] of Object.entries(pack.ascii)) {
          all[name] = { ...anim, pack: pack.id, packName: pack.name };
        }
      }
    }
    return all;
  }

  // ============================================================
  // UI BUILDER
  // ============================================================
  function rebuildUI() {
    if (!uiPanel) return;

    // Clear existing effect sections (keep base controls)
    uiPanel.querySelectorAll('.bf-pack-section').forEach(el => el.remove());

    // Group effects by pack
    for (const [packId, pack] of Object.entries(packs)) {
      const section = document.createElement('div');
      section.className = 'control-section bf-pack-section';
      section.innerHTML = `<h3>${pack.icon || '📦'} ${pack.name}</h3>`;

      // Group by category
      const byCategory = {};
      for (const [fxId, fxDef] of Object.entries(pack.effects || {})) {
        const cat = fxDef.category || 'other';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push({ id: fxId, ...fxDef });
      }

      // Category order
      const catOrder = ['particle', 'overlay', 'distortion', 'light', 'environment', 'border', 'frame', 'text'];
      const sortedCats = Object.keys(byCategory).sort((a, b) => {
        const ai = catOrder.indexOf(a), bi = catOrder.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });

      for (const cat of sortedCats) {
        const fxList = byCategory[cat];
        const catLabel = document.createElement('div');
        catLabel.style.cssText = 'color:#666;font-size:0.65rem;text-transform:uppercase;letter-spacing:1px;margin:0.5rem 0 0.25rem;';
        catLabel.textContent = cat;
        section.appendChild(catLabel);

        const row = document.createElement('div');
        row.className = 'toggle-row';
        row.style.flexWrap = 'wrap';

        for (const fx of fxList) {
          if (fx.type === 'text') {
            // Text effect — single button
            const btn = document.createElement('button');
            btn.className = 'toggle-btn';
            btn.textContent = `${fx.icon || '✦'} ${fx.name}`;
            btn.onclick = () => {
              const isActive = toggleText(fx.textClass);
              btn.classList.toggle('active', isActive);
              updateShorthandUI();
            };
            row.appendChild(btn);
          } else if (fx.type === 'border') {
            // Border effect — single button
            const btn = document.createElement('button');
            btn.className = 'toggle-btn';
            btn.textContent = `${fx.icon || '✦'} ${fx.name}`;
            btn.onclick = () => {
              const key = `${fx.id}-border`;
              if (active[key]) {
                deactivate(fx.id, 'border');
                btn.classList.remove('active');
              } else {
                activateBorder(fx.id, 'border');
                btn.classList.add('active');
              }
              updateShorthandUI();
            };
            row.appendChild(btn);
          } else {
            // Standard effect — one button per zone
            for (const zone of (fx.zones || ['mid'])) {
              const btn = document.createElement('button');
              btn.className = 'toggle-btn';
              btn.textContent = `${fx.icon || '✦'} ${fx.name}.${zone}`;
              btn.onclick = () => {
                const isActive = toggle(fx.id, zone);
                btn.classList.toggle('active', isActive);
                updateShorthandUI();
              };
              row.appendChild(btn);
            }
          }
        }
        section.appendChild(row);
      }

      // Presets
      if (pack.presets) {
        const presetLabel = document.createElement('div');
        presetLabel.style.cssText = 'color:#666;font-size:0.65rem;text-transform:uppercase;letter-spacing:1px;margin:0.5rem 0 0.25rem;';
        presetLabel.textContent = 'presets';
        section.appendChild(presetLabel);
        const presetRow = document.createElement('div');
        presetRow.className = 'toggle-row';
        presetRow.style.flexWrap = 'wrap';
        for (const [name, fxList] of Object.entries(pack.presets)) {
          const btn = document.createElement('button');
          btn.className = 'toggle-btn';
          btn.style.cssText = 'border-color:#f59e0b;color:#f59e0b;';
          btn.textContent = `⚡ ${name}`;
          btn.onclick = () => {
            deactivateAll();
            for (const fxStr of fxList) {
              const dotIdx = fxStr.lastIndexOf('.');
              const fxId = fxStr.slice(0, dotIdx);
              const zone = fxStr.slice(dotIdx + 1);
              if (zone === 'text') toggleText(`text-${fxId}`);
              else if (zone === 'border') activateBorder(fxId, 'border');
              else activate(fxId, zone);
            }
            // Update all button states
            uiPanel.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            for (const key of Object.keys(active)) {
              const { effectId, zone } = active[key];
              // Find matching button
              uiPanel.querySelectorAll('.toggle-btn').forEach(b => {
                if (b.textContent.includes(`${effectId}.${zone}`) || b.textContent.includes(effects[effectId]?.def?.name + '.' + zone)) {
                  b.classList.add('active');
                }
              });
            }
            updateShorthandUI();
          };
          presetRow.appendChild(btn);
        }
        section.appendChild(presetRow);
      }

      uiPanel.appendChild(section);
    }

    // ASCII section (if any pack has ascii animations)
    const allAscii = getAllAsciiAnims();
    if (Object.keys(allAscii).length > 0) {
      buildAsciiUI(allAscii);
    }
  }

  function buildAsciiUI(allAscii) {
    const section = document.createElement('div');
    section.className = 'control-section bf-pack-section';
    section.innerHTML = '<h3>🎮 ASCII Animations</h3>';

    // Select
    const row1 = document.createElement('div');
    row1.className = 'toggle-row';
    row1.style.flexWrap = 'wrap';
    const sel = document.createElement('select');
    sel.id = 'asciiSelect';
    sel.style.cssText = "flex:1;background:#0d0d1a;color:#00ff88;border:1px solid #333;border-radius:6px;padding:0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.75rem;";
    sel.innerHTML = '<option value="">— select animation —</option>';
    // Group by pack
    const byPack = {};
    for (const [name, anim] of Object.entries(allAscii)) {
      const p = anim.packName || 'Unknown';
      if (!byPack[p]) byPack[p] = [];
      byPack[p].push({ name, ...anim });
    }
    for (const [packName, anims] of Object.entries(byPack)) {
      const group = document.createElement('optgroup');
      group.label = packName;
      for (const a of anims) {
        const opt = document.createElement('option');
        opt.value = a.name;
        opt.textContent = `${a.icon || '▸'} ${a.label || a.name}`;
        group.appendChild(opt);
      }
      sel.appendChild(group);
    }
    row1.appendChild(sel);

    const playBtn = document.createElement('button');
    playBtn.className = 'toggle-btn';
    playBtn.style.marginLeft = '0.5rem';
    playBtn.textContent = '▶ Play';
    playBtn.onclick = () => {
      if (asciiState) {
        stopAscii();
        playBtn.textContent = '▶ Play';
        playBtn.classList.remove('active');
      } else {
        const name = sel.value;
        if (!name) return;
        const zone = document.getElementById('asciiZone').value;
        const color = document.getElementById('asciiColor').value;
        const x = parseInt(document.getElementById('asciiX').value);
        const y = parseInt(document.getElementById('asciiY').value);
        playAscii(name, zone, x, y, color);
        playBtn.textContent = '⏹ Stop';
        playBtn.classList.add('active');
      }
      updateShorthandUI();
    };
    row1.appendChild(playBtn);
    section.appendChild(row1);

    // Zone + color row
    const row2 = document.createElement('div');
    row2.className = 'toggle-row';
    row2.style.cssText = 'flex-wrap:wrap;margin-top:0.4rem;';
    row2.innerHTML = `
      <label style="color:#888;font-size:0.7rem;margin-right:0.5rem;">Zone:</label>
      <select id="asciiZone" style="background:#0d0d1a;color:#aaa;border:1px solid #333;border-radius:4px;padding:0.3rem;font-size:0.7rem;">
        <option value="mid">Mid</option><option value="top">Top</option><option value="bot">Bottom</option>
      </select>
      <label style="color:#888;font-size:0.7rem;margin-left:0.8rem;margin-right:0.5rem;">Color:</label>
      <select id="asciiColor" style="background:#0d0d1a;color:#aaa;border:1px solid #333;border-radius:4px;padding:0.3rem;font-size:0.7rem;">
        <option value="#00ff88">Green</option><option value="#00ffff">Cyan</option><option value="#ff00ff">Magenta</option>
        <option value="#ffaa00">Amber</option><option value="#ff4444">Red</option><option value="#ffffff">White</option>
      </select>`;
    section.appendChild(row2);

    // X/Y sliders
    const makeSlider = (id, label) => {
      const div = document.createElement('div');
      div.style.marginTop = '0.3rem';
      div.innerHTML = `<label style="color:#888;font-size:0.7rem;">${label}: <span id="${id}Val">50</span>%</label>
        <input type="range" id="${id}" min="0" max="100" value="50" style="width:100%;accent-color:#00ff88;">`;
      div.querySelector('input').oninput = function () {
        document.getElementById(`${id}Val`).textContent = this.value;
        const xv = parseInt(document.getElementById('asciiX').value);
        const yv = parseInt(document.getElementById('asciiY').value);
        updateAsciiPos(xv, yv);
      };
      return div;
    };
    section.appendChild(makeSlider('asciiX', 'X'));
    section.appendChild(makeSlider('asciiY', 'Y'));

    uiPanel.appendChild(section);
  }

  function updateShorthandUI() {
    const el = document.getElementById('liveShorthand');
    if (el) el.value = buildShorthand();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init(cardEl, layerEls, tilt, panelEl) {
    card = cardEl;
    layers = layerEls;
    tiltState = tilt;
    uiPanel = panelEl || null;
    if (uiPanel) rebuildUI();
    console.log(`[Bifrost] Engine initialized. ${Object.keys(packs).length} packs, ${Object.keys(effects).length} effects.`);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  return {
    registerPack,
    init,
    activate,
    deactivate,
    toggle,
    deactivateAll,
    toggleText,
    playAscii,
    stopAscii,
    updateAsciiPos,
    activateBorder,
    buildShorthand,
    applyShorthand,
    rebuildUI,
    // Expose state for debugging
    get packs() { return packs; },
    get effects() { return effects; },
    get active() { return active; },
    get activeText() { return activeText; },
    get asciiState() { return asciiState; },
    get card() { return card; },
    getLayer,
    getAllAsciiAnims,
    updateShorthandUI
  };
})();
