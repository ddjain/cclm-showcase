function animateClose(section) {
  var items = section.querySelectorAll(
    '.close-proved li, .agentic-next-label, .close-team-list .tm, .link-list li'
  );
  gsap.set(items, { opacity: 0, y: 10 });
  var tl = gsap.timeline();
  tl.to(items, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' });
  return {
    cleanup: function () {
      tl.kill();
    },
  };
}
