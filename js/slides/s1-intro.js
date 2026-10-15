function animateIntro(section) {
  var items = section.querySelectorAll('#intro-agenda li');
  gsap.set(items, { opacity: 0, y: 12 });
  var tl = gsap.timeline();
  tl.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
  return {
    cleanup: function () {
      tl.kill();
    },
  };
}
