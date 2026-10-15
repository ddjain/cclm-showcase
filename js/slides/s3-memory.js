function animateMemory(section) {
  var captions = [
    'Disk is already shared. Only guest memory must move over br-migration.',
    'Iteration 1 — QEMU copies almost all RAM while the guest keeps running.',
    'Iteration 2+ — only pages dirtied during the copy; catch-up until stable.',
    'Brief pause — final delta — guest resumes on Green.',
    'Same processes, continuous data — that is live migration.',
  ];

  var captionEl = section.querySelector('#mem-caption');
  var dotsHost = section.querySelector('#mem-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var srcStatus = section.querySelector('#mem-src-status');
  var tgtStatus = section.querySelector('#mem-tgt-status');
  var ramTgt = section.querySelector('#ram-tgt');
  var metrics = section.querySelector('#mem-metrics');
  var stage = section.querySelector('#mem-stage');
  var phases = [
    section.querySelector('#ph-precopy'),
    section.querySelector('#ph-dirty'),
    section.querySelector('#ph-cutover'),
  ];
  var cutoverTimer = null;

  function setStatus(el, text, cls) {
    el.textContent = text;
    el.className = 'status-badge ' + cls;
  }

  function clearStreams() {
    stage.querySelectorAll('.page-stream').forEach(function (el) {
      el.remove();
    });
  }

  function setPhase(activeIdx) {
    phases.forEach(function (el, i) {
      el.classList.toggle('is-on', i === activeIdx);
    });
  }

  function spawnStreams(count, thin) {
    clearStreams();
    if (BeatStepperUtils.prefersReduced()) return;
    var w = stage.clientWidth || 800;
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'page-stream';
      if (thin) el.style.height = '6px';
      stage.appendChild(el);
      gsap.set(el, { left: w * 0.22, top: 120 + (i % 5) * 16, opacity: 0.9 });
      gsap.to(el, {
        left: w * 0.72,
        opacity: 0,
        duration: thin ? 0.9 : 1.2,
        delay: i * 0.12,
        ease: 'none',
        repeat: thin ? 2 : 3,
      });
    }
  }

  function reset() {
    if (cutoverTimer) {
      cutoverTimer.kill();
      cutoverTimer = null;
    }
    clearStreams();
    gsap.set(ramTgt, { width: '0%' });
    metrics.innerHTML = '';
    setStatus(srcStatus, 'Guest Running', 'running');
    setStatus(tgtStatus, 'Waiting', 'waiting');
    setPhase(-1);
  }

  var steps = [
    function () {
      captionEl.textContent = captions[0];
      reset();
    },
    function () {
      captionEl.textContent = captions[1];
      setPhase(0);
      spawnStreams(8, false);
      gsap.to(ramTgt, {
        width: '78%',
        duration: BeatStepperUtils.prefersReduced() ? 0 : 1.2,
        ease: 'power1.out',
      });
    },
    function () {
      captionEl.textContent = captions[2];
      setPhase(1);
      spawnStreams(4, true);
      gsap.to(ramTgt, {
        width: '96%',
        duration: BeatStepperUtils.prefersReduced() ? 0 : 0.8,
        ease: 'power1.out',
      });
    },
    function () {
      captionEl.textContent = captions[3];
      setPhase(2);
      clearStreams();
      setStatus(srcStatus, 'Guest PAUSED', 'paused');
      gsap.to(ramTgt, { width: '100%', duration: BeatStepperUtils.prefersReduced() ? 0 : 0.35 });
      cutoverTimer = gsap.delayedCall(BeatStepperUtils.prefersReduced() ? 0 : 0.4, function () {
        setStatus(srcStatus, 'Guest Stopped', 'stopped');
        setStatus(tgtStatus, 'Guest Running', 'running');
      });
    },
    function () {
      captionEl.textContent = captions[4];
      clearStreams();
      setPhase(2);
      setStatus(srcStatus, 'Guest Stopped', 'stopped');
      setStatus(tgtStatus, 'Guest Running', 'running');
      metrics.innerHTML =
        '<span class="metric-chip" style="opacity:1">56 s</span>' +
        '<span class="metric-chip" style="opacity:1">415 MiB</span>' +
        '<span class="metric-chip" style="opacity:1">3.72 GiB/s</span>' +
        '<span class="metric-chip" style="opacity:1">65 ms downtime</span>' +
        '<span class="badge-pass" style="opacity:1">PIDs 1200 / 1302 / 1252 unchanged · PASS</span>';
      if (!BeatStepperUtils.prefersReduced()) {
        gsap.from(metrics.children, { opacity: 0, y: 8, stagger: 0.05, duration: 0.3 });
      }
    },
  ];

  var stepper = new BeatStepper({ section: section, steps: steps });
  stepper.activate();

  return {
    cleanup: function () {
      reset();
      stepper.destroy();
    },
  };
}
