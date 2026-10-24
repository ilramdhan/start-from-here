// start-from-here site — i18n, theme, tabs, copy buttons, mobile nav. Vanilla JS, no dependencies.
(function () {
  'use strict';

  var LANGS = ['en', 'id', 'zh-CN', 'es', 'ja', 'pt-BR'];
  var OG_LOCALE = { en: 'en_US', id: 'id_ID', 'zh-CN': 'zh_CN', es: 'es_ES', ja: 'ja_JP', 'pt-BR': 'pt_BR' };
  var LS_LANG = 'sfh-lang';
  var LS_THEME = 'sfh-theme';
  var dict = {};
  var fallback = {};
  var cache = {};

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
    return null;
  }

  function lookup(obj, key) {
    return key.split('.').reduce(function (o, k) { return o && typeof o === 'object' ? o[k] : undefined; }, obj);
  }

  /** Translate a key with the current dictionary, falling back to English. */
  function t(key) {
    var v = lookup(dict, key);
    if (typeof v !== 'string') v = lookup(fallback, key);
    return typeof v === 'string' ? v : null;
  }

  function normalize(code) {
    if (!code) return null;
    var lower = String(code).toLowerCase();
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].toLowerCase() === lower) return LANGS[i];
    var base = lower.split('-')[0];
    if (base === 'zh') return 'zh-CN';
    if (base === 'pt') return 'pt-BR';
    for (var j = 0; j < LANGS.length; j++) if (LANGS[j].toLowerCase() === base) return LANGS[j];
    return null;
  }

  function initialLang() {
    var params = new URLSearchParams(location.search);
    var fromUrl = normalize(params.get('lang'));
    if (fromUrl) return fromUrl;
    var saved = normalize(store(LS_LANG));
    if (saved) return saved;
    var navs = navigator.languages || [navigator.language];
    for (var i = 0; i < navs.length; i++) {
      var n = normalize(navs[i]);
      if (n) return n;
    }
    return 'en';
  }

  function load(code) {
    if (cache[code]) return Promise.resolve(cache[code]);
    return fetch('i18n/' + code + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { cache[code] = j; return j; });
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length < 2) return;
        var v = t(p[1].trim());
        if (v !== null) el.setAttribute(p[0].trim(), v);
      });
    });
    fitDiagramLabels();
    document.querySelectorAll('.copy-btn').forEach(function (b) {
      if (!b.classList.contains('done')) b.textContent = t('a11y.copy') || 'Copy';
      b.setAttribute('aria-label', t('a11y.copy_label') || 'Copy command to clipboard');
    });
  }

  /** Shrink SVG phase labels that would overflow their box (box width minus padding). */
  function fitDiagramLabels() {
    document.querySelectorAll('.d-label text').forEach(function (el) {
      el.style.fontSize = '';
      if (typeof el.getComputedTextLength !== 'function') return;
      var x = Number(el.getAttribute('x'));
      var max = (x === 120 ? 160 : 200) - 16;
      var len = el.getComputedTextLength();
      if (len > max) el.style.fontSize = Math.max(10, Math.floor(17 * max / len)) + 'px';
    });
  }

  function setLang(code, opts) {
    opts = opts || {};
    return Promise.all([load('en'), load(code)])
      .then(function (r) {
        fallback = r[0];
        dict = r[1];
        var html = document.documentElement;
        html.lang = code;
        html.dir = 'ltr';
        apply();
        var og = document.querySelector('meta[property="og:locale"]');
        if (og) og.setAttribute('content', OG_LOCALE[code] || 'en_US');
        var sel = document.getElementById('lang-select');
        if (sel) sel.value = code;
        if (opts.persist) store(LS_LANG, code);
        if (opts.updateUrl) {
          var url = new URL(location.href);
          if (code === 'en') url.searchParams.delete('lang'); else url.searchParams.set('lang', code);
          history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
      })
      .catch(function () {
        // Offline or missing dictionary: keep the English text already in the HTML.
      });
  }

  // ---------- theme ----------
  function currentTheme() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var sync = function () { btn.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false'); };
    sync();
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store(LS_THEME, next);
      sync();
    });
  }

  // ---------- tabs (WAI-ARIA tabs pattern, automatic activation) ----------
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabs.forEach(function (tb) {
          var on = tb === tab;
          tb.setAttribute('aria-selected', on ? 'true' : 'false');
          tb.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(tb.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(tab, false);
          try { history.replaceState(null, '', '#' + tab.id.replace(/^tab-/, 'install-')); } catch (e) {}
        });
        tab.addEventListener('keydown', function (e) {
          var k = e.key, n = null;
          if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
          else if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (k === 'Home') n = tabs[0];
          else if (k === 'End') n = tabs[tabs.length - 1];
          if (n) { e.preventDefault(); select(n, true); }
        });
      });
      // Deep link: #install-claude selects the Claude Code tab.
      var m = location.hash.match(/^#install-([\w-]+)$/);
      if (m) {
        var target = document.getElementById('tab-' + m[1]);
        if (target) {
          select(target, false);
          var sec = document.getElementById('install');
          if (sec) sec.scrollIntoView();
        }
      }
    });
  }

  // ---------- copy buttons ----------
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1600);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }
  function initCopy() {
    document.querySelectorAll('pre.code').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = (code ? code.textContent : pre.textContent).replace(/\s+$/, '');
        copyText(text).then(function () {
          btn.classList.add('done');
          btn.textContent = t('a11y.copied') || 'Copied!';
          toast(t('a11y.copied') || 'Copied!');
          setTimeout(function () { btn.classList.remove('done'); btn.textContent = t('a11y.copy') || 'Copy'; }, 1600);
        }, function () {
          toast(t('a11y.copy_failed') || 'Press Ctrl+C to copy');
          var range = document.createRange();
          range.selectNodeContents(code || pre);
          var s = window.getSelection();
          s.removeAllRanges();
          s.addRange(range);
        });
      });
      pre.appendChild(btn);
    });
  }

  // ---------- mobile nav ----------
  function initNav() {
    var btn = document.querySelector('.menu-btn');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    var close = function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); }
    });
    // highlight the current section
    if ('IntersectionObserver' in window) {
      var links = {};
      nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && links[en.target.id]) {
            Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
            links[en.target.id].setAttribute('aria-current', 'true');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  function initVersion() {
    var el = document.getElementById('site-version');
    if (!el) return;
    fetch('build.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.version) el.textContent = 'v' + j.version; })
      .catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initTabs();
    initCopy();
    initNav();
    initVersion();
    var sel = document.getElementById('lang-select');
    if (sel) sel.addEventListener('change', function () { setLang(sel.value, { persist: true, updateUrl: true }); });
    setLang(initialLang(), { persist: false, updateUrl: false });
  });
})();
