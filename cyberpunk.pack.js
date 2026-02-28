/**
 * BIFROST THEME PACK: CYBERPUNK
 * Neon-soaked digital dystopia — glitch, matrix, grid, scanlines, neon borders
 */
Bifrost.registerPack({
  id: 'cyberpunk',
  name: 'Cyberpunk',
  version: '1.0.0',
  icon: '🌆',
  description: 'Digital neon dystopia',

  effects: {

    // ─── PARTICLES ───────────────────────────────────────
    matrix: {
      name: 'Matrix Rain',
      category: 'particle',
      zones: ['top', 'mid', 'bot'],
      icon: '💻',
      css: `
        .bf-matrix-char {
          position: absolute; font-family: 'JetBrains Mono', monospace;
          font-size: 10px; pointer-events: none;
          animation: bfMatrixFall linear forwards;
        }
        @keyframes bfMatrixFall {
          0%   { opacity: 1; transform: translateY(-20px); }
          80%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(500px); }
        }
      `,
      init(ctx) {
        ctx.container.style.opacity = '0.4';
        const chars = 'アイウエオカキクケコ01ラリルレロ';
        ctx.interval = setInterval(() => {
          const e = document.createElement('span');
          e.className = 'bf-matrix-char';
          const dur = 2000 + Math.random() * 3000;
          e.textContent = chars[Math.floor(Math.random() * chars.length)];
          e.style.cssText = `left:${Math.random()*100}%;top:0;color:#00ff88;text-shadow:0 0 5px #00ff88;animation-duration:${dur}ms;`;
          ctx.container.appendChild(e);
          setTimeout(() => e.remove(), dur);
        }, 200);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    sparkle: {
      name: 'Sparkle',
      category: 'particle',
      zones: ['top', 'mid', 'bot'],
      icon: '✨',
      css: `
        .bf-sparkle {
          position: absolute; border-radius: 50%;
          pointer-events: none;
          animation: bfSparkleFade ease-in-out forwards;
        }
        @keyframes bfSparkleFade {
          0%   { opacity: 0; transform: scale(0); }
          30%  { opacity: 1; transform: scale(1); }
          70%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `,
      init(ctx) {
        ctx.interval = setInterval(() => {
          const s = document.createElement('div');
          s.className = 'bf-sparkle';
          const sz = 2 + Math.random() * 4;
          const dur = 600 + Math.random() * 800;
          s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:rgba(255,255,255,0.9);box-shadow:0 0 ${sz*2}px rgba(180,220,255,0.8);animation-duration:${dur}ms;`;
          ctx.container.appendChild(s);
          setTimeout(() => s.remove(), dur);
        }, 200);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    // ─── OVERLAYS ────────────────────────────────────────
    scanline: {
      name: 'Scanlines',
      category: 'overlay',
      zones: ['top', 'bot'],
      icon: '📺',
      css: `
        .bf-scanlines {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
          background: repeating-linear-gradient(
            to bottom, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
          );
          background-size: 100% 4px;
          animation: bfScanScroll 8s linear infinite;
        }
        @keyframes bfScanScroll { 0% { background-position: 0 0; } 100% { background-position: 0 100px; } }
      `,
      init(ctx) {
        const e = ctx.el('div', 'bf-scanlines');
      },
      cleanup(ctx) {}
    },

    grid: {
      name: 'Holo Grid',
      category: 'overlay',
      zones: ['top', 'bot'],
      icon: '🔳',
      css: `
        .bf-grid {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
        }
        .bf-grid.grid-top {
          background-image:
            linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,0,255,0.08) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: bfGridMove 12s linear infinite;
        }
        .bf-grid.grid-bot {
          background-image:
            linear-gradient(rgba(0,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,0,255,0.12) 1px, transparent 1px);
          background-size: 25px 25px;
          animation: bfGridMove 18s linear infinite;
        }
        @keyframes bfGridMove { 0% { background-position: 0 0; } 100% { background-position: 50px 50px; } }
      `,
      init(ctx) {
        const e = ctx.el('div', `bf-grid grid-${ctx.zone}`);
      },
      cleanup(ctx) {}
    },

    vignette: {
      name: 'Vignette',
      category: 'overlay',
      zones: ['top', 'bot'],
      icon: '🔲',
      css: `
        .bf-vignette {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%);
        }
      `,
      init(ctx) { ctx.el('div', 'bf-vignette'); },
      cleanup(ctx) {}
    },

    colorshift: {
      name: 'Color Shift',
      category: 'overlay',
      zones: ['bot'],
      icon: '🎨',
      css: `
        .bf-colorshift {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
          mix-blend-mode: hue;
          animation: bfColorShift 6s ease-in-out infinite;
        }
        @keyframes bfColorShift {
          0%,100% { filter: hue-rotate(0deg); background: rgba(255,0,255,0.05); }
          33% { filter: hue-rotate(120deg); background: rgba(0,255,255,0.08); }
          66% { filter: hue-rotate(240deg); background: rgba(255,255,0,0.06); }
        }
      `,
      init(ctx) { ctx.el('div', 'bf-colorshift'); },
      cleanup(ctx) {}
    },

    // ─── DISTORTION ──────────────────────────────────────
    glitch: {
      name: 'Glitch',
      category: 'distortion',
      zones: ['top', 'bot', 'card'],
      icon: '👾',
      css: `
        .bf-glitch-container {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
          overflow: hidden;
        }
        .bf-glitch-slice {
          position: absolute; left: 0; right: 0;
          overflow: hidden; pointer-events: none;
        }
      `,
      init(ctx) {
        if (ctx.zone === 'card') {
          // Full card glitch — chromatic shift + jitter on the whole card
          const card = ctx.card;
          const id = 'bfGlitchCard' + Date.now();
          const t1 = 80 + Math.random()*5, t2 = t1+1, t3 = t2+1.5, t4 = t3+1, t5 = t4+3, t6 = t5+1;
          const styleEl = document.createElement('style');
          styleEl.textContent = `
            @keyframes ${id} {
              0%,${t1}%,${t4}%,100% { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)); filter: none; }
              ${t1+0.3}% { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate(-4px,1px) skewX(-0.5deg); filter: hue-rotate(15deg) saturate(1.3); }
              ${t2}% { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate(5px,-1px) skewX(1deg); filter: hue-rotate(-20deg) saturate(1.5); }
              ${t3}% { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate(-2px,2px); filter: hue-rotate(10deg); }
              ${t5}% { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate(3px,-1px) skewX(-0.3deg); filter: hue-rotate(-10deg); }
              ${t6}% { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)); filter: none; }
            }
            .bf-glitch-card { animation: ${id} 5s ease-in-out infinite; }
          `;
          document.head.appendChild(styleEl);
          ctx.data.styleEl = styleEl;
          card.classList.add('bf-glitch-card');
        }
        else if (ctx.zone === 'top') {
          // Frame distortion — random interval slice shifts
          const c = ctx.container;
          c.style.background = 'var(--frame-color)';
          c.style.opacity = '0';
          ctx.interval = setInterval(() => {
            const sliceTop = Math.random() * 80;
            const sliceH = 3 + Math.random() * 15;
            const shiftX = (Math.random() - 0.5) * 12;
            c.style.clipPath = `inset(${sliceTop}% 0 ${100 - sliceTop - sliceH}% 0)`;
            c.style.transform = `translateX(${shiftX}px)`;
            c.style.opacity = '0.7';
            setTimeout(() => {
              c.style.opacity = '0';
              c.style.transform = 'none';
            }, 80 + Math.random() * 100);
          }, 2000 + Math.random() * 3000);
        }
        else if (ctx.zone === 'bot') {
          // VHS-style image tear — horizontal slices with color distortion
          const c = ctx.container;
          ctx.interval = setInterval(() => {
            const numSlices = 2 + Math.floor(Math.random() * 3);
            const slices = [];
            for (let i = 0; i < numSlices; i++) {
              const s = document.createElement('div');
              s.className = 'bf-glitch-slice';
              const top = Math.random() * 90;
              const height = 2 + Math.random() * 10;
              const shiftX = (Math.random() - 0.5) * 20;
              const hue = (Math.random() - 0.5) * 40;
              const col = Math.random() > 0.5 ? '255,0,0' : '0,100,255';
              s.style.cssText = `top:${top}%;height:${height}%;transform:translateX(${shiftX}px);background:rgba(${col},0.08);filter:hue-rotate(${hue}deg);`;
              c.appendChild(s);
              slices.push(s);
            }
            // Chromatic split overlay
            const chrom = document.createElement('div');
            chrom.style.cssText = 'position:absolute;inset:0;border-radius:inherit;mix-blend-mode:screen;opacity:0.15;background:linear-gradient(90deg,rgba(255,0,0,0.3),transparent 33%,transparent 66%,rgba(0,100,255,0.3));';
            c.appendChild(chrom);
            slices.push(chrom);
            setTimeout(() => slices.forEach(s => s.remove()), 100 + Math.random() * 150);
          }, 2500 + Math.random() * 3000);
        }
      },
      cleanup(ctx) {
        if (ctx.zone === 'card') {
          ctx.card.classList.remove('bf-glitch-card');
          ctx.data.styleEl?.remove();
        }
      }
    },

    glitchbar: {
      name: 'Glitch Bar',
      category: 'distortion',
      zones: ['top', 'bot'],
      icon: '⚡',
      css: `
        .bf-glitchbar {
          position: absolute; left: 0; width: 100%; height: 2px;
          pointer-events: none; border-radius: inherit;
          background: linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent);
          opacity: 0;
        }
        @keyframes bfGlitchBar {
          0%,90%,100% { opacity: 0; }
          1% { opacity: 0.8; }
          3% { opacity: 0; }
          5% { opacity: 0.6; }
        }
      `,
      init(ctx) {
        const c = ctx.container;
        for (let i = 0; i < 4; i++) {
          const bar = document.createElement('div');
          bar.className = 'bf-glitchbar';
          const y = 10 + Math.random() * 80;
          bar.style.cssText = `top:${y}%;animation:bfGlitchBar ${4+Math.random()*3}s ${Math.random()*3}s ease-in-out infinite;`;
          c.appendChild(bar);
        }
      },
      cleanup(ctx) {}
    },

    // ─── LIGHT ───────────────────────────────────────────
    searchlight: {
      name: 'Searchlight',
      category: 'light',
      zones: ['mid'],
      icon: '🔦',
      css: `
        .bf-searchlight-container {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
          overflow: hidden;
        }
        .bf-beam {
          position: absolute; bottom: 0;
          width: 200%; height: 200%;
          pointer-events: none;
        }
        .bf-beam.beam-left {
          left: -50%;
          transform-origin: 25% 100%;
          background: conic-gradient(from -15deg at 25% 100%,
            transparent 0deg, rgba(255,245,220,0.02) 3deg, rgba(255,245,220,0.08) 10deg,
            rgba(255,240,200,0.14) 18deg, rgba(255,245,220,0.08) 26deg,
            rgba(255,245,220,0.02) 33deg, transparent 36deg);
          animation: bfSearchSweepL 10s ease-in-out infinite;
        }
        .bf-beam.beam-right {
          right: -50%;
          transform-origin: 75% 100%;
          background: conic-gradient(from -18deg at 75% 100%,
            transparent 0deg, rgba(255,245,220,0.02) 3deg, rgba(255,245,220,0.08) 10deg,
            rgba(255,240,200,0.14) 18deg, rgba(255,245,220,0.08) 26deg,
            rgba(255,245,220,0.02) 33deg, transparent 36deg);
          animation: bfSearchSweepR 10s ease-in-out infinite;
        }
        @keyframes bfSearchSweepL {
          0%,100% { transform: rotate(-50deg); opacity: 0.6; }
          30% { transform: rotate(15deg); opacity: 1; }
          60% { transform: rotate(-25deg); opacity: 0.8; }
          80% { transform: rotate(30deg); opacity: 0.9; }
        }
        @keyframes bfSearchSweepR {
          0%,100% { transform: rotate(50deg); opacity: 0.6; }
          20% { transform: rotate(-20deg); opacity: 0.9; }
          50% { transform: rotate(25deg); opacity: 1; }
          75% { transform: rotate(-35deg); opacity: 0.8; }
        }
      `,
      init(ctx) {
        const c = ctx.el('div', 'bf-searchlight-container');
        const l = document.createElement('div');
        l.className = 'bf-beam beam-left';
        c.appendChild(l);
        const r = document.createElement('div');
        r.className = 'bf-beam beam-right';
        c.appendChild(r);
        // Move container up to the searchlight container we just created
        ctx.container.style.overflow = 'visible';
      },
      cleanup(ctx) {}
    },

    // ─── FRAME ───────────────────────────────────────────
    corners: {
      name: 'HUD Brackets',
      category: 'frame',
      zones: ['top'],
      icon: '⌐',
      css: `
        .bf-corners-container {
          position: absolute; inset: 0;
          pointer-events: none; border-radius: inherit;
        }
        .bf-corner {
          position: absolute;
          width: 18px; height: 18px;
          border: 2px solid #00ffff;
          pointer-events: none;
          animation: bfCornerPulse 3s ease-in-out infinite;
        }
        .bf-corner:nth-child(1) { top: 8px; left: 8px; border-right:none; border-bottom:none; animation-delay: 0s; }
        .bf-corner:nth-child(2) { top: 8px; right: 8px; border-left:none; border-bottom:none; animation-delay: 0.5s; }
        .bf-corner:nth-child(3) { top: calc(var(--frame-padding) + var(--window-h) - 14px); left: 8px; border-right:none; border-top:none; animation-delay: 1s; }
        .bf-corner:nth-child(4) { top: calc(var(--frame-padding) + var(--window-h) - 14px); right: 8px; border-left:none; border-top:none; animation-delay: 1.5s; }
        @keyframes bfCornerPulse {
          0%,80%,100% { opacity: 0.3; box-shadow: none; }
          40% { opacity: 1; box-shadow: 0 0 12px #00ffff; }
        }
      `,
      init(ctx) {
        const c = ctx.el('div', 'bf-corners-container');
        for (let i = 0; i < 4; i++) {
          const corner = document.createElement('div');
          corner.className = 'bf-corner';
          c.appendChild(corner);
        }
      },
      cleanup(ctx) {}
    },

    // ─── BORDER ──────────────────────────────────────────
    neon: {
      name: 'Neon',
      category: 'border',
      type: 'border',
      zones: ['border'],
      icon: '💜',
      className: 'has-neon',
      css: `
        .has-neon {
          border-color: rgba(var(--neon-color, 255,0,255), 0.8) !important;
          animation: bfNeonFlicker 4s ease-in-out infinite;
        }
        @keyframes bfNeonFlicker {
          0%,100% { box-shadow: 0 0 5px rgba(var(--neon-color,255,0,255),0.5), 0 0 15px rgba(var(--neon-color,255,0,255),0.3), 0 0 30px rgba(var(--neon-color,255,0,255),0.15); }
          50% { box-shadow: 0 0 8px rgba(var(--neon-color,255,0,255),0.7), 0 0 25px rgba(var(--neon-color,255,0,255),0.4), 0 0 50px rgba(var(--neon-color,255,0,255),0.2); }
          70% { box-shadow: 0 0 3px rgba(var(--neon-color,255,0,255),0.3), 0 0 10px rgba(var(--neon-color,255,0,255),0.15); }
        }
      `,
      init(ctx) {},
      cleanup(ctx) {}
    },

    pulse: {
      name: 'Pulse',
      category: 'border',
      type: 'border',
      zones: ['border'],
      icon: '💗',
      className: 'has-pulse',
      css: `
        .has-pulse { animation: bfBorderPulse 2s ease-in-out infinite; }
        @keyframes bfBorderPulse {
          0%,100% { box-shadow: 0 0 5px rgba(var(--neon-color,255,0,255),0.3); }
          50% { box-shadow: 0 0 15px rgba(var(--neon-color,255,0,255),0.6), 0 0 30px rgba(var(--neon-color,255,0,255),0.3); }
        }
      `,
      init(ctx) {},
      cleanup(ctx) {}
    },

    electric: {
      name: 'Electric',
      category: 'border',
      type: 'border',
      zones: ['border'],
      icon: '⚡',
      className: 'has-electric',
      css: `
        .has-electric { position: relative; }
        .has-electric::before { content: ''; position: absolute; inset: -2px; border-radius: inherit; pointer-events: none; z-index: 5; opacity: 0; }
      `,
      init(ctx) {
        const card = ctx.card;
        const cardRect = card.getBoundingClientRect();
        const w = cardRect.width, h = cardRect.height;
        const perimeter = 2 * (w + h);
        let progress = 0;
        const spark = document.createElement('div');
        spark.style.cssText = 'position:absolute;width:6px;height:6px;border-radius:50%;background:rgba(180,240,255,1);box-shadow:0 0 8px 3px rgba(100,200,255,0.9),0 0 20px 6px rgba(100,200,255,0.4);pointer-events:none;z-index:6;';
        card.appendChild(spark);
        ctx.data.spark = spark;
        ctx.interval = setInterval(() => {
          progress = (progress + perimeter * 0.012) % perimeter;
          let x, y;
          if (progress < w) { x = progress; y = 0; }
          else if (progress < w + h) { x = w; y = progress - w; }
          else if (progress < 2 * w + h) { x = w - (progress - w - h); y = h; }
          else { x = 0; y = h - (progress - 2 * w - h); }
          spark.style.left = `${x - 3}px`;
          spark.style.top = `${y - 3}px`;
        }, 16);
      },
      cleanup(ctx) {
        clearInterval(ctx.interval);
        ctx.data.spark?.remove();
      }
    },

    'gradient-border': {
      name: 'Gradient',
      category: 'border',
      type: 'border',
      zones: ['border'],
      icon: '🌈',
      className: 'has-gradient-border',
      css: `
        .has-gradient-border { position: relative; }
        .has-gradient-border::before {
          content: ''; position: absolute; inset: 0;
          border-radius: inherit; pointer-events: none; z-index: 5;
          padding: 2px;
          background: linear-gradient(var(--gb-angle, 0deg), #e94560, #00ff88, #54a0ff, #ff9ff3, #e94560);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude; -webkit-mask-composite: xor;
          animation: bfGradientSpin 4s linear infinite;
        }
        @property --gb-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes bfGradientSpin { 0% { --gb-angle: 0deg; } 100% { --gb-angle: 360deg; } }
      `,
      init(ctx) {},
      cleanup(ctx) {}
    },

    glow: {
      name: 'Glow',
      category: 'border',
      type: 'border',
      zones: ['border'],
      icon: '✨',
      className: 'has-glow',
      css: `
        .has-glow {
          box-shadow: 0 0 10px rgba(var(--neon-color,255,0,255),0.4),
                      0 0 20px rgba(var(--neon-color,255,0,255),0.2),
                      inset 0 0 10px rgba(var(--neon-color,255,0,255),0.1);
        }
      `,
      init(ctx) {},
      cleanup(ctx) {}
    },

    // ─── TEXT ─────────────────────────────────────────────
    'text-glow': {
      name: 'Glow',
      category: 'text',
      type: 'text',
      textClass: 'text-glow',
      icon: '💚',
      css: `
        .text-glow .game-title, .text-glow .bf-badge-name {
          text-shadow: 0 0 8px rgba(var(--text-glow-color, 0,255,136), 0.8),
                       0 0 20px rgba(var(--text-glow-color, 0,255,136), 0.4);
        }
        .text-glow .platform-tag, .text-glow .bf-badge-alias {
          text-shadow: 0 0 6px rgba(var(--text-glow-color, 0,255,136), 0.5);
        }
      `,
    },
    'text-glitch': {
      name: 'Glitch',
      category: 'text',
      type: 'text',
      textClass: 'text-glitch',
      icon: '👾',
      css: `
        .text-glitch .game-title, .text-glitch .bf-badge-name { animation: bfTextGlitch 3s ease-in-out infinite; }
        @keyframes bfTextGlitch {
          0%,91%,100% { transform: none; text-shadow: none; }
          92% { transform: translate(-2px, 1px) skewX(-2deg); text-shadow: 2px 0 #e94560, -2px 0 #54a0ff; }
          93% { transform: translate(2px, -1px) skewX(1deg); text-shadow: -2px 0 #e94560, 2px 0 #54a0ff; }
          94% { transform: translate(-1px, 2px); text-shadow: 1px 0 #00ff88, -1px 0 #e94560; }
          95% { transform: none; text-shadow: none; }
          96% { transform: translate(1px, -1px) skewX(-1deg); text-shadow: -2px 0 #00ff88, 2px 0 #e94560; }
          97% { transform: none; text-shadow: none; }
        }
      `,
    },
    'text-neon': {
      name: 'Neon',
      category: 'text',
      type: 'text',
      textClass: 'text-neon',
      icon: '💜',
      css: `
        .text-neon .game-title, .text-neon .bf-badge-name {
          color: rgba(var(--text-neon-color, 255,0,255), 1) !important;
          text-shadow: 0 0 5px rgba(var(--text-neon-color,255,0,255),0.8),
                       0 0 15px rgba(var(--text-neon-color,255,0,255),0.4),
                       0 0 30px rgba(var(--text-neon-color,255,0,255),0.2);
          animation: bfTextNeonPulse 3s ease-in-out infinite;
        }
        @keyframes bfTextNeonPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.85; } 52% { opacity: 0.4; } 54% { opacity: 1; }
        }
      `,
    },
    'text-chromatic': {
      name: 'Chromatic',
      category: 'text',
      type: 'text',
      textClass: 'text-chromatic',
      icon: '🔴🔵',
      css: `.text-chromatic .game-title, .text-chromatic .bf-badge-name { text-shadow: -1.5px 0 rgba(255,0,0,0.6), 1.5px 0 rgba(0,100,255,0.6); }`,
    },
    'text-flicker': {
      name: 'Flicker',
      category: 'text',
      type: 'text',
      textClass: 'text-flicker',
      icon: '💡',
      css: `
        .text-flicker .game-title, .text-flicker .bf-badge-name { animation: bfTextFlicker 4s linear infinite; }
        @keyframes bfTextFlicker {
          0%,100% { opacity: 1; } 41% { opacity: 1; } 42% { opacity: 0.6; }
          43% { opacity: 1; } 44% { opacity: 0.2; } 45% { opacity: 1; }
          76% { opacity: 1; } 77% { opacity: 0.4; } 78% { opacity: 1; }
        }
      `,
    },
    'text-typewriter': {
      name: 'Typewriter',
      category: 'text',
      type: 'text',
      textClass: 'text-typewriter',
      icon: '⌨️',
      css: `
        .text-typewriter .game-title, .text-typewriter .bf-badge-name {
          overflow: hidden; white-space: nowrap;
          border-right: 2px solid rgba(var(--text-glow-color, 0,255,136), 0.8);
          animation: bfTypewriter 4s steps(20) infinite, bfBlink 0.8s step-end infinite;
        }
        @keyframes bfTypewriter { 0%,100% { max-width: 0; } 30%,70% { max-width: 100%; } }
        @keyframes bfBlink { 0%,100% { border-color: transparent; } 50% { border-color: rgba(var(--text-glow-color, 0,255,136), 0.8); } }
      `,
    },
    'text-corrupt': {
      name: 'Corrupt',
      category: 'text',
      type: 'text',
      textClass: 'text-corrupt',
      icon: '📡',
      css: `
        .text-corrupt .game-title, .text-corrupt .bf-badge-name { animation: bfTextCorrupt 4s infinite; }
        .text-corrupt .platform-tag, .text-corrupt .bf-badge-alias { animation: bfTextCorruptSub 4s infinite; }
        @keyframes bfTextCorrupt {
          0%,100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; transform: translate(0); }
          10% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; transform: translate(-2px, 0); }
          20% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; transform: translate(2px, 0); }
          30%,70% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; transform: translate(0); }
          80% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; transform: translate(2px, 0); }
          90% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; transform: translate(-2px, 0); }
        }
        @keyframes bfTextCorruptSub {
          0%,100% { text-shadow: 0 0 5px #00ffff; transform: none; }
          15% { text-shadow: 1px 0 #ff00ff, -1px 0 #00ffff; transform: translateX(-1px); }
          85% { text-shadow: -1px 0 #ff00ff, 1px 0 #00ffff; transform: translateX(1px); }
        }
      `,
    },
  },

  // ─── ASCII ANIMATIONS (cyberpunk themed) ───────────────
  ascii: {
    system_breach: {
      label: 'System Breach', icon: '💀',
      frames: ['[SECURE]','[5ECURE]','[53CURE]','[53CUR3]','[H4CKED]','[HACKED]','[------]','[BREACH]'],
      speed: 200
    },
    firewall: {
      label: 'Firewall', icon: '🛡️',
      frames: ['[[[[[ ]]]]]','[[[[   ]]]]','[[[     ]]]','[[       ]]','[ (     ] ]','[  [   ]  ]','[   [ ]   ]','[  [ ]    ]','[ [ ]     ]','[[ ]      ]','[ [ ]     ]','[  [ ]    ]','[   [ ]   ]','[    [ ]  ]','[     [ ] ]','[      [ ]]','[     [ ] ]','[    [ ]  ]','[   [X]   ]','[ BLOCKED ]','[[       ]]','[[[     ]]]','[[[[   ]]]]'],
      speed: 150
    },
    encryption: {
      label: 'Encryption', icon: '🔒',
      frames: ['plain_txt','pl@in_txt','p!@in_7xt','p!@1n_7x7','?!@1n_7x7','?!@1?_7?7','?!?!?_???','ENCRYPTED'],
      speed: 250
    },
    deploy_friday: {
      label: 'Deploy Friday', icon: '🚀',
      frames: ['READY    ','TESTING..','PASSED!  ','DEPLOY?  ','DEPLOYING','DEPLOYED!','ERROR 500','PANIC!!!!','ROLLBACK!'],
      speed: 300
    },
    fingerprint: {
      label: 'Fingerprint', icon: '🔐',
      frames: ['[      ]','[.     ]','[..    ]','[...   ]','[....  ]','[..... ]','[......]','[oooooo]','[OOOOOO]','[@@@@@@]','[######]','[VALID!]','[      ]'],
      speed: 200
    },
    ecg: {
      label: 'ECG', icon: '📈',
      frames: ['________/','_______/\\','______/\\_','_____/\\__','____/\\___','___/\\____','__/\\_____','_/\\______','/\\_______','\\________'],
      speed: 120
    },
    dna_double: {
      label: 'DNA Helix', icon: '🧬',
      frames: [
        '  /-\\  \n /---\\ \n/-----\\\n\\-----/\n \\---/ \n  \\-/  ',
        '  \\-/  \n  /-\\  \n /---\\ \n/-----\\\n\\-----/\n \\---/ ',
        ' \\---/ \n  \\-/  \n  /-\\  \n /---\\ \n/-----\\\n\\-----/',
        '\\-----/\n \\---/ \n  \\-/  \n  /-\\  \n /---\\ \n/-----\\',
        '/-----\\\n\\-----/\n \\---/ \n  \\-/  \n  /-\\  \n /---\\ ',
        ' /---\\ \n/-----\\\n\\-----/\n \\---/ \n  \\-/  \n  /-\\  '
      ],
      speed: 200
    },
  },

  // ─── PRESETS ───────────────────────────────────────────
  presets: {
    'Full Cyber': ['matrix.bot', 'grid.top', 'glitchbar.top', 'corners.top', 'neon.border', 'text-corrupt.text'],
    'Terminal': ['matrix.mid', 'scanline.top', 'vignette.bot', 'text-glow.text'],
    'Glitch Storm': ['glitch.top', 'glitch.bot', 'glitchbar.top', 'glitchbar.bot', 'text-glitch.text'],
    'Neon Night': ['searchlight.mid', 'neon.border', 'text-neon.text', 'vignette.bot'],
  }
});
