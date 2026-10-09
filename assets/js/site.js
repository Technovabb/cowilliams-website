// C.O. Williams website: menus, service-aware quote form, project filters and preview notes.
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Drop-down menus (Services, About): click or keyboard; hover also works on desktop via CSS
  var subs = document.querySelectorAll('.has-sub');
  function closeSubs(except) {
    subs.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('is-open');
      var b = li.querySelector('.nav-top');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  subs.forEach(function (li) {
    var btn = li.querySelector('.nav-top');
    btn.addEventListener('click', function () {
      var open = !li.classList.contains('is-open');
      closeSubs(li);
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.has-sub')) closeSubs(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openLi = document.querySelector('.has-sub.is-open');
      closeSubs();
      if (openLi) openLi.querySelector('.nav-top').focus();
    }
  });

  // Quote form: show only the job-details fields for the chosen service
  var form = document.getElementById('quote-form');
  var jobs = form ? form.querySelectorAll('.job') : [];
  function showService(service) {
    if (!form) return;
    var radio = form.querySelector('input[name="service"][value="' + service + '"]');
    if (!radio) return;
    radio.checked = true;
    jobs.forEach(function (set) {
      var on = set.getAttribute('data-for') === service;
      set.hidden = !on;
      set.disabled = !on;
    });
  }
  function pick(selectId, want, startsWith) {
    var select = document.getElementById(selectId);
    if (!select || !want) return;
    want = want.toLowerCase();
    for (var i = 0; i < select.options.length; i++) {
      var t = select.options[i].text.toLowerCase();
      if (startsWith ? t.indexOf(want) === 0 : t === want) { select.selectedIndex = i; return; }
    }
  }
  function goToQuote() {
    var target = document.getElementById('quote');
    if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  if (form) {
    form.addEventListener('change', function (e) { if (e.target.name === 'service') showService(e.target.value); });
    var checked = form.querySelector('input[name="service"]:checked');
    showService(checked ? checked.value : 'rental');
    // Links from other pages can pre-fill the form: contact.html?service=rental&machine=Bulldozer#quote
    var q = new URLSearchParams(location.search);
    if (q.get('service')) showService(q.get('service'));
    if (q.get('machine')) { showService('rental'); pick('r-machine', q.get('machine'), true); }
    if (q.get('material')) { showService('quarry'); pick('q-material', q.get('material'), false); }
  }

  // Buttons and chips that pick a service on a page that has the form
  document.querySelectorAll('[data-service]').forEach(function (el) {
    el.addEventListener('click', function () { showService(el.getAttribute('data-service')); });
  });
  document.querySelectorAll('[data-machine]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!form) return; // without a form on the page, the element's own link is followed
      e.preventDefault();
      showService('rental'); pick('r-machine', el.getAttribute('data-machine'), true); goToQuote();
    });
  });
  document.querySelectorAll('[data-material]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!form) return;
      e.preventDefault();
      showService('quarry'); pick('q-material', el.getAttribute('data-material'), false); goToQuote();
    });
  });

  // Preview only: forms do not send anything yet
  document.querySelectorAll('form[data-preview-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = f.querySelector('.form-error');
      var missing = Array.prototype.filter.call(f.querySelectorAll('[data-required]'), function (el) { return !el.disabled && !el.value.trim(); });
      var phone = f.elements.phone ? f.elements.phone.value.trim() : 'x';
      var email = f.elements.email ? f.elements.email.value.trim() : 'x';
      if (missing.length || (!phone && !email)) {
        err.textContent = missing.length ? 'Please fill in: ' + missing.map(function (el) { return (f.querySelector('label[for="' + el.id + '"]') || {}).textContent || el.name; }).join(', ').replace(/\s+/g, ' ') + '.' : 'Please add a phone number or email so we can reply.';
        err.hidden = false;
        (missing[0] || f.elements.phone).focus();
        return;
      }
      err.hidden = true;
      f.hidden = true;
      var done = document.getElementById(f.getAttribute('data-done'));
      if (done) { done.hidden = false; done.focus(); }
    });
  });

  // Project portfolio filters
  var filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-tags]');
    var count = document.querySelector('[data-filter-count]');
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (!b) return;
      filterBar.querySelectorAll('button[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var f = b.getAttribute('data-filter');
      var shown = 0;
      cards.forEach(function (c) {
        var on = f === 'all' || c.getAttribute('data-tags').split(' ').indexOf(f) > -1;
        c.hidden = !on; if (on) shown++;
      });
      if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
    });
  }

  // Links to things still waiting on the client
  var toast = document.getElementById('toast');
  var toastTimer;
  document.querySelectorAll('.soon').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (!toast) return;
      toast.textContent = el.getAttribute('data-soon') || 'This comes later in the build.';
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.hidden = true; }, 4000);
    });
  });

  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
