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
    '.service', '.facts > div',
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

  /* ---------- 2. 좌측 색인 하이라이트 ---------- */
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
