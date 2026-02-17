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

    // Load BifrostBadge script
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = ROOT + '/bifrostbadge.js';
    head.appendChild(script);
  };

  if (document && document.head) {
    applyUserscript();
  } else {
    window.addEventListener('DOMContentLoaded', applyUserscript);
  }
})();
