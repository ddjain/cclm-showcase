function animateValidator(section) {
  var captions = [
    'Independent guest validation is how we catch silent Forklift failures.',
    'VERIFY — SSH source; confirm workloads are healthy before we start.',
    'PRE — snapshot state so we can prove continuity after migration.',
    'MIGRATE — drive Plan → Migration through Prep and Sync to Done.',
    'POST — SSH Green; compare pre vs post; confirm same PIDs.',
    'summary.json PASS — guest-level live migration confirmed.',
  ];

  var captionEl = section.querySelector('#val-caption');
  var dotsHost = section.querySelector('#val-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);
  var boxes = section.querySelectorAll('.pipe-box');

  function apply(beat) {
    captionEl.textContent = captions[beat];
    boxes.forEach(function (b, idx) {
      var on = beat > 0 && idx < beat;
      b.classList.toggle('is-on', on);
      gsap.to(b, {
        opacity: on ? 1 : 0.4,
        y: on ? 0 : 8,
        duration: BeatStepperUtils.prefersReduced() ? 0 : 0.3,
        ease: 'power2.out',
      });
    });
  }

  var steps = captions.map(function (_, beat) {
    return function () {
      apply(beat);
    };
  });

  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return {
    cleanup: function () {
      stepper.destroy();
    },
  };
}
