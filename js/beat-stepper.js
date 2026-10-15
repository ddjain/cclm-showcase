/* beat-stepper.js — keypress T advances teaching beats */
(function (global) {
  'use strict';

  var active = null;
  var reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hideHint(section) {
    if (!section) return;
    var hint = section.querySelector('.t-hint');
    if (hint) hint.classList.add('is-hidden');
  }

  function updateDots(section, index, total) {
    if (!section) return;
    var dots = section.querySelectorAll('.beat-dot');
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('is-active', i <= index);
      dots[i].classList.toggle('is-current', i === index);
    }
    var label = section.querySelector('.beat-progress-label');
    if (label) label.textContent = index + 1 + ' / ' + total;
  }

  /**
   * opts.section, opts.steps (array of functions), optional opts.onAdvance
   * Each step(i) is invoked when beat i becomes active (including beat 0 on activate).
   */
  function BeatStepper(opts) {
    this.section = opts.section;
    this.steps = opts.steps || [];
    this.index = 0;
    this.onAdvance = opts.onAdvance || null;
    this._bound = this._onKey.bind(this);
  }

  BeatStepper.prototype.activate = function () {
    if (active && active !== this) active.deactivate();
    active = this;
    this.index = 0;
    updateDots(this.section, 0, this.steps.length);
    if (this.section) {
      var hint = this.section.querySelector('.t-hint');
      if (hint) hint.classList.remove('is-hidden');
    }
    if (typeof this.steps[0] === 'function') this.steps[0](0);
    document.addEventListener('keydown', this._bound, true);
  };

  BeatStepper.prototype.deactivate = function () {
    document.removeEventListener('keydown', this._bound, true);
    if (active === this) active = null;
  };

  BeatStepper.prototype._onKey = function (e) {
    if (e.key !== 't' && e.key !== 'T') return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.next();
  };

  BeatStepper.prototype.next = function () {
    if (this.index >= this.steps.length - 1) return;
    this.index += 1;
    hideHint(this.section);
    var fn = this.steps[this.index];
    if (typeof fn === 'function') fn(this.index);
    updateDots(this.section, this.index, this.steps.length);
    if (typeof this.onAdvance === 'function') this.onAdvance(this.index);
  };

  BeatStepper.prototype.destroy = function () {
    this.deactivate();
  };

  global.BeatStepper = BeatStepper;
  global.BeatStepperUtils = {
    prefersReduced: function () {
      return reduced;
    },
    buildDotsHtml: function (n) {
      var html = '<div class="beat-progress" aria-hidden="true">';
      for (var i = 0; i < n; i++) {
        html += '<span class="beat-dot' + (i === 0 ? ' is-active is-current' : '') + '"></span>';
      }
      html += '<span class="beat-progress-label">1 / ' + n + '</span></div>';
      return html;
    },
  };
})(typeof window !== 'undefined' ? window : this);
