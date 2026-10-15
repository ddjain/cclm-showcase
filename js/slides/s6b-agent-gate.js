/* s6b-agent-gate.js — trigger gates + human gate (t-step) */
function animateAgentGate(section) {
  var captions = [
    'Spec declares the gate: vmim-running, target-pod, plan-executing — chaos fires only then.',
    'Migration progresses through VMIM phases — Synchronization is the memory-transfer window.',
    'Chaos loop polls the phase — it does not fire blind.',
    'Gate condition hits: fault fires exactly at VMIM Running, stays across cutover.',
    'Before any of this: P4 human gate — no chaos without confirmation.',
  ];

  var captionEl = section.querySelector('#gate-caption');
  var dotsHost = section.querySelector('#gate-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var nodes = section.querySelectorAll('.gate-node');
  var polls = section.querySelectorAll('.gate-poll');
  var hold = section.querySelector('.gate-hold');
  var bolt = section.querySelector('#gate-bolt');
  var gateNode = section.querySelector('.gate-node-gate');
  var badge = section.querySelector('#gh-badge');
  var arrow = section.querySelector('#gh-arrow');
  var ok = section.querySelector('#gh-ok');

  function apply(beat) {
    captionEl.textContent = captions[beat];
    var d = BeatStepperUtils.prefersReduced() ? 0 : 0.3;

    // Beats 0-1: migration nodes reveal progressively (node i+1 visible by beat 1)
    nodes.forEach(function (n, i) {
      var on = beat >= 1 || (beat === 0 && i === 0);
      var wasOn = n.classList.contains('is-lit');
      n.classList.toggle('is-lit', on);
      gsap.to(n, { opacity: on ? 1 : 0.3, duration: d, ease: 'power2.out' });
      if (on && !wasOn && beat === 1) {
        gsap.fromTo(n, { y: 6 }, { y: 0, duration: d, ease: 'power2.out' });
      }
    });

    // Poll rail: beat 2 shows polls 1-2, beat 3 shows all + injection
    polls.forEach(function (p, i) {
      var on = beat >= 2 && i <= beat - 2;
      gsap.to(p, { opacity: on ? 1 : 0.3, duration: d, ease: 'power2.out' });
    });
    if (hold) {
      gsap.to(hold, { opacity: beat >= 3 ? 1 : 0.3, duration: d, ease: 'power2.out' });
    }

    // Bolt: fires on beat 3
    if (bolt) {
      if (beat >= 3) {
        gsap.to(bolt, {
          opacity: 1,
          scale: 1,
          duration: BeatStepperUtils.prefersReduced() ? 0 : 0.35,
          ease: 'back.out(2)',
        });
        if (gateNode) gateNode.classList.add('is-hit');
      } else {
        gsap.to(bolt, { opacity: 0, scale: 0.6, duration: d });
        if (gateNode) gateNode.classList.remove('is-hit');
      }
    }

    // Human gate: beat 4
    var hg = beat >= 4;
    if (badge) {
      badge.classList.toggle('is-open', hg);
      gsap.to(badge, { opacity: 1, duration: d });
    }
    if (arrow) gsap.to(arrow, { opacity: hg ? 1 : 0, x: hg ? 0 : -8, duration: d, ease: 'power2.out' });
    if (ok) {
      ok.classList.toggle('is-ok', hg);
      gsap.to(ok, { opacity: hg ? 1 : 0, duration: d });
    }
  }

  var steps = captions.map(function (_, beat) {
    return function () { apply(beat); };
  });

  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return { cleanup: function () { stepper.destroy(); } };
}
