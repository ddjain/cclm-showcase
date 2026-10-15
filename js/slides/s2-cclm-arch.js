function animateCclmArch(section) {
  var captions = [
    'Two OpenShift clusters. One VM will move live from Blue to Green.',
    'Both clusters run KubeVirt (virt-*). Green also runs MTV/Forklift.',
    'A live guest already exists on Blue — workloads keep running.',
    'Plan is the migration recipe — type: live.',
    'Migration CR: PrepareTarget builds an empty home on Green.',
    'VMIM (KubeVirt) is the memory transfer job — next: the data plane.',
  ];

  var captionEl = section.querySelector('#arch-caption');
  var dotsHost = section.querySelector('#arch-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var nodes = section.querySelectorAll('.card-node');
  var reduced = BeatStepperUtils.prefersReduced();

  function reset() {
    nodes.forEach(function (el) {
      el.classList.remove('is-visible', 'is-active', 'is-dim');
      gsap.set(el, { opacity: 0, y: 12 });
    });
    ['#ph-prep', '#ph-sync', '#ph-done'].forEach(function (sel) {
      var el = section.querySelector(sel);
      if (el) el.classList.remove('is-on');
    });
  }

  function showUpTo(n) {
    nodes.forEach(function (el) {
      var b = parseInt(el.getAttribute('data-beat'), 10);
      if (b > 0 && b <= n) {
        el.classList.add('is-visible');
        el.classList.toggle('is-active', b === n);
        el.classList.toggle('is-dim', b < n && n < 5);
        if (reduced) {
          gsap.set(el, { opacity: b === n || n === 5 ? 1 : 0.7, y: 0 });
        } else {
          gsap.to(el, {
            opacity: b === n || n === 5 ? 1 : 0.7,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    });
    if (n >= 4) {
      section.querySelector('#ph-prep').classList.add('is-on');
    }
    if (n >= 5) {
      section.querySelector('#ph-prep').classList.add('is-on');
      section.querySelector('#ph-sync').classList.add('is-on');
      section.querySelector('#ph-done').classList.add('is-on');
      nodes.forEach(function (el) {
        if (el.classList.contains('is-visible')) {
          el.classList.remove('is-dim');
          gsap.to(el, { opacity: 1, duration: 0.25 });
        }
      });
    }
  }

  var steps = captions.map(function (text, beat) {
    return function () {
      captionEl.textContent = text;
      if (beat === 0) reset();
      else showUpTo(beat);
    };
  });

  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return {
    cleanup: function () {
      stepper.destroy();
      reset();
    },
  };
}
