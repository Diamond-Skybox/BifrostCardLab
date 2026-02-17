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
// @grant        GM_xmlhttpRequest
// @connect      drive-render.corp.amazon.com
// @connect      drive.corp.amazon.com
// ==/UserScript==

(function () {
  'use strict';

  var VERSION = 'BifrostBadge 0.1.0';
  var ROOT = 'REPLACE_WITH_YOUR_DRIVE_URL';
  var MANIFEST_URL  = 'REPLACE_WITH_MANIFEST_URL';
  var BLOCKLIST_URL = 'REPLACE_WITH_BLOCKLIST_URL';
  var FRAMES_URL    = 'REPLACE_WITH_FRAMES_URL';

  // GM_xmlhttpRequest wrappers — bypass CORS
  function gmFetchJSON(url) {
    return new Promise(function(resolve) {
      if (!url) { resolve(null); return; }
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(resp) {
          try { resolve(JSON.parse(resp.responseText)); }
          catch(e) { resolve(null); }
        },
        onerror: function() { resolve(null); }
      });
    });
  }

  function gmFetchText(url) {
    return new Promise(function(resolve) {
      if (!url) { resolve(''); return; }
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(resp) { resolve(resp.responseText || ''); },
        onerror: function() { resolve(''); }
      });
    });
  }

  function applyUserscript() {
    var html = document.querySelector('html');
    var head = document.head;

    html.dataset.userscript = VERSION;
    html.dataset.userscripts = html.dataset.userscripts
      ? html.dataset.userscripts + ',' + VERSION
      : VERSION;

    // Load styles
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = ROOT + '/bifrostbadge.css';
    head.appendChild(style);

    // Fetch all JSON data via GM (CORS-free), then load scripts
    Promise.all([
      gmFetchJSON(MANIFEST_URL),
      gmFetchJSON(BLOCKLIST_URL),
      gmFetchJSON(FRAMES_URL)
    ]).then(function(results) {
      var manifest = results[0];
      var packs = (manifest && manifest.packs) || [];
      var packUrls = packs.map(function(p) { return p.url; }).filter(Boolean);
      var engineUrl = ROOT + '/bifrost-engine.js';

      // Also fetch engine + pack source as text for Lab blob inlining
      var textFetches = [gmFetchText(engineUrl)].concat(
        packUrls.map(function(url) { return gmFetchText(url); })
      );

      return Promise.all(textFetches).then(function(sources) {
        // Store on window so bifrostbadge.js can read them
        window.__bifrostData = {
          root: ROOT,
          engineUrl: engineUrl,
          manifest: manifest,
          blocklist: results[1],
          userFrames: results[2],
          engineSource: sources[0] || '',
          packSources: sources.slice(1)
        };

        // Load engine
        var engine = document.createElement('script');
        engine.type = 'text/javascript';
        engine.src = engineUrl;
        engine.onload = function() {
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
        };
        head.appendChild(engine);
      });
    });

    function loadMain() {
      var main = document.createElement('script');
      main.type = 'text/javascript';
      main.src = ROOT + '/bifrostbadge.js';
      head.appendChild(main);
    }
  }

  if (document && document.head) {
    applyUserscript();
  } else {
    window.addEventListener('DOMContentLoaded', applyUserscript);
  }
})();
