/**
 * BIFROST THEME PACK: ELEMENTAL
 * Forces of nature — rain, snow, fire, water, lava, wind, frost, ember
 */
Bifrost.registerPack({
  id: 'elemental',
  name: 'Elemental',
  version: '1.0.0',
  icon: '🌊',
  description: 'Forces of nature',

  effects: {

    rain: {
      name: 'Rain', category: 'particle', zones: ['top','mid','bot'], icon: '🌧️',
      css: `.bf-rain-drop { position:absolute;top:-15%;width:1px;pointer-events:none;border-radius:0 0 2px 2px; }
        @keyframes bfRainFall { 0%{transform:translateY(0) translateX(0);opacity:0.5;} 100%{transform:translateY(550px) translateX(30px);opacity:0;} }`,
      init(ctx) {
        const p = {top:{h:[6,12],w:[0.5,1],spd:[600,1000],op:[0.15,0.3]},mid:{h:[10,18],w:[0.8,1.5],spd:[700,1200],op:[0.25,0.5]},bot:{h:[14,24],w:[1,2],spd:[900,1500],op:[0.3,0.6]}}[ctx.zone];
        ctx.interval = setInterval(() => {
          const d = document.createElement('div'); d.className = 'bf-rain-drop';
          const h=p.h[0]+Math.random()*(p.h[1]-p.h[0]), w=p.w[0]+Math.random()*(p.w[1]-p.w[0]);
          const spd=p.spd[0]+Math.random()*(p.spd[1]-p.spd[0]), op=p.op[0]+Math.random()*(p.op[1]-p.op[0]);
          d.style.cssText=`left:${Math.random()*110-10}%;height:${h}px;width:${w}px;background:linear-gradient(to bottom,transparent,rgba(170,190,220,${op}));animation:bfRainFall ${spd}ms linear forwards;transform:rotate(8deg);`;
          ctx.container.appendChild(d); setTimeout(()=>d.remove(),spd);
        }, 80);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    snow: {
      name: 'Snow', category: 'particle', zones: ['top','mid','bot'], icon: '❄️',
      css: `.bf-snowflake { position:absolute;top:-5%;border-radius:50%;pointer-events:none;background:rgba(255,255,255,0.9); }
        @keyframes bfSnowFall { 0%{transform:translateY(0);} 100%{transform:translateY(550px);} }
        @keyframes bfSnowSwayA { 0%,100%{margin-left:0} 50%{margin-left:15px} }
        @keyframes bfSnowSwayB { 0%,100%{margin-left:0} 50%{margin-left:-12px} }
        @keyframes bfSnowSwayC { 0%,100%{margin-left:0} 33%{margin-left:10px} 66%{margin-left:-8px} }`,
      init(ctx) {
        const p = {bot:{sz:[3,6],fall:[6000,10000],sway:[3000,5000],rate:600,op:0.7},mid:{sz:[2,4],fall:[5000,8000],sway:[2500,4500],rate:450,op:0.55},top:{sz:[1,2.5],fall:[3500,6000],sway:[2000,3500],rate:350,op:0.35}}[ctx.zone];
        const swayAnims = ['bfSnowSwayA','bfSnowSwayB','bfSnowSwayC'];
        ctx.interval = setInterval(() => {
          const f = document.createElement('div'); f.className = 'bf-snowflake';
          const sz=p.sz[0]+Math.random()*(p.sz[1]-p.sz[0]);
          const fd=p.fall[0]+Math.random()*(p.fall[1]-p.fall[0]);
          const sd=p.sway[0]+Math.random()*(p.sway[1]-p.sway[0]);
          const op=p.op*(0.6+Math.random()*0.4);
          const sw=swayAnims[Math.floor(Math.random()*3)];
          f.style.cssText=`left:${Math.random()*100}%;width:${sz}px;height:${sz}px;opacity:${op};box-shadow:0 0 ${sz}px rgba(200,220,255,${op*0.5});animation:bfSnowFall ${fd}ms linear forwards,${sw} ${sd}ms ${-(Math.random()*sd)}ms ease-in-out infinite;`;
          ctx.container.appendChild(f); setTimeout(()=>f.remove(),fd);
        }, p.rate);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    ember: {
      name: 'Ember', category: 'particle', zones: ['top','mid','bot'], icon: '🔥',
      css: `.bf-ember { position:absolute;border-radius:50%;pointer-events:none; }
        @keyframes bfEmberRise { 0%{opacity:1;transform:translateY(0) scale(1)} 50%{opacity:0.8} 100%{opacity:0;transform:translateY(-500px) scale(0.2)} }
        @keyframes bfEmberDrift { 0%{opacity:0.8;transform:translateY(0) translateX(0) scale(1)} 25%{transform:translateY(-120px) translateX(15px) scale(0.9)} 50%{opacity:0.6;transform:translateY(-250px) translateX(-10px) scale(0.7)} 75%{transform:translateY(-380px) translateX(20px) scale(0.5)} 100%{opacity:0;transform:translateY(-500px) translateX(-5px) scale(0.2)} }
        @keyframes bfEmberSpark { 0%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.8) translateY(-30px)} 100%{opacity:0;transform:scale(0) translateY(-60px)} }`,
      init(ctx) {
        const p = {bot:{sz:[2,5],dur:[2000,4000],rate:500,anim:'bfEmberRise',c:'255,100,20'},mid:{sz:[2,4],dur:[3000,5000],rate:600,anim:'bfEmberDrift',c:'255,130,40'},top:{sz:[1,3],dur:[600,1200],rate:300,anim:'bfEmberSpark',c:'255,180,80'}}[ctx.zone];
        ctx.interval = setInterval(() => {
          const e = document.createElement('div'); e.className = 'bf-ember';
          const sz=p.sz[0]+Math.random()*(p.sz[1]-p.sz[0]), dur=p.dur[0]+Math.random()*(p.dur[1]-p.dur[0]);
          const pos = ctx.zone==='top' ? `top:${20+Math.random()*60}%;left:${Math.random()*100}%` : ctx.zone==='mid' ? `bottom:${Math.random()*30}%;left:${Math.random()*100}%` : `bottom:0;left:${10+Math.random()*80}%`;
          e.style.cssText=`${pos};width:${sz}px;height:${sz}px;background:rgba(${p.c},0.9);box-shadow:0 0 ${sz*3}px rgba(${p.c},0.6);animation:${p.anim} ${dur}ms linear forwards;`;
          ctx.container.appendChild(e); setTimeout(()=>e.remove(),dur);
        }, p.rate);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    frost: {
      name: 'Frost', category: 'overlay', zones: ['top','bot'], icon: '🧊',
      css: `.bf-frost-top { position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(ellipse at 0% 0%,rgba(200,230,255,0.5) 0%,transparent 35%),radial-gradient(ellipse at 100% 0%,rgba(180,220,255,0.45) 0%,transparent 30%),radial-gradient(ellipse at 0% 100%,rgba(200,240,255,0.4) 0%,transparent 30%),radial-gradient(ellipse at 100% 100%,rgba(220,240,255,0.4) 0%,transparent 35%),radial-gradient(ellipse at 50% 0%,rgba(210,230,255,0.2) 0%,transparent 25%);opacity:0.35; }
        .bf-frost-bot { position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(circle at 30% 40%,rgba(180,210,240,0.35) 0%,transparent 40%),radial-gradient(circle at 70% 30%,rgba(170,200,235,0.3) 0%,transparent 35%),radial-gradient(circle at 50% 70%,rgba(190,215,240,0.25) 0%,transparent 45%);opacity:0.25; }`,
      init(ctx) { ctx.el('div', `bf-frost-${ctx.zone}`); },
      cleanup(ctx) {}
    },

    rainbow: {
      name: 'Rainbow', category: 'light', zones: ['top','bot'], icon: '🌈',
      css: `.bf-rainbow { position:absolute;top:-100%;left:-200%;width:150%;height:300%;pointer-events:none;opacity:0;transform:rotate(-25deg);transition:opacity 0.3s ease;background:linear-gradient(90deg,transparent 0%,rgba(255,0,0,0.06) 15%,rgba(255,165,0,0.06) 25%,rgba(255,255,0,0.06) 35%,rgba(0,255,0,0.06) 45%,rgba(0,150,255,0.06) 55%,rgba(100,0,255,0.06) 65%,transparent 80%);animation:bfRainbowSweep 6s ease-in-out infinite; }
        @keyframes bfRainbowSweep { 0%,100%{transform:rotate(-25deg) translateX(-40%);opacity:0;} 20%,80%{opacity:1;} 50%{transform:rotate(-25deg) translateX(80%);opacity:1;} }`,
      init(ctx) { ctx.el('div','bf-rainbow'); },
      cleanup(ctx) {}
    },

    waterline: {
      name: 'Waterline', category: 'environment', zones: ['mid'], icon: '🌊',
      css: `.bf-waterline-body { position:absolute;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(20,80,140,0.0) 0%,rgba(20,80,140,0.15) 3%,rgba(15,60,120,0.3) 15%,rgba(10,45,100,0.4) 40%,rgba(8,35,80,0.5) 100%);transition:height 0.4s ease-out; }
        .bf-waterline-surface { position:absolute;left:-10%;right:-10%;height:12px;transition:top 0.4s ease-out; }
        .bf-waterline-surface svg { width:120%;height:100%;position:absolute;left:0;top:0; }
        .bf-waterline-caustics { position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 30% 20% at 30% 30%,rgba(80,180,255,0.08) 0%,transparent 70%),radial-gradient(ellipse 25% 25% at 70% 50%,rgba(80,180,255,0.06) 0%,transparent 70%),radial-gradient(ellipse 20% 30% at 50% 70%,rgba(100,200,255,0.05) 0%,transparent 70%);animation:bfCausticShift 6s ease-in-out infinite alternate; }
        @keyframes bfCausticShift { 0%{transform:translateX(-3%) translateY(-2%)} 100%{transform:translateX(3%) translateY(2%)} }`,
      init(ctx) {
        const wl = 42;
        const body = document.createElement('div'); body.className='bf-waterline-body'; body.style.height=`${100-wl}%`; ctx.container.appendChild(body);
        const caustics = document.createElement('div'); caustics.className='bf-waterline-caustics'; body.appendChild(caustics);
        const surface = document.createElement('div'); surface.className='bf-waterline-surface'; surface.style.top=`${wl}%`;
        const svgNS='http://www.w3.org/2000/svg', svg=document.createElementNS(svgNS,'svg');
        svg.setAttribute('viewBox','0 0 400 20'); svg.setAttribute('preserveAspectRatio','none');
        const p1=document.createElementNS(svgNS,'path'); p1.setAttribute('fill','rgba(20,80,140,0.15)'); svg.appendChild(p1);
        const p2=document.createElementNS(svgNS,'path'); p2.setAttribute('fill','rgba(15,60,120,0.1)'); svg.appendChild(p2);
        surface.appendChild(svg); ctx.container.appendChild(surface);
        let phase=0,tx=0,ty=0;
        ctx.interval = setInterval(()=>{
          const ntx=parseFloat(ctx.card.style.getPropertyValue('--tilt-x'))||0;
          const nty=parseFloat(ctx.card.style.getPropertyValue('--tilt-y'))||0;
          tx+=(ntx-tx)*0.08; ty+=(nty-ty)*0.08; phase+=0.04;
          let d='M0,10'; for(let i=0;i<=400;i+=5){const y=10+Math.sin((i*0.025)+phase)*3+Math.sin((i*0.04)+phase*1.3)*1.5+tx*Math.sin((i*0.015)+phase*0.5)*4;d+=` L${i},${y}`;} d+=' L400,20 L0,20 Z'; p1.setAttribute('d',d);
          let d2='M0,12'; for(let i=0;i<=400;i+=5){const y=12+Math.sin((i*0.02)+phase*0.7+1)*2+Math.sin((i*0.035)+phase*1.1+2)*1+tx*Math.sin((i*0.012)+phase*0.4+1)*3;d2+=` L${i},${y}`;} d2+=' L400,20 L0,20 Z'; p2.setAttribute('d',d2);
          const ls=ty*8, nl=wl+ls; surface.style.top=`${nl}%`; body.style.height=`${100-nl}%`; surface.style.transform=`translateX(${tx*5}px)`;
        },33);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    lava: {
      name: 'Lava', category: 'environment', zones: ['mid'], icon: '🌋',
      css: `.bf-lava-body { position:absolute;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(180,40,0,0.0) 0%,rgba(180,40,0,0.2) 3%,rgba(140,20,0,0.35) 15%,rgba(100,10,0,0.5) 40%,rgba(60,5,0,0.65) 100%);transition:height 0.4s ease-out; }
        .bf-lava-caustics { position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 35% 25% at 25% 35%,rgba(255,120,0,0.15) 0%,transparent 70%),radial-gradient(ellipse 25% 30% at 65% 55%,rgba(255,80,0,0.12) 0%,transparent 70%),radial-gradient(ellipse 30% 20% at 45% 75%,rgba(255,160,0,0.1) 0%,transparent 70%);animation:bfLavaCaustic 4s ease-in-out infinite alternate; }
        @keyframes bfLavaCaustic { 0%{transform:translateX(-2%) translateY(-1%);opacity:0.8} 100%{transform:translateX(2%) translateY(1%);opacity:1} }`,
      init(ctx) {
        const ll=55;
        const body=document.createElement('div'); body.className='bf-lava-body'; body.style.height=`${100-ll}%`; ctx.container.appendChild(body);
        const caustics=document.createElement('div'); caustics.className='bf-lava-caustics'; body.appendChild(caustics);
        const surface=document.createElement('div'); surface.className='bf-waterline-surface'; surface.style.top=`${ll}%`;
        const svgNS='http://www.w3.org/2000/svg', svg=document.createElementNS(svgNS,'svg');
        svg.setAttribute('viewBox','0 0 400 20'); svg.setAttribute('preserveAspectRatio','none');
        const p1=document.createElementNS(svgNS,'path'); p1.setAttribute('fill','rgba(200,60,0,0.25)'); svg.appendChild(p1);
        const p2=document.createElementNS(svgNS,'path'); p2.setAttribute('fill','rgba(255,120,0,0.15)'); svg.appendChild(p2);
        const p3=document.createElementNS(svgNS,'path'); p3.setAttribute('fill','none'); p3.setAttribute('stroke','rgba(255,160,0,0.4)'); p3.setAttribute('stroke-width','1.5'); svg.appendChild(p3);
        surface.appendChild(svg); ctx.container.appendChild(surface);
        let phase=0,tx=0,ty=0;
        ctx.interval = setInterval(()=>{
          const ntx=parseFloat(ctx.card.style.getPropertyValue('--tilt-x'))||0;
          const nty=parseFloat(ctx.card.style.getPropertyValue('--tilt-y'))||0;
          tx+=(ntx-tx)*0.06; ty+=(nty-ty)*0.06; phase+=0.025;
          let d='M0,10'; for(let i=0;i<=400;i+=5){const y=10+Math.sin((i*0.018)+phase)*4+Math.sin((i*0.03)+phase*0.8)*2+tx*Math.sin((i*0.012)+phase*0.3)*3;d+=` L${i},${y}`;} d+=' L400,20 L0,20 Z'; p1.setAttribute('d',d);
          let d2='M0,11'; for(let i=0;i<=400;i+=5){const y=11+Math.sin((i*0.015)+phase*0.6+1.5)*3+Math.sin((i*0.025)+phase*0.9+0.8)*1.5+tx*Math.sin((i*0.01)+phase*0.3+1)*2.5;d2+=` L${i},${y}`;} d2+=' L400,20 L0,20 Z'; p2.setAttribute('d',d2);
          let d3='M0,10'; for(let i=0;i<=400;i+=5){const y=10+Math.sin((i*0.018)+phase)*4+Math.sin((i*0.03)+phase*0.8)*2+tx*Math.sin((i*0.012)+phase*0.3)*3;d3+=` L${i},${y}`;} p3.setAttribute('d',d3);
          const ls=ty*6, nl=ll+ls; surface.style.top=`${nl}%`; body.style.height=`${100-nl}%`; surface.style.transform=`translateX(${tx*3}px)`;
        },40);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    windsurf: {
      name: 'Wind Surface', category: 'environment', zones: ['mid'], icon: '💨',
      css: `.bf-wind-streak { position:absolute;height:1px;pointer-events:none;border-radius:0 2px 2px 0;opacity:0; }
        @keyframes bfWindGust { 0%{left:-15%;opacity:0} 10%{opacity:0.6} 50%{opacity:0.4} 90%{opacity:0.2} 100%{left:110%;opacity:0} }`,
      init(ctx) {
        ctx.interval = setInterval(() => {
          const s=document.createElement('div'); s.className='bf-wind-streak';
          const w=30+Math.random()*60, y=5+Math.random()*35, dur=1.5+Math.random()*2;
          const thick=Math.random()<0.3?2:1, curve=(Math.random()-0.5)*20, op=0.15+Math.random()*0.3;
          s.style.cssText=`top:${y}%;width:${w}px;height:${thick}px;background:linear-gradient(to right,transparent,rgba(200,220,255,${op}) 20%,rgba(220,235,255,${op*1.2}) 50%,rgba(200,220,255,${op*0.6}) 80%,transparent);animation:bfWindGust ${dur}s ease-in-out forwards;`;
          s.animate([{transform:'translateY(0px)'},{transform:`translateY(${curve}px)`},{transform:`translateY(${curve*0.6}px)`}],{duration:dur*1000,easing:'ease-in-out'});
          ctx.container.appendChild(s); setTimeout(()=>s.remove(),dur*1000);
        }, 400+Math.random()*300);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    windfull: {
      name: 'Wind Full', category: 'environment', zones: ['mid'], icon: '🌬️',
      css: `/* reuses bf-wind-streak and bfWindGust from windsurf */`,
      init(ctx) {
        ctx.interval = setInterval(() => {
          const s=document.createElement('div'); s.className='bf-wind-streak';
          const w=25+Math.random()*70, y=5+Math.random()*90, dur=1.2+Math.random()*2.5;
          const thick=Math.random()<0.25?2:1, curve=(Math.random()-0.5)*30, op=0.12+Math.random()*0.25;
          s.style.cssText=`top:${y}%;width:${w}px;height:${thick}px;background:linear-gradient(to right,transparent,rgba(200,220,255,${op}) 20%,rgba(220,235,255,${op*1.2}) 50%,rgba(200,220,255,${op*0.6}) 80%,transparent);animation:bfWindGust ${dur}s ease-in-out forwards;`;
          s.animate([{transform:'translateY(0px)'},{transform:`translateY(${curve}px)`},{transform:`translateY(${curve*0.5}px)`}],{duration:dur*1000,easing:'ease-in-out'});
          ctx.container.appendChild(s); setTimeout(()=>s.remove(),dur*1000);
        }, 300+Math.random()*250);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    flameedge: {
      name: 'Flame Edge', category: 'environment', zones: ['mid','bot'], icon: '🔥',
      css: `.bf-flame { position:absolute;pointer-events:none;border-radius:50% 50% 50% 50%/60% 60% 40% 40%; }
        @keyframes bfFlameFlicker1 { 0%,100%{transform:scaleY(1) scaleX(1);opacity:0.8} 25%{transform:scaleY(0.7) scaleX(1.1);opacity:0.6} 50%{transform:scaleY(1.1) scaleX(0.85);opacity:0.9} 75%{transform:scaleY(0.8) scaleX(1.05);opacity:0.7} }
        @keyframes bfFlameFlicker2 { 0%,100%{transform:scaleY(0.9) scaleX(1);opacity:0.7} 33%{transform:scaleY(1.15) scaleX(0.9);opacity:0.9} 66%{transform:scaleY(0.75) scaleX(1.1);opacity:0.6} }
        @keyframes bfFlameFlicker3 { 0%,100%{transform:scaleY(1) scaleX(0.95);opacity:0.85} 50%{transform:scaleY(0.8) scaleX(1.1);opacity:0.65} }`,
      init(ctx) {
        const flameCount = 12;
        for(let i=0;i<flameCount;i++){
          const f=document.createElement('div'); f.className='bf-flame';
          const w=8+Math.random()*15, h=15+Math.random()*25;
          const left=(i/flameCount)*100+Math.random()*5;
          const anim=['bfFlameFlicker1','bfFlameFlicker2','bfFlameFlicker3'][Math.floor(Math.random()*3)];
          const dur=0.3+Math.random()*0.6;
          f.style.cssText=`bottom:0;left:${left}%;width:${w}px;height:${h}px;background:linear-gradient(to top,rgba(255,80,0,0.8),rgba(255,160,0,0.5) 40%,rgba(255,200,50,0.2) 70%,transparent);filter:blur(1px);animation:${anim} ${dur}s ease-in-out infinite;animation-delay:${Math.random()*0.5}s;`;
          ctx.container.appendChild(f);
        }
      },
      cleanup(ctx) {}
    },

    flamering: {
      name: 'Flame Ring', category: 'environment', zones: ['mid','bot'], icon: '🔥',
      css: `/* reuses bf-flame and flicker keyframes from flameedge */`,
      init(ctx) {
        const sides = ['bottom','left','right','top'];
        for(const side of sides){
          for(let i=0;i<6;i++){
            const f=document.createElement('div'); f.className='bf-flame';
            const w=6+Math.random()*12, h=12+Math.random()*20;
            const anim=['bfFlameFlicker1','bfFlameFlicker2','bfFlameFlicker3'][Math.floor(Math.random()*3)];
            const dur=0.3+Math.random()*0.6;
            let pos='';
            if(side==='bottom') pos=`bottom:0;left:${(i/6)*100}%`;
            else if(side==='top') pos=`top:0;left:${(i/6)*100}%;transform:rotate(180deg)`;
            else if(side==='left') pos=`left:0;top:${(i/6)*100}%;transform:rotate(90deg)`;
            else pos=`right:0;top:${(i/6)*100}%;transform:rotate(-90deg)`;
            f.style.cssText=`${pos};width:${w}px;height:${h}px;background:linear-gradient(to top,rgba(255,80,0,0.8),rgba(255,160,0,0.5) 40%,rgba(255,200,50,0.2) 70%,transparent);filter:blur(1px);animation:${anim} ${dur}s ease-in-out infinite;animation-delay:${Math.random()*0.5}s;position:absolute;pointer-events:none;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;`;
            ctx.container.appendChild(f);
          }
        }
      },
      cleanup(ctx) {}
    },

    cssfire: {
      name: 'CSS Fire Edge', category: 'environment', zones: ['mid','bot'], icon: '🔥',
      css: `.bf-cssfire { position:absolute;pointer-events:none; }
        .bf-cssfire .fire-big { position:absolute;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;filter:blur(3px);animation:bfCSSFireBig 0.8s ease-in-out infinite alternate; }
        @keyframes bfCSSFireBig { 0%{transform:scaleX(1) scaleY(1) translateY(0)} 25%{transform:scaleX(0.85) scaleY(1.1) translateY(-3px)} 50%{transform:scaleX(1.1) scaleY(0.9) translateY(-1px)} 75%{transform:scaleX(0.9) scaleY(1.05) translateY(-4px)} 100%{transform:scaleX(1.05) scaleY(0.95) translateY(-2px)} }
        .bf-cssfire .fire-inner { position:absolute;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;filter:blur(2px);animation:bfCSSFireInner 0.6s ease-in-out infinite alternate; }
        @keyframes bfCSSFireInner { 0%{transform:scaleX(1) scaleY(1)} 50%{transform:scaleX(0.8) scaleY(1.15) translateY(-2px)} 100%{transform:scaleX(1.1) scaleY(0.9) translateY(-1px)} }
        .bf-cssfire .fire-spark { position:absolute;width:2px;height:2px;border-radius:50%;background:#ffdd44;filter:blur(0.5px); }
        @keyframes bfCSSFireSpark { 0%{opacity:1;transform:translateY(0) translateX(0) scale(1)} 100%{opacity:0;transform:translateY(-40px) translateX(var(--sx,5px)) scale(0.3)} }
        .bf-cssfire .fire-glow { position:absolute;border-radius:50%;filter:blur(8px);opacity:0.3;animation:bfCSSFireGlow 1.5s ease-in-out infinite alternate; }
        @keyframes bfCSSFireGlow { 0%{opacity:0.2;transform:scaleX(1)} 100%{opacity:0.35;transform:scaleX(1.1)} }`,
      init(ctx) {
        const fireCount = 8;
        for(let i=0;i<fireCount;i++){
          const group=document.createElement('div'); group.className='bf-cssfire';
          const x=(i/fireCount)*100+Math.random()*5;
          group.style.cssText=`bottom:0;left:${x}%;`;
          const big=document.createElement('div'); big.className='fire-big';
          const bw=12+Math.random()*8, bh=20+Math.random()*15;
          big.style.cssText=`bottom:0;left:${-bw/2}px;width:${bw}px;height:${bh}px;background:linear-gradient(to top,rgba(255,80,0,0.9),rgba(255,140,0,0.6) 50%,rgba(255,200,50,0.2) 80%,transparent);`;
          group.appendChild(big);
          const inner=document.createElement('div'); inner.className='fire-inner';
          const iw=bw*0.5, ih=bh*0.6;
          inner.style.cssText=`bottom:0;left:${-iw/2}px;width:${iw}px;height:${ih}px;background:linear-gradient(to top,rgba(255,220,100,0.9),rgba(255,180,50,0.5) 60%,transparent);`;
          group.appendChild(inner);
          const glow=document.createElement('div'); glow.className='fire-glow';
          glow.style.cssText=`bottom:-5px;left:${-bw}px;width:${bw*2}px;height:${bh*0.4}px;background:rgba(255,100,0,0.4);`;
          group.appendChild(glow);
          ctx.container.appendChild(group);
        }
        // Sparks
        ctx.interval = setInterval(()=>{
          const spark=document.createElement('div'); spark.className='fire-spark';
          const sx=(Math.random()-0.5)*10;
          spark.style.cssText=`bottom:5px;left:${Math.random()*100}%;--sx:${sx}px;animation:bfCSSFireSpark ${0.5+Math.random()*0.5}s ease-out forwards;position:absolute;width:2px;height:2px;border-radius:50%;background:#ffdd44;filter:blur(0.5px);`;
          ctx.container.appendChild(spark);
          setTimeout(()=>spark.remove(),1000);
        },200);
      },
      cleanup(ctx) { clearInterval(ctx.interval); }
    },

    // ─── TEXT ─────────────────────────────────────────────
    'text-wave': {
      name: 'Wave', category: 'text', type: 'text', textClass: 'text-wave', icon: '🌊',
      css: `.text-wave .game-title, .text-wave .bf-badge-name { display:inline-block;animation:bfTextWave 2s ease-in-out infinite; }
        @keyframes bfTextWave { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-3px) rotate(-0.5deg)} 75%{transform:translateY(3px) rotate(0.5deg)} }`,
    },
    'text-shadow-rise': {
      name: 'Shadow Rise', category: 'text', type: 'text', textClass: 'text-shadow-rise', icon: '🌅',
      css: `.text-shadow-rise .game-title, .text-shadow-rise .bf-badge-name { animation:bfShadowRise 3s ease-in-out infinite; }
        .text-shadow-rise .platform-tag, .text-shadow-rise .bf-badge-alias { animation:bfShadowRise 3s ease-in-out infinite 0.2s; }
        @keyframes bfShadowRise { 0%,100%{text-shadow:0 1px 3px rgba(0,0,0,0.4);transform:translateY(0)} 50%{text-shadow:0 8px 20px rgba(0,0,0,0.6),0 0 30px rgba(100,180,255,0.3),0 0 60px rgba(100,180,255,0.1);transform:translateY(-2px)} }`,
    },
    'text-rainbow': {
      name: 'Rainbow', category: 'text', type: 'text', textClass: 'text-rainbow', icon: '🌈',
      css: `.text-rainbow .game-title, .text-rainbow .bf-badge-name { background:linear-gradient(90deg,#e94560,#f59e0b,#00ff88,#54a0ff,#e94560);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:bfTextRainbow 4s linear infinite; }
        @keyframes bfTextRainbow { 0%{background-position:0%} 100%{background-position:200%} }`,
    },
  },

  // ─── ASCII ANIMATIONS (elemental themed) ───────────────
  ascii: {
    heartrate: {
      label: 'Heartrate', icon: '💓',
      frames: ['  ____  ',' _/  \\_ ','_/    \\_','/  /\\  \\','  /  \\  ',' /    \\ ','/      \\','________'],
      speed: 150
    },
    explosion: {
      label: 'Explosion', icon: '💥',
      frames: ['   .   ','   :   ','   o   ','  (o)  ',' ((o)) ','(((o)))',' ((X)) ','((XXX))','(XXXXX)','<*****>','**   **','*     *','.     .','       '],
      speed: 80
    },
  },

  // ─── PRESETS ───────────────────────────────────────────
  presets: {
    'Ocean Storm': ['waterline.mid', 'windsurf.mid', 'rain.mid', 'rain.top'],
    'Blizzard': ['snow.bot', 'snow.mid', 'snow.top', 'frost.top', 'windfull.mid'],
    'Hellscape': ['lava.mid', 'ember.bot', 'ember.mid', 'flameedge.bot'],
    'Gentle Rain': ['rain.bot', 'rainbow.top'],
  }
});
