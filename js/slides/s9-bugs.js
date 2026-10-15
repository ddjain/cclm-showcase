function animateBugs(section) {
  var rows = section.querySelectorAll('.table-wrap tbody tr');
  gsap.set(rows, { opacity: 0, y: 8 });
  var tl = gsap.timeline();
  tl.to(rows, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' });
  return {
    cleanup: function () {
      tl.kill();
    },
  };
}
