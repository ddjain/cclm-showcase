function animateThanks(section) {
  var items = section.querySelectorAll('.eyebrow, #thanks-title, #thanks-qa, #thanks-contact');
  gsap.set(items, { opacity: 0, y: 14 });
  var tl = gsap.timeline();
  tl.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' });
  return {
    cleanup: function () {
      tl.kill();
    },
  };
}
