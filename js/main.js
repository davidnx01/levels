/**
 * LEVEL — Hookah Bar & Lounge Bratislava
 * Homepage behaviour: navigation, scroll state, opening hours, accordion, tabs.
 */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------------
   * Opening hours — single source of truth.
   * Index = JS day (0 = Sunday). `end` above 24 means "after midnight".
   * ------------------------------------------------------------- */
  const HOURS = [
    { start: 13, end: 24 }, // Ne
    { start: 11, end: 24 }, // Po
    { start: 11, end: 24 }, // Ut
    { start: 11, end: 24 }, // St
    { start: 11, end: 24 }, // Št
    { start: 11, end: 26 }, // Pi  → 02:00
    { start: 13, end: 26 }  // So  → 02:00
  ];

  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (h) => `${pad(h % 24)}:00`;

  /* ---------------------------------------------------------------
   * Mobile navigation
   * ------------------------------------------------------------- */
  function initNav() {
    const burger = $('#burger');
    const nav = $('#nav');
    if (!burger || !nav) return;

    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
      nav.classList.toggle('is-open', open);
      document.getElementById('header').classList.toggle('is-nav-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', () => {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------
   * Sticky header state
   * ------------------------------------------------------------- */
  function initHeader() {
    const header = $('#header');
    if (!header) return;

    const heroMark = $('.hero__logo');
    let ticking = false;

    const update = () => {
      ticking = false;
      header.classList.toggle('is-stuck', window.scrollY > 24);

      // Show the logotype in the header only once the hero one is out of view.
      const past = heroMark
        ? heroMark.getBoundingClientRect().bottom < header.offsetHeight
        : window.scrollY > 200;
      header.classList.toggle('is-brand', past);
    };

    update();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* ---------------------------------------------------------------
   * Reveal on scroll
   * ------------------------------------------------------------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------
   * Scroll spy for the main navigation
   * ------------------------------------------------------------- */
  function initScrollSpy() {
    const links = $$('.nav__link');
    const sections = links
      .map((link) => ({ link, el: $(link.getAttribute('href')) }))
      .filter((pair) => pair.el);
    if (!sections.length) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = null;

      sections.forEach((pair) => {
        if (pair.el.offsetTop <= line) current = pair.link;
      });

      // No highlight while the hero is still in view.
      if (window.scrollY < window.innerHeight * 0.5) current = null;

      links.forEach((link) => link.classList.toggle('is-active', link === current));
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---------------------------------------------------------------
   * Open / closed status, today's hours, current day highlight
   * ------------------------------------------------------------- */
  function initHours() {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const isOpenOn = (d, mins) => {
      const t = HOURS[d];
      return mins >= t.start * 60 && mins < t.end * 60;
    };

    // A session that runs past midnight still belongs to the previous day.
    const prevDay = (day + 6) % 7;
    const spillOver = HOURS[prevDay].end > 24 && minutes < (HOURS[prevDay].end - 24) * 60;
    const open = spillOver || isOpenOn(day, minutes);

    const today = HOURS[day];
    const todayEl = $('#todayHours');
    if (todayEl) todayEl.textContent = `${fmt(today.start)} – ${fmt(today.end)}`;

    const statusEl = $('#status');
    if (statusEl) {
      const textEl = $('.status__text', statusEl);
      statusEl.hidden = false;
      statusEl.classList.toggle('is-open', open);
      if (textEl) {
        textEl.textContent = open
          ? `Otvorené do ${fmt(today.end)}`
          : `Zatvorené · otvárame ${fmt(today.start)}`;
      }
    }

    const row = $(`#hours tr[data-day="${day}"]`);
    if (row) row.classList.add('is-today');
  }

  /* ---------------------------------------------------------------
   * LEVEL 1–10 accordion
   * ------------------------------------------------------------- */
  function initLevels() {
    const items = $$('.level');
    if (!items.length) return;

    items.forEach((item) => {
      const head = $('.level__head', item);
      if (!head) return;

      head.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        items.forEach((other) => {
          other.classList.remove('is-open');
          $('.level__head', other).setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', willOpen);
        head.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  /* ---------------------------------------------------------------
   * Drinks tabs
   * ------------------------------------------------------------- */
  function initTabs() {
    const tabs = $$('.tab');
    if (!tabs.length) return;

    const activate = (tab) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle('is-active', selected);
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (e) => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        activate(next);
        next.focus();
      });
    });
  }

  /* ---------------------------------------------------------------
   * Misc
   * ------------------------------------------------------------- */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHeader();
    initReveal();
    initScrollSpy();
    initHours();
    initLevels();
    initTabs();
    initYear();
  });
})();
