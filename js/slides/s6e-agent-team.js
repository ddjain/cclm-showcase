/* s6e-agent-team.js — from one agent to a team (t-step, bullet reveal) */
function animateAgentTeam(section) {
  var captions = [
    'Today: one agent runs all eight phases, serial. Next: a team.',
    'One Lead orchestrates; short-lived specialists do the work — a model per job.',
    'Coordination is state files on disk — design, run state, postmortems — not conversation.',
    'Worker fails → postmortem → Lead patches that subagent → relaunch. The 401 memory write, formalized.',
    'Loop engineering: every run produces a better team — starting with AI-designed scenarios.',
  ];

  var captionEl = section.querySelector('#team-caption');
  var dotsHost = section.querySelector('#team-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);

  var items = section.querySelectorAll('.tm');

  function apply(beat) {
    captionEl.textContent = captions[beat];
    var d = BeatStepperUtils.prefersReduced() ? 0 : 0.35;

    items.forEach(function (it, i) {
      var on = i < beat;
      gsap.to(it, {
        opacity: on ? 1 : 0.22,
        x: on ? 0 : -12,
        duration: d,
        ease: 'power2.out',
      });
      it.classList.toggle('is-on', on);
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
