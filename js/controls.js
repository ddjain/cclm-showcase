/* controls.js — act dots, prev/next, fullscreen, zoom */
(function () {
  var ACTS = [
    { label: 'Intro', h: 0 },
    { label: 'Context', h: 1 },
    { label: 'How CCLM', h: 2 },
    { label: 'Memory', h: 3 },
    { label: 'Testing', h: 4 },
    { label: 'Scenarios', h: 5 },
    { label: 'Agentic', h: 6 },
    { label: 'Templates', h: 7 },
    { label: 'Recs', h: 8 },
    { label: 'Bugs', h: 9 },
    { label: 'Close', h: 10 },
  ];

  var bar = document.getElementById('cclm-controls');
  var dotsEl = document.getElementById('kc-dots');
  var btnPrev = document.getElementById('kc-prev');
  var btnNext = document.getElementById('kc-next');
  var btnZoom = document.getElementById('kc-zoom');
  var btnFS = document.getElementById('kc-fullscreen');
  var iconEnter = btnFS.querySelector('.kc-icon-enter');
  var iconExit = btnFS.querySelector('.kc-icon-exit');
  var dots = [];
  var hideTimer = null;
  var zoomLevel = 1;
  var zoomScales = [1, 1.18, 1.38];
  var zoomLabels = ['A', 'A+', 'A++'];

  ACTS.forEach(function (act) {
    var d = document.createElement('button');
    d.className = 'kc-dot';
    d.type = 'button';
    d.textContent = act.label;
    d.title = act.label;
    d.addEventListener('click', function () {
      if (window.Reveal) Reveal.slide(act.h, 0);
    });
    dotsEl.appendChild(d);
    dots.push(d);
  });

  function setActiveDot(hIdx) {
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === hIdx);
    });
  }

  function showBar() {
    bar.classList.remove('kc-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      bar.classList.add('kc-hidden');
    }, 2500);
  }

  document.addEventListener('mousemove', showBar);
  document.addEventListener('touchstart', showBar, { passive: true });
  showBar();

  btnPrev.addEventListener('click', function () {
    if (!window.Reveal) return;
    var idx = Reveal.getIndices().h;
    Reveal.slide(idx === 0 ? ACTS.length - 1 : idx - 1, 0);
    showBar();
  });

  btnNext.addEventListener('click', function () {
    if (!window.Reveal) return;
    var idx = Reveal.getIndices().h;
    Reveal.slide((idx + 1) % ACTS.length, 0);
    showBar();
  });

  function applyZoom() {
    var scale = zoomScales[zoomLevel - 1];
    document.documentElement.style.setProperty('--ui-zoom', scale);
    btnZoom.textContent = zoomLabels[zoomLevel - 1];
  }

  btnZoom.addEventListener('click', function () {
    zoomLevel = (zoomLevel % 3) + 1;
    applyZoom();
    showBar();
  });

  function toggleFS() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(
        document.documentElement
      );
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }

  function updateFSIcon() {
    var inFS = !!document.fullscreenElement;
    iconEnter.style.display = inFS ? 'none' : '';
    iconExit.style.display = inFS ? '' : 'none';
  }

  btnFS.addEventListener('click', function () {
    toggleFS();
    showBar();
  });
  document.addEventListener('fullscreenchange', updateFSIcon);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'f' || e.key === 'F') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      toggleFS();
    }
    showBar();
  });

  document.addEventListener('cclm:slidechanged', function (e) {
    setActiveDot(e.detail.indexh);
  });

  var readyTimer = setInterval(function () {
    if (!window.Reveal || !Reveal.isReady()) return;
    clearInterval(readyTimer);
    setActiveDot(Reveal.getIndices().h);
    applyZoom();
  }, 100);
})();
