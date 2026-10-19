/* main.js — Reveal init + per-slide GSAP dispatcher */
var SLIDE_FN_MAP = {
  's-intro': function () {
    return typeof animateIntro === 'function' ? animateIntro : null;
  },
  's-cclm-what': function () {
    return typeof animateCclmWhat === 'function' ? animateCclmWhat : null;
  },
  's-cclm-arch': function () {
    return typeof animateCclmArch === 'function' ? animateCclmArch : null;
  },
  's-memory': function () {
    return typeof animateMemory === 'function' ? animateMemory : null;
  },
  's-validator': function () {
    return typeof animateValidator === 'function' ? animateValidator : null;
  },
  's-scenarios': function () {
    return typeof animateScenarios === 'function' ? animateScenarios : null;
  },
  's-agentic': function () {
    return typeof animateAgentic === 'function' ? animateAgentic : null;
  },
  's-agent-team': function () {
    return typeof animateAgentTeam === 'function' ? animateAgentTeam : null;
  },
  's-templates': function () {
    return typeof animateTemplates === 'function' ? animateTemplates : null;
  },
  's-recs': function () {
    return typeof animateRecs === 'function' ? animateRecs : null;
  },
  's-bugs': function () {
    return typeof animateBugs === 'function' ? animateBugs : null;
  },
  's-close': function () {
    return typeof animateClose === 'function' ? animateClose : null;
  },
};

var currentCleanup = null;

function killCurrent() {
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }
}

function dispatchSlide(section) {
  killCurrent();
  if (!section) return;
  var fnGetter = SLIDE_FN_MAP[section.id];
  if (!fnGetter) return;
  var handler = fnGetter();
  if (typeof handler !== 'function') return;
  var result = handler(section);
  if (result && result.cleanup) currentCleanup = result.cleanup;
}

Reveal.initialize({
  hash: false,
  loop: false,
  autoSlide: 0,
  transition: 'fade',
  transitionSpeed: 'slow',
  controls: false,
  progress: false,
  overview: false,
  touch: true,
  mouseWheel: false,
  keyboard: true,
  center: false,
  width: 1920,
  height: 1080,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2.0,
}).then(function () {
  dispatchSlide(Reveal.getCurrentSlide());

  Reveal.on('slidechanged', function (e) {
    dispatchSlide(e.currentSlide);
    document.dispatchEvent(
      new CustomEvent('cclm:slidechanged', {
        detail: { indexh: e.indexh, currentSlide: e.currentSlide },
      })
    );
  });

  window.CclmMain = { kill: killCurrent, dispatch: dispatchSlide };
});
