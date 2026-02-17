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

    // Load Bifrost engine first, then packs, then main script
    var engine = document.createElement('script');
    engine.type = 'text/javascript';
    engine.src = ROOT + '/bifrost-engine.js';
    engine.onload = function() {
      // Load packs in parallel, then main script when all done
      var packFiles = ['cyberpunk.pack.js', 'elemental.pack.js', 'ascii-classics.pack.js'];
      var loaded = 0;

      function onPackLoaded() {
        loaded++;
        if (loaded >= packFiles.length) {
          // All packs loaded — now load main script
          var main = document.createElement('script');
          main.type = 'text/javascript';
          main.src = ROOT + '/bifrostbadge.js';
          head.appendChild(main);
        }
      }

      packFiles.forEach(function(file) {
        var pack = document.createElement('script');
        pack.type = 'text/javascript';
        pack.src = ROOT + '/' + file;
        pack.onload = onPackLoaded;
        pack.onerror = onPackLoaded; // Don't block on missing packs
        head.appendChild(pack);
      });
    };
    head.appendChild(engine);
  };

  if (document && document.head) {
    applyUserscript();
  } else {
    window.addEventListener('DOMContentLoaded', applyUserscript);
  }
})();
