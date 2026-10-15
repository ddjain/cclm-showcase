/* s6-agentic.js — cclm-test 8-phase workflow + terminal inset (t-step)
   Terminal blocks follow the evidence doc for the captured A1 run
   (/cclm-test A1, iteration 5, vm-svc-bfa258d5-3, run tag
   A1-iteration5-20260820T135218Z). Only frame-supported names, numbers,
   and output appear. Reconstruction caveats (per the evidence doc):
   - P2 cluster-inspection commands, the P5 trigger-launch command, and the
     P6 grep filter are reconstructions from partially visible frames —
     captions mark them; do not present as verbatim-verified.
   - The 401 Unauthorized moment is shown only as a labeled recovery beat,
     not as part of the successful attempt.
   - No tc evidence is claimed; confirmed evidence is the VMIM gate firing
     and the logged source launcher pod deletion.
   Line coloring: $ commands cyan, ! events green, output/agent narration gray. */
function animateAgentic(section) {
  var captions = [
    'cclm-test: natural language → disciplined chaos run. Terminal: reconstructed transcript of the captured A1 run, iteration 5.',
    'P1 — Understand spec: A1 = krknctl pod-scenarios, gated on VMIM Running, killing the source virt-launcher; iteration count 4 → #5.',
    'P2 — Analyze cluster: blue/green reachable, Forklift pods Running, krknctl available; target VM + source launcher resolved. (commands reconstructed)',
    'P3 — Prepare: 375 files synced to the bastion; chaos-trigger.sh inspected — the executable script is authoritative over the spec.',
    'P4 — Confirm with user: full test plan with gate + execution order, then explicit approval — "yes, lets start". No chaos before the human gate.',
    'P5 — Execute: chaos trigger armed first (it waits on the VMIM gate); migration starts in a separate session. Run tag preserved from the frames.',
    'P5 recovery — first attempt hit 401 Unauthorized: stale blue-cluster credentials. Agent refreshed them and retried — shown as a recovery moment, not the success path.',
    'P6 — Verify injection: VMIM gate hit + krkn logged source launcher deletion mid-transfer. Injection confirmed — a migration PASS alone would prove nothing.',
    'P7/P8 — Result & report: PASS, total 56s / migration 43s — matches expectations and prior iterations. Report filed under scenarios/A1/reports/.',
  ];

  var termBlocks = [
    // Beat 0 — invocation
    [
      '$ /cclm-test A1',
      '› skill: end-to-end CCLM chaos runner — understand spec,',
      '  analyze cluster, prepare, confirm, execute, verify, report',
    ],
    // Beat 1 — P1 understand spec
    [
      '› reading skill env config + scenarios/A1/scenario-spec.md',
      '  Read 2 files',
      '› reading chaos-trigger.sh — authoritative over the spec —',
      '  and the reports dir for the iteration count',
      '  Read 1 file, listed 1 directory',
      '› A1: krknctl pod-scenarios · gate: VMIM Running',
      '  kills the source virt-launcher · 4 reports → iteration #5',
    ],
    // Beat 2 — P2 analyze cluster (commands reconstructed from frames)
    [
      "$ ssh cloud29 'KUBECONFIG=/root/blue/kubeconfig oc get nodes'",
      '  d38-h07-000-r660   Ready   control-plane,master',
      '  d38-h08-000-r660   Ready   control-plane,master',
      "  …",
      "$ ssh cloud29 'KUBECONFIG=/root/green/kubeconfig kubectl get pods -n openshift-mtv'",
      '  forklift-api-544667b756-n822m          1/1   Running',
      '  forklift-cli-download-66fbbfc677-5jf51 1/1   Running',
      '→ Forklift ready · krknctl available',
      '→ Target VM resolved: vm-svc-bfa258d5-3',
      '  on source node d39-h07-000-r660 · not yet on target',
    ],
    // Beat 3 — P3 prepare
    [
      '$ bash sync.sh baremetal-12',
      '  Transfer starting: 375 files',
      '  sent 23050 bytes · received 32 bytes',
      '  total size is 2892926 · speedup is 125.33',
      "$ ssh cloud29 'head -12 …/scenarios/A1/chaos-trigger.sh'",
      '  #!/bin/bash · set -euo pipefail',
      '  # Usage: chaos-trigger.sh <source-node> <vm-name> [namespace]',
    ],
    // Beat 4 — P4 confirm with user
    [
      '┌ TEST PLAN ─ A1: Kill source virt-launcher ────────────',
      '│ Scenario:   A1 — Kill source virt-launcher',
      '│ Fault type: pod-scenarios · Trigger gate: VMIM Running',
      '│ Target VM:  vm-svc-bfa258d5-3 (vm-services)',
      '│ 1. Arm the chaos trigger · wait for VMIM Running',
      '│ 2. Start migration in a separate SSH session',
      '│ 3. Inject the fault at the gate during memory transfer',
      '└ Ready to execute?',
      '$ yes, lets start',
    ],
    // Beat 5 — P5 execute (launch command reconstructed from frames)
    [
      "$ ssh cloud29 'cd /root/v2/vmshift-validator && nohup bash \\",
      '    cclm-chaos/scenarios/A1/chaos-trigger.sh \\',
      '    d39-h07-000-r660 vm-svc-bfa258d5-3 vm-services > \\',
      '    /tmp/chaos-vm-svc-bfa258d5-3.log 2>&1 &',
      '  Launched pid 1518901',
      '$ make migrate-selective VMS=vm-svc-bfa258d5-3 \\',
      '    MIGRATION_PROFILE=baremetal-12 \\',
      '    RUN_TAG=A1-iteration5-20260820T135218Z',
    ],
    // Beat 6 — P5 recovery: 401 on first attempt (labeled recovery moment)
    [
      "! 401 Unauthorized — first chaos attempt crashed",
      '› recovery: stale blue-cluster credentials',
      '  agent refreshed the token · rebuilt the merged kubeconfig',
      '  → trigger relaunched · krkn polling for the VMIM gate',
      '  "trigger condition not satisfied" — no VMIM yet',
    ],
    // Beat 7 — P6 verify injection (grep filter reconstructed)
    [
      '$ ssh cloud29 \'grep -iE "trigger.*satisf|deleting|chaos|skip" /tmp/chaos-vm-svc-bfa258d5-3.log\'',
      '  TRIGGERS_ON_TIMEOUT … skip',
      '! VMIM reached Running → trigger fired',
      '  krkn: "Gracefully deleting pod virt-launcher-vm-svc-bfa258d5-3-sxkmj"',
      '  → kill landed during active memory transfer',
      '  → INJECTION CONFIRMED',
    ],
    // Beat 8 — result + verdict + report
    [
      '  Migration PASSED — total 56s, migration 43s',
      '› injection confirmed at the gate + migration passed',
      '  → Verdict: PASS — matches expectations and prior iterations',
      '› report written under cclm-chaos/scenarios/A1/reports/',
    ],
  ];

  var captionEl = section.querySelector('#agent-caption');
  var dotsHost = section.querySelector('#agent-dots');
  dotsHost.innerHTML = BeatStepperUtils.buildDotsHtml(captions.length);
  var cards = section.querySelectorAll('.phase-card');
  var termBody = section.querySelector('#agent-term-body');

  var typeTimer = null;
  var MAX_VISIBLE = 12; // lines kept in the viewport; older scroll out

  function lineHtml(line) {
    var esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (line.charAt(0) === '$') return '<span class="at-cmd">' + esc + '</span>';
    if (line.charAt(0) === '!') return '<span class="at-note">' + esc + '</span>';
    return '<span class="at-out">' + esc + '</span>';
  }

  function stopTyping() {
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
  }

  function renderLines(lines) {
    if (!termBody) return;
    var shown = lines.length > MAX_VISIBLE ? lines.slice(lines.length - MAX_VISIBLE) : lines;
    termBody.innerHTML = shown.map(lineHtml).join('\n');
  }

  // Type the lines of `newLines` one by one onto the already-rendered `done` lines.
  function typeBlock(done, newLines) {
    stopTyping();
    if (!termBody) return;
    var all = done.slice();
    var reduced = BeatStepperUtils.prefersReduced();

    if (reduced) {
      newLines.forEach(function (l) { all.push(l); });
      renderLines(all);
      return;
    }

    var li = 0;
    var ci = 0;
    (function tick() {
      if (li >= newLines.length) { typeTimer = null; return; }
      var line = newLines[li];
      ci += 3;
      if (ci >= line.length) {
        all.push(line);
        li += 1;
        ci = 0;
        renderLines(all);
        typeTimer = setTimeout(tick, 90); // pause between lines
        return;
      }
      var withCursor = all.concat([line.slice(0, ci) + '▌']);
      renderLines(withCursor);
      typeTimer = setTimeout(tick, 10);
    })();
  }

  // Accumulated lines across beats so context persists
  var accLines = [];

  function apply(beat) {
    captionEl.textContent = captions[beat];
    cards.forEach(function (c) {
      var ph = parseInt(c.getAttribute('data-ph'), 10);
      // Beats: 0 invocation · 1-5 P1-P5 · 6 recovery (still P5) · 7 P6 · 8 P7+P8
      var lit = beat <= 5 ? beat : (beat >= 8 ? 8 : beat - 1);
      var on = beat > 0 && ph <= lit;
      c.classList.toggle('is-on', on);
      gsap.to(c, {
        opacity: on ? 1 : 0.35,
        duration: BeatStepperUtils.prefersReduced() ? 0 : 0.3,
        ease: 'power2.out',
      });
    });
    typeBlock(accLines, termBlocks[beat]);
    termBlocks[beat].forEach(function (l) { accLines.push(l); });
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
      stopTyping();
      accLines = [];
      stepper.destroy();
    },
  };
}
