/**
 * BIFROST WESTERN HOLIDAYS PACK
 * Seasonal effects for Western holidays
 * Valentine's, St. Patrick's, Easter, 4th of July, Halloween, Thanksgiving, Christmas
 */

// ============================================================
// WESTERN HOLIDAYS PACK
// ============================================================
Bifrost.registerPack({
  id: 'western-holidays',
  name: 'Western Holidays',
  version: '1.0.0',
  icon: '🎄',
  description: 'Seasonal effects for Western holidays',

  effects: {

    // ---- VALENTINE'S DAY ----
    hearts: {
      name: 'Floating Hearts', category: 'particle', zones: ['top','mid','bot'], icon: '💕',
      css: `.bf-heart-particle { position:absolute;top:-10%;pointer-events:none;opacity:0; }
        @keyframes bfHeartFloat { 0%{transform:translateY(0) rotate(0deg) scale(1);opacity:0;} 10%{opacity:0.8;} 80%{opacity:0.6;} 100%{transform:translateY(550px) rotate(25deg) scale(0.6);opacity:0;} }
        @keyframes bfHeartSway { 0%,100%{margin-left:0} 50%{margin-left:20px} }`,
      init(ctx) {
        const colors = ['#ff4d6d','#ff758f','#ff8fa3','#c9184a','#ff0a54','#ff477e'];
        const heartSVG = (c,sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="${c}" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        ctx.interval = setInterval(() => {
          const h = document.createElement('div'); h.className = 'bf-heart-particle';
          const sz = 10 + Math.random() * 16;
          const col = colors[Math.floor(Math.random() * colors.length)];
          const dur = 3000 + Math.random() * 3000;
          const sway = 2000 + Math.random() * 2000;
          h.innerHTML = heartSVG(col, sz);
          h.style.cssText = `left:${Math.random()*100}%;animation:bfHeartFloat ${dur}ms ease-in forwards,bfHeartSway ${sway}ms ease-in-out infinite;`;
          ctx.container.appendChild(h);
          setTimeout(() => h.remove(), dur);
        }, 400);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    cupid: {
      name: 'Cupid Flyover', category: 'flyover', zones: ['mid'], icon: '💘',
      css: `.bf-cupid { position:absolute;pointer-events:none;z-index:3;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        @keyframes bfCupidFly { 0%{left:-15%;top:30%;} 25%{top:20%;} 50%{top:35%;} 75%{top:25%;} 100%{left:115%;top:30%;} }`,
      init(ctx) {
        const cupidSVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- wings -->
          <ellipse cx="12" cy="20" rx="10" ry="14" fill="rgba(255,255,255,0.6)" transform="rotate(-15 12 20)"/>
          <ellipse cx="36" cy="20" rx="10" ry="14" fill="rgba(255,255,255,0.6)" transform="rotate(15 36 20)"/>
          <!-- body -->
          <ellipse cx="24" cy="30" rx="8" ry="10" fill="#ffcba4"/>
          <!-- head -->
          <circle cx="24" cy="16" r="7" fill="#ffcba4"/>
          <!-- hair curls -->
          <circle cx="19" cy="11" r="3" fill="#f0c060"/>
          <circle cx="24" cy="9" r="3" fill="#f0c060"/>
          <circle cx="29" cy="11" r="3" fill="#f0c060"/>
          <!-- eyes -->
          <circle cx="22" cy="15" r="1" fill="#333"/>
          <circle cx="26" cy="15" r="1" fill="#333"/>
          <!-- smile -->
          <path d="M22 18 Q24 20 26 18" stroke="#c0392b" stroke-width="0.8" fill="none"/>
          <!-- bow -->
          <path d="M36 28 C42 22 42 34 36 28" stroke="#8B4513" stroke-width="1.5" fill="none"/>
          <line x1="36" y1="22" x2="36" y2="34" stroke="#8B4513" stroke-width="1"/>
          <!-- arrow -->
          <line x1="36" y1="28" x2="47" y2="25" stroke="#8B4513" stroke-width="1"/>
          <polygon points="47,23.5 48,25 47,26.5" fill="#c0392b"/>
          <!-- heart -->
          <path d="M36 25 C35 23 33 23 33 25 C33 27 36 29 36 29 C36 29 39 27 39 25 C39 23 37 23 36 25Z" fill="#ff4d6d" opacity="0.6"/>
        </svg>`;
        function launch() {
          const el = document.createElement('div'); el.className = 'bf-cupid';
          el.innerHTML = cupidSVG;
          const dur = 4000 + Math.random() * 2000;
          el.style.cssText = `animation:bfCupidFly ${dur}ms ease-in-out forwards;top:${20+Math.random()*40}%;`;
          ctx.container.appendChild(el);
          setTimeout(() => { el.remove(); launch(); }, dur + 1000 + Math.random() * 3000);
        }
        launch();
      },
      cleanup(ctx) { ctx.container.innerHTML = ''; }
    },

    // ---- ST. PATRICK'S DAY ----
    shamrocks: {
      name: 'Shamrock Drift', category: 'particle', zones: ['top','mid','bot'], icon: '☘️',
      css: `.bf-shamrock { position:absolute;top:-10%;pointer-events:none;opacity:0; }
        @keyframes bfShamrockDrift { 0%{transform:translateY(0) rotate(0deg);opacity:0;} 10%{opacity:0.7;} 100%{transform:translateY(550px) rotate(180deg);opacity:0;} }
        @keyframes bfShamrockSway { 0%,100%{margin-left:0} 33%{margin-left:15px} 66%{margin-left:-10px} }`,
      init(ctx) {
        const greens = ['#2ecc71','#27ae60','#1abc9c','#00b894','#55efc4'];
        const shamSVG = (c,sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="${c}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C10 2 8.5 4 9 6.5C6.5 5.5 4 6 4 8.5C4 11 7 12 9 11.5C7 13 7 16 9.5 16C11 16 12 14 12 14C12 14 13 16 14.5 16C17 16 17 13 15 11.5C17 12 20 11 20 8.5C20 6 17.5 5.5 15 6.5C15.5 4 14 2 12 2Z"/><rect x="11" y="14" width="2" height="8" rx="1" fill="${c}"/></svg>`;
        ctx.interval = setInterval(() => {
          const s = document.createElement('div'); s.className = 'bf-shamrock';
          const sz = 12 + Math.random() * 14;
          const col = greens[Math.floor(Math.random() * greens.length)];
          const dur = 3500 + Math.random() * 3000;
          const sway = 2500 + Math.random() * 2000;
          s.innerHTML = shamSVG(col, sz);
          s.style.cssText = `left:${Math.random()*100}%;animation:bfShamrockDrift ${dur}ms ease-in forwards,bfShamrockSway ${sway}ms ease-in-out infinite;`;
          ctx.container.appendChild(s);
          setTimeout(() => s.remove(), dur);
        }, 500);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    goldcoins: {
      name: 'Gold Coins', category: 'particle', zones: ['top','mid','bot'], icon: '🪙',
      css: `.bf-coin { position:absolute;top:-10%;pointer-events:none; }
        @keyframes bfCoinFall { 0%{transform:translateY(0) rotateY(0deg);opacity:0;} 10%{opacity:1;} 90%{opacity:0.8;} 100%{transform:translateY(550px) rotateY(720deg);opacity:0;} }`,
      init(ctx) {
        const coinSVG = (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#f1c40f" stroke="#e67e22" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="none" stroke="#e67e22" stroke-width="0.5"/><text x="12" y="16" text-anchor="middle" fill="#e67e22" font-size="10" font-weight="bold">$</text></svg>`;
        ctx.interval = setInterval(() => {
          const c = document.createElement('div'); c.className = 'bf-coin';
          const sz = 12 + Math.random() * 10;
          const dur = 2500 + Math.random() * 2500;
          c.innerHTML = coinSVG(sz);
          c.style.cssText = `left:${Math.random()*100}%;animation:bfCoinFall ${dur}ms ease-in forwards;`;
          ctx.container.appendChild(c);
          setTimeout(() => c.remove(), dur);
        }, 600);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    // ---- EASTER ----
    eggs: {
      name: 'Easter Eggs', category: 'particle', zones: ['top','mid','bot'], icon: '🥚',
      css: `.bf-egg { position:absolute;bottom:-15%;pointer-events:none;opacity:0; }
        @keyframes bfEggRise { 0%{transform:translateY(0) rotate(0deg);opacity:0;} 15%{opacity:0.9;} 85%{opacity:0.7;} 100%{transform:translateY(-550px) rotate(-15deg);opacity:0;} }
        @keyframes bfEggWobble { 0%,100%{margin-left:0} 25%{margin-left:8px} 75%{margin-left:-8px} }`,
      init(ctx) {
        const patterns = [
          (c1,c2) => `<rect width="18" height="24" rx="9" ry="12" fill="${c1}"/><line x1="0" y1="8" x2="18" y2="8" stroke="${c2}" stroke-width="2"/><line x1="0" y1="16" x2="18" y2="16" stroke="${c2}" stroke-width="2"/>`,
          (c1,c2) => `<rect width="18" height="24" rx="9" ry="12" fill="${c1}"/><circle cx="9" cy="12" r="3" fill="${c2}"/><circle cx="5" cy="7" r="1.5" fill="${c2}"/><circle cx="13" cy="7" r="1.5" fill="${c2}"/><circle cx="5" cy="17" r="1.5" fill="${c2}"/><circle cx="13" cy="17" r="1.5" fill="${c2}"/>`,
          (c1,c2) => `<rect width="18" height="24" rx="9" ry="12" fill="${c1}"/><path d="M0 12 Q4.5 8 9 12 Q13.5 16 18 12" stroke="${c2}" stroke-width="2" fill="none"/>`
        ];
        const colors = [['#ff9ff3','#ff6b6b'],['#48dbfb','#0abde3'],['#feca57','#ff9f43'],['#55efc4','#00b894'],['#a29bfe','#6c5ce7']];
        ctx.interval = setInterval(() => {
          const e = document.createElement('div'); e.className = 'bf-egg';
          const sz = 18 + Math.random() * 10;
          const [c1,c2] = colors[Math.floor(Math.random()*colors.length)];
          const pat = patterns[Math.floor(Math.random()*patterns.length)];
          const dur = 3500 + Math.random() * 3000;
          e.innerHTML = `<svg width="${sz}" height="${sz*1.33}" viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg">${pat(c1,c2)}</svg>`;
          e.style.cssText = `left:${Math.random()*100}%;animation:bfEggRise ${dur}ms ease-out forwards,bfEggWobble ${2000+Math.random()*1500}ms ease-in-out infinite;`;
          ctx.container.appendChild(e);
          setTimeout(() => e.remove(), dur);
        }, 600);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    // ---- 4TH OF JULY ----
    fireworks: {
      name: 'Fireworks', category: 'particle', zones: ['top','mid','bot'], icon: '🎆',
      css: `.bf-spark { position:absolute;border-radius:50%;pointer-events:none; }
        @keyframes bfSparkBurst { 0%{transform:translate(0,0) scale(1);opacity:1;} 100%{opacity:0;} }`,
      init(ctx) {
        const colors = ['#ff0000','#ffffff','#0055ff','#ff4444','#ffcc00','#ff0066'];
        function burst() {
          const cx = 10 + Math.random() * 80;
          const cy = 10 + Math.random() * 60;
          const numSparks = 12 + Math.floor(Math.random() * 12);
          const col = colors[Math.floor(Math.random() * colors.length)];
          for (let i = 0; i < numSparks; i++) {
            const s = document.createElement('div'); s.className = 'bf-spark';
            const angle = (Math.PI * 2 / numSparks) * i + (Math.random() - 0.5) * 0.3;
            const dist = 30 + Math.random() * 50;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            const sz = 2 + Math.random() * 3;
            const dur = 600 + Math.random() * 800;
            s.style.cssText = `left:${cx}%;top:${cy}%;width:${sz}px;height:${sz}px;background:${col};box-shadow:0 0 ${sz*2}px ${col};animation:bfSparkBurst ${dur}ms ease-out forwards;`;
            s.style.setProperty('--dx', dx + 'px');
            s.style.setProperty('--dy', dy + 'px');
            s.animate([
              { transform: 'translate(0,0) scale(1)', opacity: 1 },
              { transform: `translate(${dx}px,${dy}px) scale(0.2)`, opacity: 0 }
            ], { duration: dur, easing: 'ease-out', fill: 'forwards' });
            ctx.container.appendChild(s);
            setTimeout(() => s.remove(), dur);
          }
        }
        burst();
        ctx.interval = setInterval(burst, 1200 + Math.random() * 1500);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    starsstripes: {
      name: 'Stars & Stripes', category: 'particle', zones: ['mid','top'], icon: '🇺🇸',
      css: `.bf-usa-star { position:absolute;top:-5%;pointer-events:none;opacity:0; }
        @keyframes bfUSAStarFall { 0%{transform:translateY(0) rotate(0deg);opacity:0;} 10%{opacity:0.9;} 100%{transform:translateY(550px) rotate(360deg);opacity:0;} }`,
      init(ctx) {
        const cols = ['#ff0000','#ffffff','#0044aa'];
        const starSVG = (c,sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="${c}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.8L12 16.8l-6.2 3.4 1.6-6.8-5.2-4.5 6.9-.6z"/></svg>`;
        ctx.interval = setInterval(() => {
          const s = document.createElement('div'); s.className = 'bf-usa-star';
          const sz = 8 + Math.random() * 14;
          const col = cols[Math.floor(Math.random() * cols.length)];
          const dur = 2500 + Math.random() * 2500;
          s.innerHTML = starSVG(col, sz);
          s.style.cssText = `left:${Math.random()*100}%;animation:bfUSAStarFall ${dur}ms linear forwards;`;
          ctx.container.appendChild(s);
          setTimeout(() => s.remove(), dur);
        }, 300);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    // ---- HALLOWEEN ----
    pumpkins: {
      name: 'Pumpkin Lanterns', category: 'particle', zones: ['mid','top'], icon: '🎃',
      css: `.bf-pumpkin { position:absolute;bottom:-15%;pointer-events:none;opacity:0;filter:drop-shadow(0 0 6px rgba(255,165,0,0.5)); }
        @keyframes bfPumpkinRise { 0%{transform:translateY(0);opacity:0;} 10%{opacity:0.9;} 90%{opacity:0.6;} 100%{transform:translateY(-550px);opacity:0;} }
        @keyframes bfPumpkinGlow { 0%,100%{filter:drop-shadow(0 0 4px rgba(255,165,0,0.4));} 50%{filter:drop-shadow(0 0 10px rgba(255,165,0,0.8));} }`,
      init(ctx) {
        const pumpSVG = (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="16" cy="18" rx="13" ry="11" fill="#e67e22"/>
          <ellipse cx="16" cy="18" rx="13" ry="11" fill="none" stroke="#d35400" stroke-width="0.5"/>
          <path d="M10 18 C10 14 13 12 16 12 C19 12 22 14 22 18" fill="none" stroke="#d35400" stroke-width="1"/>
          <rect x="14" y="6" width="4" height="5" rx="1" fill="#27ae60"/>
          <polygon points="10,15 12,13 11,17" fill="#2c3e50"/>
          <polygon points="22,15 20,13 21,17" fill="#2c3e50"/>
          <path d="M12 20 Q16 24 20 20" stroke="#2c3e50" stroke-width="1.5" fill="none"/>
          <ellipse cx="16" cy="18" rx="11" ry="9" fill="rgba(255,165,0,0.15)"/>
        </svg>`;
        ctx.interval = setInterval(() => {
          const p = document.createElement('div'); p.className = 'bf-pumpkin';
          const sz = 20 + Math.random() * 16;
          const dur = 4000 + Math.random() * 3000;
          p.innerHTML = pumpSVG(sz);
          p.style.cssText = `left:${Math.random()*90}%;animation:bfPumpkinRise ${dur}ms ease-out forwards,bfPumpkinGlow 2s ease-in-out infinite;`;
          ctx.container.appendChild(p);
          setTimeout(() => p.remove(), dur);
        }, 800);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    witch: {
      name: 'Witch Flyover', category: 'flyover', zones: ['mid'], icon: '🧹',
      css: `.bf-witch { position:absolute;pointer-events:none;z-index:3; }
        @keyframes bfWitchFly { 0%{left:-20%;} 100%{left:120%;} }
        @keyframes bfWitchBob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }`,
      init(ctx) {
        const witchSVG = `<svg width="60" height="40" viewBox="0 0 90 55" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(90,0) scale(-1,1)">
          <!-- broom stick -->
          <line x1="25" y1="38" x2="80" y2="35" stroke="#a0522d" stroke-width="2.5" stroke-linecap="round"/>
          <!-- broom bristles -->
          <path d="M75 30 L88 28 L85 35 L90 33 L86 38 L88 42 L80 40 L75 30Z" fill="#daa520"/>
          <!-- body/dress -->
          <path d="M40 25 L32 42 L52 42 L48 25Z" fill="#1a1a2e"/>
          <!-- cape flowing back -->
          <path d="M48 25 Q55 30 58 40 L52 42 L48 25Z" fill="#2c2c54" opacity="0.8"/>
          <!-- head -->
          <circle cx="43" cy="20" r="6" fill="#7c8c5a"/>
          <!-- hat -->
          <polygon points="43,4 35,18 51,18" fill="#1a1a2e"/>
          <rect x="33" y="17" width="20" height="3" rx="1" fill="#1a1a2e"/>
          <!-- hat buckle -->
          <rect x="40" y="17" width="6" height="3" rx="0.5" fill="#f39c12"/>
          <!-- nose -->
          <path d="M47 20 L49 22 L47 22Z" fill="#6a7a4a"/>
          <!-- eye -->
          <circle cx="45" cy="19" r="1" fill="#e74c3c"/>
          </g>
        </svg>`;
        function launch() {
          const el = document.createElement('div'); el.className = 'bf-witch';
          el.innerHTML = witchSVG;
          const dur = 3500 + Math.random() * 2500;
          const top = 15 + Math.random() * 50;
          el.style.cssText = `top:${top}%;animation:bfWitchFly ${dur}ms linear forwards,bfWitchBob 1.5s ease-in-out infinite;`;
          ctx.container.appendChild(el);
          setTimeout(() => { el.remove(); launch(); }, dur + 2000 + Math.random() * 4000);
        }
        launch();
      },
      cleanup(ctx) { ctx.container.innerHTML = ''; }
    },

    bats: {
      name: 'Bat Swarm', category: 'particle', zones: ['mid','top'], icon: '🦇',
      css: `.bf-bat { position:absolute;pointer-events:none;opacity:0; }
        @keyframes bfBatFly { 0%{transform:translateX(0) translateY(0);opacity:0;} 10%{opacity:0.8;} 90%{opacity:0.6;} 100%{transform:translateX(200px) translateY(-100px);opacity:0;} }
        @keyframes bfBatWing { 0%,100%{transform:scaleY(1);} 50%{transform:scaleY(0.6);} }`,
      init(ctx) {
        const batSVG = (sz) => `<svg width="${sz}" height="${sz*0.6}" viewBox="0 0 30 18" fill="#1a1a2e" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="15" cy="10" rx="3" ry="4"/>
          <path d="M12 8 Q6 2 1 6 Q4 4 7 8 Q9 6 12 8Z" style="animation:bfBatWing 0.3s ease-in-out infinite"/>
          <path d="M18 8 Q24 2 29 6 Q26 4 23 8 Q21 6 18 8Z" style="animation:bfBatWing 0.3s 0.05s ease-in-out infinite"/>
          <circle cx="13.5" cy="8.5" r="0.8" fill="#e74c3c"/>
          <circle cx="16.5" cy="8.5" r="0.8" fill="#e74c3c"/>
        </svg>`;
        ctx.interval = setInterval(() => {
          const b = document.createElement('div'); b.className = 'bf-bat';
          const sz = 16 + Math.random() * 16;
          const dur = 2000 + Math.random() * 2000;
          const startX = Math.random() * 60;
          const startY = 20 + Math.random() * 60;
          const dx = 100 + Math.random() * 150;
          const dy = -(50 + Math.random() * 100);
          b.innerHTML = batSVG(sz);
          b.style.cssText = `left:${startX}%;top:${startY}%;`;
          b.animate([
            { transform: 'translate(0,0)', opacity: 0 },
            { transform: 'translate(0,0)', opacity: 0.8, offset: 0.1 },
            { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }
          ], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
          ctx.container.appendChild(b);
          setTimeout(() => b.remove(), dur);
        }, 400);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    ghosts: {
      name: 'Ghost Drift', category: 'particle', zones: ['mid','top'], icon: '👻',
      css: `.bf-ghost { position:absolute;bottom:-15%;pointer-events:none;opacity:0; }
        @keyframes bfGhostRise { 0%{transform:translateY(0) scale(0.8);opacity:0;} 10%{opacity:0.5;} 50%{opacity:0.6;} 100%{transform:translateY(-550px) scale(1);opacity:0;} }
        @keyframes bfGhostWobble { 0%,100%{margin-left:0} 50%{margin-left:15px} }`,
      init(ctx) {
        const ghostSVG = (sz,op) => `<svg width="${sz}" height="${sz*1.2}" viewBox="0 0 24 30" fill="rgba(255,255,255,${op})" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2 C6 2 2 8 2 14 L2 26 L6 22 L9 26 L12 22 L15 26 L18 22 L22 26 L22 14 C22 8 18 2 12 2Z"/>
          <circle cx="9" cy="12" r="2.5" fill="#1a1a2e"/>
          <circle cx="15" cy="12" r="2.5" fill="#1a1a2e"/>
          <ellipse cx="12" cy="18" rx="2" ry="1.5" fill="#1a1a2e"/>
        </svg>`;
        ctx.interval = setInterval(() => {
          const g = document.createElement('div'); g.className = 'bf-ghost';
          const sz = 18 + Math.random() * 14;
          const op = 0.3 + Math.random() * 0.4;
          const dur = 4000 + Math.random() * 4000;
          const wobble = 3000 + Math.random() * 2000;
          g.innerHTML = ghostSVG(sz, op);
          g.style.cssText = `left:${Math.random()*90}%;animation:bfGhostRise ${dur}ms ease-out forwards,bfGhostWobble ${wobble}ms ease-in-out infinite;`;
          ctx.container.appendChild(g);
          setTimeout(() => g.remove(), dur);
        }, 900);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    // ---- THANKSGIVING ----
    leaves: {
      name: 'Falling Leaves', category: 'particle', zones: ['top','mid','bot'], icon: '🍂',
      css: `.bf-leaf { position:absolute;top:-10%;pointer-events:none;opacity:0; }
        @keyframes bfLeafFall { 0%{transform:translateY(0) rotate(0deg);opacity:0;} 10%{opacity:0.8;} 100%{transform:translateY(550px) rotate(270deg);opacity:0;} }
        @keyframes bfLeafSway { 0%,100%{margin-left:0} 25%{margin-left:20px} 50%{margin-left:-5px} 75%{margin-left:15px} }`,
      init(ctx) {
        const leafColors = ['#e67e22','#d35400','#c0392b','#f39c12','#e74c3c','#935116'];
        const leafSVG = (c,sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="${c}" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2 Q20 8 18 16 Q14 22 12 22 Q10 22 6 16 Q4 8 12 2Z"/>
          <line x1="12" y1="4" x2="12" y2="22" stroke="${c === '#e67e22' ? '#d35400' : '#a04000'}" stroke-width="0.8"/>
          <line x1="12" y1="10" x2="8" y2="8" stroke="${c === '#e67e22' ? '#d35400' : '#a04000'}" stroke-width="0.5"/>
          <line x1="12" y1="14" x2="16" y2="11" stroke="${c === '#e67e22' ? '#d35400' : '#a04000'}" stroke-width="0.5"/>
        </svg>`;
        ctx.interval = setInterval(() => {
          const l = document.createElement('div'); l.className = 'bf-leaf';
          const sz = 12 + Math.random() * 14;
          const col = leafColors[Math.floor(Math.random() * leafColors.length)];
          const dur = 3000 + Math.random() * 3500;
          const tumble = 2000 + Math.random() * 2000;
          l.innerHTML = leafSVG(col, sz);
          l.style.cssText = `left:${Math.random()*100}%;animation:bfLeafFall ${dur}ms ease-in forwards,bfLeafSway ${tumble}ms ease-in-out infinite;`;
          ctx.container.appendChild(l);
          setTimeout(() => l.remove(), dur);
        }, 450);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    // ---- CHRISTMAS ----
    ornaments: {
      name: 'Ornament Dangle', category: 'overlay', zones: ['top'], icon: '🎄',
      css: `.bf-ornament { position:absolute;top:0;pointer-events:none; }
        @keyframes bfOrnamentSwing { 0%,100%{transform:rotate(-5deg);} 50%{transform:rotate(5deg);} }`,
      init(ctx) {
        const colors = ['#e74c3c','#f1c40f','#3498db','#2ecc71','#9b59b6','#e67e22'];
        const numOrns = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numOrns; i++) {
          const o = document.createElement('div'); o.className = 'bf-ornament';
          const col = colors[Math.floor(Math.random() * colors.length)];
          const sz = 10 + Math.random() * 8;
          const x = 10 + (i / numOrns) * 80 + (Math.random() - 0.5) * 10;
          const stringH = 8 + Math.random() * 20;
          const delay = Math.random() * 2;
          o.innerHTML = `<svg width="${sz+4}" height="${stringH+sz+4}" viewBox="0 0 ${sz+4} ${stringH+sz+4}" xmlns="http://www.w3.org/2000/svg">
            <line x1="${(sz+4)/2}" y1="0" x2="${(sz+4)/2}" y2="${stringH}" stroke="#888" stroke-width="0.5"/>
            <rect x="${(sz+4)/2-2}" y="${stringH-2}" width="4" height="4" rx="1" fill="#aaa"/>
            <circle cx="${(sz+4)/2}" cy="${stringH+sz/2+2}" r="${sz/2}" fill="${col}"/>
            <ellipse cx="${(sz+4)/2-sz*0.15}" cy="${stringH+sz/2+2-sz*0.15}" rx="${sz*0.2}" ry="${sz*0.15}" fill="rgba(255,255,255,0.3)"/>
          </svg>`;
          o.style.cssText = `left:${x}%;transform-origin:top center;animation:bfOrnamentSwing ${2+Math.random()}s ${delay}s ease-in-out infinite;`;
          ctx.container.appendChild(o);
        }
      },
      cleanup(ctx) { ctx.container.innerHTML = ''; }
    },

    santa: {
      name: 'Santa Flyover', category: 'flyover', zones: ['mid'], icon: '🎅',
      css: `.bf-santa { position:absolute;pointer-events:none;z-index:3; }
        @keyframes bfSantaFly { 0%{left:-25%;} 100%{left:125%;} }
        @keyframes bfSantaBob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }`,
      init(ctx) {
        const santaSVG = `<svg width="80" height="35" viewBox="0 0 120 45" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(120,0) scale(-1,1)">
          <!-- reindeer -->
          <ellipse cx="20" cy="22" rx="10" ry="7" fill="#8B6914"/>
          <circle cx="12" cy="16" r="4" fill="#8B6914"/>
          <!-- antlers -->
          <path d="M10 12 L6 4 L4 8 M10 12 L8 5 M14 12 L18 4 L20 8 M14 12 L16 5" stroke="#5c4a1e" stroke-width="1" fill="none"/>
          <!-- red nose -->
          <circle cx="9" cy="17" r="1.5" fill="#e74c3c"/>
          <!-- eye -->
          <circle cx="12" cy="15" r="0.8" fill="#333"/>
          <!-- legs -->
          <line x1="15" y1="28" x2="14" y2="35" stroke="#8B6914" stroke-width="1.5"/>
          <line x1="25" y1="28" x2="26" y2="35" stroke="#8B6914" stroke-width="1.5"/>
          <!-- reins -->
          <line x1="12" y1="20" x2="42" y2="22" stroke="#c0a030" stroke-width="0.8"/>
          <!-- sleigh body -->
          <path d="M40 18 L42 30 L80 30 L82 24 L78 18Z" fill="#c0392b"/>
          <!-- sleigh runner -->
          <path d="M38 32 Q40 28 44 30 L78 30 Q82 30 84 34 L86 36" stroke="#f1c40f" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- santa body -->
          <ellipse cx="60" cy="18" rx="10" ry="12" fill="#c0392b"/>
          <!-- belt -->
          <rect x="50" y="22" width="20" height="3" fill="#2c3e50"/>
          <rect x="58" y="21.5" width="4" height="4" rx="0.5" fill="#f1c40f"/>
          <!-- santa head -->
          <circle cx="60" cy="8" r="6" fill="#ffeaa7"/>
          <!-- beard -->
          <ellipse cx="60" cy="13" rx="5" ry="4" fill="white"/>
          <!-- hat -->
          <path d="M54 6 Q60 -4 66 6" fill="#c0392b"/>
          <circle cx="66" cy="0" r="2.5" fill="white"/>
          <rect x="53" y="5" width="14" height="2.5" rx="1.2" fill="white"/>
          <!-- eyes -->
          <circle cx="58" cy="7" r="0.8" fill="#333"/>
          <circle cx="62" cy="7" r="0.8" fill="#333"/>
          <!-- sack -->
          <ellipse cx="72" cy="16" rx="7" ry="9" fill="#8B6914"/>
          <path d="M68 8 Q72 6 76 8" stroke="#6b5010" stroke-width="1" fill="none"/>
          </g>
        </svg>`;
        function launch() {
          const el = document.createElement('div'); el.className = 'bf-santa';
          el.innerHTML = santaSVG;
          const dur = 5000 + Math.random() * 3000;
          const top = 10 + Math.random() * 35;
          el.style.cssText = `top:${top}%;animation:bfSantaFly ${dur}ms linear forwards,bfSantaBob 2s ease-in-out infinite;`;
          ctx.container.appendChild(el);
          setTimeout(() => { el.remove(); launch(); }, dur + 3000 + Math.random() * 5000);
        }
        launch();
      },
      cleanup(ctx) { ctx.container.innerHTML = ''; }
    },

    candycane: {
      name: 'Candy Cane Border', category: 'overlay', zones: ['top'], icon: '🍬',
      css: `.bf-candy-border { position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:5;
        border:4px solid transparent;
        background:
          linear-gradient(var(--frame-color), var(--frame-color)) padding-box,
          repeating-linear-gradient(45deg, #c0392b 0px, #c0392b 8px, #fff 8px, #fff 16px) border-box;
        clip-path:polygon(
          0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
          var(--frame-padding) var(--frame-padding),
          var(--frame-padding) calc(var(--frame-padding) + var(--window-h)),
          calc(100% - var(--frame-padding)) calc(var(--frame-padding) + var(--window-h)),
          calc(100% - var(--frame-padding)) var(--frame-padding),
          var(--frame-padding) var(--frame-padding)
        );
        }`,
      init(ctx) {
        ctx.el('div', 'bf-candy-border');
      },
      cleanup(ctx) { ctx.container.innerHTML = ''; }
    },

  },

  ascii: {}
});
