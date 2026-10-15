/* s6a-agent-layer.js — scripted harness vs agentic layer (t-step) */
function animateAgentLayer(section) {
  var captions = [
    'vmshift-validator: deterministic Make pipelines. Deterministic is good — it is also a ceiling.',
    'Same harness, agent-driven: free-form fault in, disciplined run out.',
    'Agent maps intent to a scenario spec and proposes the plan.',
    'It runs the harness, proves injection, judges against the spec.',
    'Output: the same artifacts a human engineer would file — every run.',
  ];

  var captionEl = section.querySelector('#layer-caption');
  var dotsHost = section.querySelector('#layer-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var hsteps = section.querySelectorAll('.hstep');
  var bubbles = section.querySelectorAll('.agent-bubble');
  var artifacts = section.querySelector('.layer-artifacts');

  function apply(beat) {
    captionEl.textContent = captions[beat];

    var hsOn = beat >= 0; // harness visible from beat 0
    hsteps.forEach(function (h, i) {
      var on = hsOn;
      gsap.to(h, {
        opacity: on ? 1 : 0,
        y: on ? 0 : 8,
        duration: BeatStepperUtils.prefersReduced() ? 0 : 0.3,
        delay: on && !h._lit ? i * 0.05 : 0,
        ease: 'power2.out',
        onComplete: function () { h._lit = on; },
      });
    });

    var bubCount = beat <= 0 ? 0 : Math.min(beat, 3);
    bubbles.forEach(function (b, i) {
      var on = i < bubCount;
      gsap.to(b, {
        opacity: on ? 1 : 0,
        x: on ? 0 : -12,
        duration: BeatStepperUtils.prefersReduced() ? 0 : 0.35,
        ease: 'power2.out',
      });
    });

    var artOn = beat >= 4;
    if (artifacts) {
      gsap.to(artifacts, {
        opacity: artOn ? 1 : 0,
        y: artOn ? 0 : 8,
        duration: BeatStepperUtils.prefersReduced() ? 0 : 0.35,
        ease: 'power2.out',
      });
    }
  }

  var steps = captions.map(function (_, beat) {
    return function () { apply(beat); };
  });

  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return { cleanup: function () { stepper.destroy(); } };
}
