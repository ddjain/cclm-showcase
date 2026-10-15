function animateScenarios(section) {
  var captions = [
    '37+ scenarios under cclm-chaos/scenarios — specs drive reproducible runs.',
    'A — pod kills on virt-launcher, handler, controller, Forklift.',
    'B — network faults on the migration path.',
    'C / D / E — stress, storage, control plane.',
    'F / G / S / X — node events, scale, compound faults.',
  ];

  var captionEl = section.querySelector('#scn-caption');
  var dotsHost = section.querySelector('#scn-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);
  var tiles = Array.prototype.slice.call(section.querySelectorAll('.scenario-tile'));

  var revealPlan = [
    [],
    ['A'],
    ['A', 'B'],
    ['A', 'B', 'C', 'D', 'E'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'S', 'X'],
  ];

  function familyMatch(tileFam, keys) {
    return keys.some(function (k) {
      return tileFam === k || tileFam.indexOf(k) === 0;
    });
  }

  function apply(beat) {
    captionEl.textContent = captions[beat];
    var keys = revealPlan[beat] || [];
    tiles.forEach(function (tile) {
      var fam = tile.getAttribute('data-family');
      var on = familyMatch(fam, keys);
      gsap.to(tile, {
        opacity: on ? 1 : 0,
        y: on ? 0 : 10,
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

  gsap.set(tiles, { opacity: 0, y: 10 });
  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return {
    cleanup: function () {
      stepper.destroy();
    },
  };
}
