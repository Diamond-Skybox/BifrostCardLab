/**
 * BIFROST THEME PACK: HOLI FESTIVAL
 * Festival of colors — water balloons, powder clouds, rangoli art, and color rain
 */
Bifrost.registerPack({
  id: 'holi',
  name: 'Holi Festival',
  version: '1.0.0',
  icon: '🎨',
  description: 'Festival of colors — water balloons, powder clouds, and color splashes',

  effects: {
    balloon: {
      name: 'Water Balloons', category: 'particle', zones: ['mid'], icon: '🎈',
      css: `.bf-balloon { position:absolute;pointer-events:none;z-index:4; }
        .bf-balloon-body { border-radius:50% 50% 50% 50%/55% 55% 45% 45%;filter:drop-shadow(1px 2px 2px rgba(0,0,0,0.2)); }
        .bf-balloon-knot { position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:4px;height:5px;border-radius:0 0 50% 50%; }
        .bf-splat { position:absolute;pointer-events:none;z-index:2; }
        .bf-splat-blob { position:absolute;border-radius:45% 55% 50% 50%/50% 45% 55% 50%;opacity:0.7; }
        @keyframes bfSplatFade { 0%{opacity:0.7;transform:scale(1)} 30%{opacity:0.6} 100%{opacity:0;transform:scale(1.15)} }
        .bf-splat-drip { position:absolute;pointer-events:none; }
        @keyframes bfDripFall { 0%{transform:translateY(0);opacity:var(--drip-op,0.6)} 60%{opacity:var(--drip-op,0.6)} 100%{transform:translateY(var(--drip-dist,30px));opacity:0} }`,
      init(ctx) {
        const holiColors = ['#ff1744','#f50057','#d500f9','#651fff','#2979ff','#00e5ff','#00e676','#ffea00','#ff9100','#ff3d00'];
        const cs = getComputedStyle(ctx.card);
        const pad = parseFloat(cs.getPropertyValue('--frame-padding')) || 12;
        const cardW = ctx.card.offsetWidth;
        const winW = cardW - pad * 2;
        const winH = winW * 1.5;

        function launchBalloon() {
          const color = holiColors[Math.floor(Math.random() * holiColors.length)];
          const fromLeft = Math.random() < 0.5;
          const startX = fromLeft ? -15 : winW + 15;
          const targetX = pad + 15 + Math.random() * (winW - 30);
          const targetY = pad + winH * 0.3 + Math.random() * (winH * 0.6);
          const size = 10 + Math.random() * 6;

          const balloon = document.createElement('div'); balloon.className = 'bf-balloon';
          const body = document.createElement('div'); body.className = 'bf-balloon-body';
          body.style.cssText = `width:${size}px;height:${size * 1.2}px;background:radial-gradient(ellipse at 35% 30%,rgba(255,255,255,0.4),${color} 50%,${color});`;
          const knot = document.createElement('div'); knot.className = 'bf-balloon-knot';
          knot.style.background = color;
          balloon.appendChild(body); balloon.appendChild(knot);
          ctx.container.appendChild(balloon);

          const dur = 600 + Math.random() * 400;
          const arcHeight = 40 + Math.random() * 60;
          let start = null;

          function animateBalloon(ts) {
            if (!start) start = ts;
            const p = Math.min(1, (ts - start) / dur);
            const x = startX + (targetX - startX) * p;
            const arcP = 1 - Math.pow(2 * p - 1, 2);
            const y = targetY - arcHeight * arcP;
            balloon.style.transform = `translate(${x}px, ${y}px) rotate(${(fromLeft ? 1 : -1) * (1 - p) * 25}deg)`;

            if (p < 1) {
              requestAnimationFrame(animateBalloon);
            } else {
              balloon.remove();
              // Splatter — multiple irregular blobs + drips
              const splat = document.createElement('div'); splat.className = 'bf-splat';
              const fadeDur = 4000 + Math.random() * 3000;
              splat.style.cssText = `left:${targetX}px;top:${targetY}px;`;

              // Center blob
              const centerSz = 30 + Math.random() * 15;
              const center = document.createElement('div'); center.className = 'bf-splat-blob';
              center.style.cssText = `left:${-centerSz/2}px;top:${-centerSz/2}px;width:${centerSz}px;height:${centerSz*0.85}px;background:radial-gradient(ellipse,${color}aa,${color}66 50%,transparent 75%);filter:blur(1.5px);animation:bfSplatFade ${fadeDur}ms ease-out forwards;`;
              splat.appendChild(center);

              // 4-7 satellite blobs flung outward
              const numBlobs = 4 + Math.floor(Math.random() * 4);
              for (let b = 0; b < numBlobs; b++) {
                const blob = document.createElement('div'); blob.className = 'bf-splat-blob';
                const angle = (b / numBlobs) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
                const dist = 12 + Math.random() * 22;
                const bx = Math.cos(angle) * dist;
                const by = Math.sin(angle) * dist;
                const bSz = 8 + Math.random() * 14;
                const bRad = `${40+Math.random()*20}% ${40+Math.random()*20}% ${40+Math.random()*20}% ${40+Math.random()*20}%`;
                blob.style.cssText = `left:${bx - bSz/2}px;top:${by - bSz/2}px;width:${bSz}px;height:${bSz * (0.7+Math.random()*0.6)}px;border-radius:${bRad};background:${color}99;filter:blur(1px);animation:bfSplatFade ${fadeDur * (0.7+Math.random()*0.3)}ms ease-out forwards;`;
                splat.appendChild(blob);
              }

              // Teardrops dripping down from impact
              const numDrips = 2 + Math.floor(Math.random() * 5); // 2-6
              for (let d = 0; d < numDrips; d++) {
                const drip = document.createElement('div'); drip.className = 'bf-splat-drip';
                const dx = (Math.random() - 0.5) * centerSz * 1.2;
                const dripW = 3 + Math.random() * 4;
                const dripH = dripW * (1.6 + Math.random() * 0.8);
                const dist = 18 + Math.random() * 45;
                const dripDur = 1500 + Math.random() * 3500;
                const dripDelay = Math.random() * 800;
                const dripOp = 0.4 + Math.random() * 0.35;
                // SVG teardrop — rounded bottom, pointed top
                const svgW = dripW + 2;
                const svgH = dripH + 2;
                const cx = svgW / 2;
                const tipY = 1;
                const bulgeY = svgH - dripW * 0.5 - 1;
                const r = dripW * 0.5;
                drip.innerHTML = `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
                  <path d="M${cx},${tipY} Q${cx + r * 0.3},${tipY + dripH * 0.3} ${cx + r},${bulgeY} A${r},${r} 0 1,1 ${cx - r},${bulgeY} Q${cx - r * 0.3},${tipY + dripH * 0.3} ${cx},${tipY}Z" fill="${color}" opacity="0.85"/>
                  <ellipse cx="${cx - r * 0.2}" cy="${bulgeY - r * 0.1}" rx="${r * 0.3}" ry="${r * 0.25}" fill="rgba(255,255,255,0.25)"/>
                </svg>`;
                const dy = centerSz * (-0.1 + Math.random() * 0.5); // start from various heights around the splat
                drip.style.cssText = `left:${dx - svgW/2}px;top:${dy}px;--drip-dist:${dist}px;--drip-op:${dripOp};animation:bfDripFall ${dripDur}ms ${dripDelay}ms ease-in forwards;`;
                splat.appendChild(drip);
              }

              ctx.container.appendChild(splat);
              setTimeout(() => splat.remove(), fadeDur + 500);
            }
          }
          requestAnimationFrame(animateBalloon);
        }

        // Stagger launches
        ctx.interval = setInterval(() => {
          launchBalloon();
        }, 1200 + Math.random() * 1800);
        // First one quick
        setTimeout(launchBalloon, 300);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    powder: {
      name: 'Powder Puffs', category: 'particle', zones: ['top','mid','bot'], icon: '💨',
      css: `.bf-powder { position:absolute;pointer-events:none;border-radius:50%;z-index:3; }
        @keyframes bfPowderBurst { 0%{transform:scale(0);opacity:0} 15%{opacity:0.7} 40%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.8);opacity:0} }
        .bf-powder-wisp { position:absolute;pointer-events:none;border-radius:50%;z-index:2; }
        @keyframes bfWispDrift { 0%{transform:translate(0,0) scale(0.5);opacity:0} 20%{opacity:0.4} 100%{transform:translate(var(--wx),var(--wy)) scale(1.2);opacity:0} }`,
      init(ctx) {
        const holiColors = ['#ff1744','#f50057','#d500f9','#651fff','#2979ff','#00e5ff','#00e676','#ffea00','#ff9100','#ff3d00'];
        const zones = {top:{yMin:5,yMax:35},mid:{yMin:25,yMax:75},bot:{yMin:60,yMax:95}};
        const z = zones[ctx.zone] || zones.mid;

        ctx.interval = setInterval(() => {
          const color = holiColors[Math.floor(Math.random() * holiColors.length)];
          const x = 10 + Math.random() * 80;
          const y = z.yMin + Math.random() * (z.yMax - z.yMin);
          const size = 20 + Math.random() * 25;
          const dur = 1200 + Math.random() * 800;

          // Main burst
          const puff = document.createElement('div'); puff.className = 'bf-powder';
          puff.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:radial-gradient(circle,${color}cc,${color}66 40%,transparent 70%);filter:blur(3px);animation:bfPowderBurst ${dur}ms ease-out forwards;`;
          ctx.container.appendChild(puff);

          // 2-4 wisps drifting out from center
          const numWisps = 2 + Math.floor(Math.random() * 3);
          for (let w = 0; w < numWisps; w++) {
            const wisp = document.createElement('div'); wisp.className = 'bf-powder-wisp';
            const wSz = 8 + Math.random() * 12;
            const angle = Math.random() * Math.PI * 2;
            const dist = 15 + Math.random() * 25;
            const wx = Math.cos(angle) * dist;
            const wy = Math.sin(angle) * dist;
            const wDur = dur * (0.8 + Math.random() * 0.4);
            wisp.style.cssText = `left:${x}%;top:${y}%;width:${wSz}px;height:${wSz}px;--wx:${wx}px;--wy:${wy}px;background:radial-gradient(circle,${color}99,transparent 70%);filter:blur(2px);animation:bfWispDrift ${wDur}ms ease-out forwards;`;
            ctx.container.appendChild(wisp);
            setTimeout(() => wisp.remove(), wDur);
          }

          setTimeout(() => puff.remove(), dur);
        }, 600 + Math.random() * 400);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },

    gulal: {
      name: 'Gulal Cloud', category: 'overlay', zones: ['top','bot'], icon: '🌫️',
      css: `.bf-gulal { position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;mix-blend-mode:multiply; }
        @keyframes bfGulalPulse { 0%,100%{opacity:0.06} 50%{opacity:0.14} }`,
      init(ctx) {
        const holiColors = ['#ff1744','#d500f9','#2979ff','#00e676','#ffea00','#ff9100'];
        const c1 = holiColors[Math.floor(Math.random() * holiColors.length)];
        const c2 = holiColors[Math.floor(Math.random() * holiColors.length)];
        const c3 = holiColors[Math.floor(Math.random() * holiColors.length)];
        const pos = ctx.zone === 'top' ? 'at 30% 20%' : 'at 60% 80%';
        const pos2 = ctx.zone === 'top' ? 'at 70% 35%' : 'at 35% 70%';
        const pos3 = ctx.zone === 'top' ? 'at 50% 10%' : 'at 50% 90%';
        const el = ctx.el('div', 'bf-gulal');
        el.style.background = `radial-gradient(ellipse 50% 40% ${pos},${c1}40,transparent 70%),radial-gradient(ellipse 40% 50% ${pos2},${c2}35,transparent 65%),radial-gradient(ellipse 45% 35% ${pos3},${c3}30,transparent 60%)`;
        el.style.animation = `bfGulalPulse ${6 + Math.random()*3}s ease-in-out infinite`;
      },
      cleanup(ctx) {}
    },

    rangoli: {
      name: 'Rangoli', category: 'overlay', zones: ['top','bot'], icon: '🪷',
      css: `.bf-rangoli { position:absolute;pointer-events:none;z-index:5;opacity:0.7; }
        @keyframes bfRangoliGlow { 0%,100%{filter:drop-shadow(0 0 2px rgba(255,100,200,0.4)) hue-rotate(0deg)} 50%{filter:drop-shadow(0 0 5px rgba(255,200,100,0.5)) hue-rotate(30deg)} }`,
      init(ctx) {
        // SVG rangoli petal mandala
        const holiColors = ['#ff1744','#d500f9','#2979ff','#00e676','#ffea00','#ff9100'];
        function rangoliSVG(size) {
          const c1 = holiColors[Math.floor(Math.random()*holiColors.length)];
          const c2 = holiColors[Math.floor(Math.random()*holiColors.length)];
          const c3 = holiColors[Math.floor(Math.random()*holiColors.length)];
          const c4 = holiColors[Math.floor(Math.random()*holiColors.length)];
          const cx = size/2, cy = size/2;
          let petals = '';
          // Outer ring — 8 teardrop petals
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const r = size * 0.38;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            const rot = (a * 180 / Math.PI) + 90;
            petals += `<ellipse cx="${px}" cy="${py}" rx="${size*0.06}" ry="${size*0.15}" transform="rotate(${rot} ${px} ${py})" fill="${c1}" opacity="0.8"/>`;
          }
          // Middle ring — 8 circles
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + Math.PI/8;
            const r = size * 0.24;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            petals += `<circle cx="${px}" cy="${py}" r="${size*0.045}" fill="${c2}" opacity="0.75"/>`;
          }
          // Inner ring — 6 diamond petals
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const r = size * 0.14;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            const rot = (a * 180 / Math.PI);
            petals += `<rect x="${px-size*0.03}" y="${py-size*0.06}" width="${size*0.06}" height="${size*0.12}" rx="${size*0.015}" transform="rotate(${rot+45} ${px} ${py})" fill="${c3}" opacity="0.7"/>`;
          }
          // Center lotus
          petals += `<circle cx="${cx}" cy="${cy}" r="${size*0.07}" fill="${c4}" opacity="0.85"/>`;
          petals += `<circle cx="${cx}" cy="${cy}" r="${size*0.04}" fill="white" opacity="0.6"/>`;
          // Connecting dots ring
          for (let i = 0; i < 16; i++) {
            const a = (i / 16) * Math.PI * 2;
            const r = size * 0.32;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            petals += `<circle cx="${px}" cy="${py}" r="${size*0.012}" fill="white" opacity="0.5"/>`;
          }
          return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${petals}</svg>`;
        }

        // Scatter random number of rangoli across the zone
        const numRangoli = 3 + Math.floor(Math.random() * 4); // 3-6
        const placed = []; // track positions to avoid too much overlap

        for (let i = 0; i < numRangoli; i++) {
          const size = 28 + Math.floor(Math.random() * 40); // 28-68px

          // Find a position with some spacing
          let x, y, attempts = 0;
          do {
            x = 3 + Math.random() * 75; // keep away from right edge
            if (ctx.zone === 'top') {
              y = 2 + Math.random() * 60;
            } else {
              y = 30 + Math.random() * 62;
            }
            attempts++;
          } while (attempts < 10 && placed.some(p => Math.abs(p.x - x) < 18 && Math.abs(p.y - y) < 18));

          placed.push({x, y});

          const el = document.createElement('div'); el.className = 'bf-rangoli';
          el.innerHTML = rangoliSVG(size);
          const dur = 4 + Math.random() * 4;
          const delay = Math.random() * 2;
          const baseOpacity = 0.5 + Math.random() * 0.35;
          const spin = Math.random() * 360;
          el.style.cssText = `left:${x}%;top:${y}%;opacity:${baseOpacity};transform:rotate(${spin}deg);animation:bfRangoliGlow ${dur}s ${delay}s ease-in-out infinite;`;
          ctx.container.appendChild(el);
        }
      },
      cleanup(ctx) {}
    },

    colorrain: {
      name: 'Color Rain', category: 'particle', zones: ['top','mid','bot'], icon: '🌧️',
      css: `.bf-colorrain { position:absolute;pointer-events:none;border-radius:0 0 2px 2px;opacity:0; }
        @keyframes bfColorRainFall { 0%{transform:translateY(0);opacity:0} 10%{opacity:0.7} 85%{opacity:0.5} 100%{transform:translateY(var(--rain-dist,300px));opacity:0} }`,
      init(ctx) {
        const holiColors = ['#ff1744','#f50057','#d500f9','#651fff','#2979ff','#00e5ff','#00e676','#ffea00','#ff9100','#ff3d00'];
        ctx.interval = setInterval(() => {
          const drop = document.createElement('div'); drop.className = 'bf-colorrain';
          const color = holiColors[Math.floor(Math.random() * holiColors.length)];
          const w = 2 + Math.random() * 2;
          const h = 8 + Math.random() * 14;
          const x = Math.random() * 100;
          const dur = 800 + Math.random() * 1200;
          const dist = 150 + Math.random() * 250;
          drop.style.cssText = `left:${x}%;top:-${h}px;width:${w}px;height:${h}px;--rain-dist:${dist}px;background:linear-gradient(to bottom,transparent,${color}cc,${color});animation:bfColorRainFall ${dur}ms linear forwards;`;
          ctx.container.appendChild(drop);
          setTimeout(() => drop.remove(), dur);
        }, 80 + Math.random() * 60);
      },
      cleanup(ctx) { clearInterval(ctx.interval); ctx.container.innerHTML = ''; }
    },
  },

  presets: {
    'Holi Celebration': ['balloon.mid', 'powder.mid', 'powder.top', 'gulal.top', 'rangoli.top', 'rangoli.bot'],
    'Color Storm': ['colorrain.top', 'colorrain.mid', 'powder.bot', 'gulal.bot', 'rangoli.bot'],
    'Powder Party': ['powder.top', 'powder.mid', 'powder.bot', 'gulal.top', 'gulal.bot'],
  },

  ascii: {}
});
