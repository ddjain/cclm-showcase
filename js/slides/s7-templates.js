function animateTemplates(section) {
  var captions = [
    'Templates keep 168+ runs consistent and engineer-ready.',
    'Report template — 14 fixed sections; injection shown, not asserted.',
    'Quality rules: no cross-scenario refs; clean data only.',
    'Bug template — only when unexpected + reproduced + product defect.',
    'Copy-paste repro with real pod names and UTC timestamps → bug-tracker.md.',
  ];

  var captionEl = section.querySelector('#tpl-caption');
  var dotsHost = section.querySelector('#tpl-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);
  var reportItems = section.querySelectorAll('#report-sections li');
  var bugItems = section.querySelectorAll('#bug-sections li');

  function clearHl() {
    reportItems.forEach(function (li) {
      li.classList.remove('is-hl');
    });
    bugItems.forEach(function (li) {
      li.classList.remove('is-hl');
    });
  }

  function apply(beat) {
    captionEl.textContent = captions[beat];
    clearHl();
    if (beat === 1) {
      reportItems.forEach(function (li, idx) {
        if (idx < 7) li.classList.add('is-hl');
      });
    }
    if (beat === 2) {
      reportItems.forEach(function (li, idx) {
        if (idx >= 7) li.classList.add('is-hl');
      });
    }
    if (beat === 3) {
      bugItems.forEach(function (li, idx) {
        if (idx < 4) li.classList.add('is-hl');
      });
    }
    if (beat === 4) {
      bugItems.forEach(function (li, idx) {
        if (idx >= 4) li.classList.add('is-hl');
      });
    }
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
