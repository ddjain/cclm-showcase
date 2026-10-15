/* s1a-cclm-what.js — what is CCLM context slide (t-step) */
function animateCclmWhat(section) {
  var captions = [
    'Three ideas before the deep-dive: the platform, the feature, the reason it matters.',
    'OpenShift Virtualization: VMs run as pods — Kubernetes manages them like any other workload.',
    'CCLM: live-migrate a running VM across clusters — guest state survives the move.',
    'The payoff: infrastructure change without workload downtime.',
  ];

  var captionEl = section.querySelector('#cw-caption');
  var dotsHost = section.querySelector('#cw-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var items = section.querySelectorAll('.context-item');
  var chips = section.querySelectorAll('.ci-chip');

  function apply(beat) {
    captionEl.textContent = captions[beat];
    var d = BeatStepperUtils.prefersReduced() ? 0 : 0.35;

    items.forEach(function (it, i) {
      var on = i < beat;
      gsap.to(it, {
        opacity: on ? 1 : 0.25,
        x: on ? 0 : -10,
        duration: d,
        ease: 'power2.out',
      });
    });

    var chipsOn = beat >= 3;
    chips.forEach(function (c, i) {
      gsap.to(c, {
        opacity: chipsOn ? 1 : 0,
        y: chipsOn ? 0 : 8,
        duration: d,
        delay: chipsOn ? i * 0.07 : 0,
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
