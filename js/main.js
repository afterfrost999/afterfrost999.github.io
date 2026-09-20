/* =========================================================
   김승조 Portfolio
   - 섹션 스크롤 전환 효과
   - 좌측 색인 하이라이트
   ========================================================= */
(function () {
  'use strict';

  const root     = document.documentElement;
  const sheets   = Array.from(document.querySelectorAll('.sheet'));
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canWatch = 'IntersectionObserver' in window;

  /* ---------- 1. 섹션 전환 ---------- */
  // 순차로 등장할 내부 블록
  const STEP = [
    '.cover__top', '.cover__lead', '.cover__meta',
    '.lead', '.body', '.intent', '.reasons li', '.intent__end',
    '.service', '.facts > div', '.features li',
    '.todo', '.sub', '.slot', '.shot',
    '.evi__item', '.stat', '.keys__lead', '.key',
    '.claim', '.shift', '.shift__quote', '.infra li',
    '.ts-list .tsc', '.retro li', '.links'
  ].join(', ');

  if (canWatch && !reduced) {
    root.classList.add('anim');

    // 블록마다 지연값을 미리 심어 둔다
    sheets.forEach((sheet) => {
      Array.from(sheet.querySelectorAll(STEP)).forEach((el, i) => {
        el.setAttribute('data-step', '');
        el.style.transitionDelay = Math.min(i * 70, 560) + 'ms';
      });
    });

    const enter = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10% 0px' });

    sheets.forEach((sheet) => enter.observe(sheet));

    // 첫 화면은 기다리지 않고 바로 등장
    requestAnimationFrame(() => sheets[0] && sheets[0].classList.add('is-in'));
  }

  /* ---------- 2. 이미지 확대 (같은 페이지 안에서) ---------- */
  const zoomables = Array.from(document.querySelectorAll('.figbox, .shot__frame'));

  if (zoomables.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.hidden = true;
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="닫기">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<figure class="lightbox__inner"><img alt="" /><figcaption></figcaption></figure>';
    document.body.appendChild(box);

    const bigImg = box.querySelector('img');
    const bigCap = box.querySelector('figcaption');
    let opener = null;

    function open(link) {
      const src = link.getAttribute('href');
      const source = link.querySelector('img');
      const cap = link.closest('figure') && link.closest('figure').querySelector('figcaption');

      bigImg.src = src;
      bigImg.alt = source ? source.alt : '';
      bigCap.textContent = cap ? cap.textContent.replace('(클릭하면 확대)', '').trim() : '';
      bigCap.hidden = !bigCap.textContent;

      opener = link;
      box.hidden = false;
      document.body.classList.add('is-locked');
      requestAnimationFrame(() => box.classList.add('is-open'));
      box.querySelector('.lightbox__close').focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      window.setTimeout(() => {
        box.hidden = true;
        bigImg.removeAttribute('src');
      }, 220);
      if (opener) { opener.focus(); opener = null; }
    }

    zoomables.forEach((link) => {
      link.addEventListener('click', (e) => {
        // 새 탭으로 열려는 조작(⌘/Ctrl/가운데 버튼)은 그대로 둔다
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(link);
      });
    });

    // 어디를 누르든 닫힘 — 이미지 자체도 포함
    box.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !box.hidden) close();
    });
  }

  /* ---------- 3. 좌측 색인 하이라이트 ---------- */
  const links = Array.from(document.querySelectorAll('.index a'));
  if (!links.length || !canWatch) return;

  const targets = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const spy = new IntersectionObserver((entries) => {
    const top = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!top) return;

    links.forEach((a) => {
      a.classList.toggle('is-on', a.getAttribute('href') === '#' + top.target.id);
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.15, 0.5] });

  targets.forEach((sec) => spy.observe(sec));
})();
