// ==UserScript==
// @name         BifrostBadge
// @namespace    bifrost-card-effects
// @version      0.1.0
// @description  Bifrost Card Effects for employee badges
// @author       xburton
// @match        REPLACE_WITH_MATCH_URL_1
// @match        REPLACE_WITH_MATCH_URL_2
// @match        REPLACE_WITH_MATCH_URL_3
// @updateURL    REPLACE_WITH_YOUR_DRIVE_URL/bifrostbadge-loader.user.js
// @downloadURL  REPLACE_WITH_YOUR_DRIVE_URL/bifrostbadge-loader.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  var VERSION = 'BifrostBadge 0.1.0';
  var ROOT = 'REPLACE_WITH_YOUR_DRIVE_URL';
  var MANIFEST = 'REPLACE_WITH_YOUR_DRIVE_URL/pack_manifest.json';

  var applyUserscript = function() {
    var html = document.querySelector('html');
    var head = document.head;

    html.dataset.userscript = VERSION;
    html.dataset.userscripts = html.dataset.userscripts
      ? html.dataset.userscripts + ',' + VERSION
      : VERSION;

    // Load BifrostBadge styles
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = ROOT + '/bifrostbadge.css';
    head.appendChild(style);

    // Load Bifrost engine first
    var engine = document.createElement('script');
    engine.type = 'text/javascript';
    engine.src = ROOT + '/bifrost-engine.js';
    engine.onload = function() {
      // Fetch pack manifest, then load packs, then main script
      fetch(MANIFEST, { credentials: 'include' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var packUrls = (data.packs || []).map(function(p) { return p.url; }).filter(Boolean);
          if (packUrls.length === 0) return loadMain();

          var loaded = 0;
          packUrls.forEach(function(url) {
            var pack = document.createElement('script');
            pack.type = 'text/javascript';
            pack.src = url;
            pack.onload = function() { if (++loaded >= packUrls.length) loadMain(); };
            pack.onerror = function() { if (++loaded >= packUrls.length) loadMain(); };
            head.appendChild(pack);
          });
        })
        .catch(function() {
          console.warn('[BifrostBadge] Failed to load pack manifest — loading without packs');
          loadMain();
        });
    };
    head.appendChild(engine);

    function loadMain() {
      var main = document.createElement('script');
      main.type = 'text/javascript';
      main.src = ROOT + '/bifrostbadge.js';
      head.appendChild(main);
    }
  };

  if (document && document.head) {
    applyUserscript();
  } else {
    window.addEventListener('DOMContentLoaded', applyUserscript);
  }
})();
