/* s6c-agent-inject.js — prove the injection (t-step) */
function animateAgentInject(section) {
  var captions = [
    'Phase 6 exists because commands lie. Intended 10% loss…',
    '…was 0.1% on the wire: krkn says fraction, tc reads percent. 100× off.',
    'Both B2 runs: INCONCLUSIVE. The verdict table said it outright.',
    'So the agent gathers evidence: krkn logs, tc qdisc, events, timing span.',
    'Rule: no verified injection → no verdict. Ever.',
  ];

  var captionEl = section.querySelector('#inject-caption');
  var dotsHost = section.querySelector('#inject-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var flag = section.querySelector('.ic-flag');
  var bad = section.querySelector('.ic-bad');
  var eq = section.querySelector('.ic-eq');
  var verdict = section.querySelector('#ic-verdict');
  var chips = section.querySelectorAll('.ie-chip');
  var rule = section.querySelector('#ie-rule');

  function apply(beat) {
    captionEl.textContent = captions[beat];
    var d = BeatStepperUtils.prefersReduced() ? 0 : 0.3;

    if (flag) gsap.to(flag, { opacity: beat >= 1 ? 1 : 0.35, duration: d });
    if (eq) gsap.to(eq, { opacity: beat >= 2 ? 1 : 0.35, duration: d });
    if (bad) {
      bad.classList.toggle('is-bad', beat >= 2);
      if (beat >= 2 && !bad._flashed) {
        bad._flashed = true;
        gsap.fromTo(bad, { scale: 1.35 }, { scale: 1, duration: BeatStepperUtils.prefersReduced() ? 0 : 0.4, ease: 'back.out(2)' });
      }
      if (beat < 2) bad._flashed = false;
    }
    if (verdict) {
      verdict.classList.toggle('is-on', beat >= 3);
      gsap.to(verdict, { opacity: beat >= 3 ? 1 : 0.3, duration: d });
    }
    chips.forEach(function (c, i) {
      var on = beat >= 4 && i <= beat - 4;
      gsap.to(c, {
        opacity: on ? 1 : 0.3,
        y: on ? 0 : 6,
        duration: d,
        delay: on ? i * 0.06 : 0,
        ease: 'power2.out',
      });
    });
    if (rule) {
      rule.classList.toggle('is-on', beat >= 5);
      gsap.to(rule, { opacity: beat >= 5 ? 1 : 0.3, duration: d });
    }
  }

  var steps = captions.map(function (_, beat) {
    return function () { apply(beat); };
  });

  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return { cleanup: function () { stepper.destroy(); } };
}
