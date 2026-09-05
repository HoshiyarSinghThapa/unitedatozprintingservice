/* ============================================================
   United AtoZ Printing Service — Interaction & Motion
   Vanilla JS, no dependencies. All decorative motion is gated
   behind prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  // JS is on — remove the no-js fallback so animated states can play.
  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ---------- Announcement bar: measure height, handle dismiss ---------- */
    var announceBar = document.getElementById('announceBar');
    var announceClose = document.getElementById('announceClose');
    var ANNOUNCE_KEY = 'uazAnnounceDismissedAt';
    var ANNOUNCE_DAYS = 3; // how many days a dismissal stays hidden
    function setAnnounceHeight() {
      if (announceBar && !document.documentElement.classList.contains('announce-hidden')) {
        document.documentElement.style.setProperty('--announce-h', announceBar.offsetHeight + 'px');
      }
    }
    if (announceBar) {
      var dismissedAt = parseInt(localStorage.getItem(ANNOUNCE_KEY) || '0', 10);
      var expired = !dismissedAt || (Date.now() - dismissedAt) > ANNOUNCE_DAYS * 24 * 60 * 60 * 1000;
      if (!expired) {
        document.documentElement.classList.add('announce-hidden');
      } else {
        setAnnounceHeight();
        window.addEventListener('resize', setAnnounceHeight);
      }
      if (announceClose) {
        announceClose.addEventListener('click', function () {
          document.documentElement.classList.add('announce-hidden');
          localStorage.setItem(ANNOUNCE_KEY, Date.now().toString());
        });
      }
    }

    /* ---------- Mobile nav ---------- */
    var hamburger = document.getElementById('hamburger');
    var mobileNav = document.getElementById('mobileNav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function () {
        var open = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ---------- Header shrink + scroll progress ---------- */
    var header = document.querySelector('.site-header');
    var progress = document.getElementById('scrollProgress');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('scrolled', y > 8);
      if (progress) {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        var p = max > 0 ? y / max : 0;
        progress.style.transform = 'scaleX(' + p + ')';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll reveal (with per-group stagger) ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    // Assign a stagger index within each parent so grids cascade.
    revealEls.forEach(function (el) {
      var parent = el.parentNode;
      if (!parent._revealCount) parent._revealCount = 0;
      el.style.setProperty('--i', parent._revealCount);
      parent._revealCount++;
    });
    if ('IntersectionObserver' in window && revealEls.length && !reduceMotion) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 14% 0px' });
      revealEls.forEach(function (el) { revObs.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Kinetic headline: split into characters ---------- */
    function splitChars(node, counter) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (child) {
        if (child.nodeType === 3) { // text
          var text = child.textContent;
          var frag = document.createDocumentFragment();
          for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            var span = document.createElement('span');
            span.className = 'char' + (ch === ' ' ? ' space' : '');
            span.textContent = ch;
            span.style.setProperty('--ci', counter.n++);
            frag.appendChild(span);
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) { // element — recurse, keep classes
          splitChars(child, counter);
        }
      });
    }
    var splitEls = document.querySelectorAll('[data-split]');
    splitEls.forEach(function (el) {
      if (!reduceMotion) {
        splitChars(el, { n: 0 });
        el.classList.add('split');
      }
    });
    if (splitEls.length && !reduceMotion) {
      if ('IntersectionObserver' in window) {
        var splitObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('ready');
              splitObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 });
        splitEls.forEach(function (el) { splitObs.observe(el); });
      } else {
        splitEls.forEach(function (el) { el.classList.add('ready'); });
      }
    }

    /* ---------- Rotating hero word ---------- */
    var rotator = document.getElementById('rotator');
    if (rotator && !reduceMotion) {
      var words = Array.prototype.slice.call(rotator.querySelectorAll('.rot-word'));
      if (words.length > 1) {
        var idx = 0;
        words.forEach(function (w, i) { w.classList.toggle('in', i === 0); });
        setInterval(function () {
          var cur = words[idx];
          idx = (idx + 1) % words.length;
          var next = words[idx];
          cur.classList.remove('in');
          cur.classList.add('out');
          next.classList.remove('out');
          next.classList.add('in');
          setTimeout(function () { cur.classList.remove('out'); }, 550);
        }, 2200);
      }
    }

    /* ---------- Parallax (decorative layers only) ---------- */
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (parallaxEls.length && !reduceMotion) {
      var ticking = false;
      function applyParallax() {
        var y = window.scrollY || window.pageYOffset;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          el.style.transform = 'translate3d(0,' + (y * speed * -1) + 'px,0)';
        });
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(applyParallax); ticking = true; }
      }, { passive: true });
      applyParallax();
    }

    /* ---------- Count-up stats ---------- */
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var dur = 1500, start = null;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var val = (target * easeOutCubic(p)).toFixed(decimals);
        el.textContent = prefix + val + suffix;
        if (p < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (counters.length) {
      if ('IntersectionObserver' in window && !reduceMotion) {
        var cObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { cObs.observe(el); });
      } else {
        counters.forEach(function (el) {
          var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          el.textContent = (el.getAttribute('data-prefix') || '') +
            parseFloat(el.getAttribute('data-count')).toFixed(decimals) +
            (el.getAttribute('data-suffix') || '');
        });
      }
    }

    /* ---------- Magnetic buttons ---------- */
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
        btn.addEventListener('pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          var mx = (e.clientX - (r.left + r.width / 2)) * 0.25;
          var my = (e.clientY - (r.top + r.height / 2)) * 0.35;
          btn.style.setProperty('--mx', mx + 'px');
          btn.style.setProperty('--my', my + 'px');
        });
        btn.addEventListener('pointerleave', function () {
          btn.style.setProperty('--mx', '0px');
          btn.style.setProperty('--my', '0px');
        });
      });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.acc-head').forEach(function (head) {
      head.addEventListener('click', function () {
        var item = head.closest('.acc-item');
        var body = item.querySelector('.acc-body');
        var isOpen = item.classList.toggle('open');
        head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0px';
      });
    });

    /* ---------- Gallery filter (animated) ---------- */
    var filterBtns = document.querySelectorAll('.gallery-filters button');
    var galleryItems = document.querySelectorAll('.gallery-item');
    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          var filter = btn.dataset.filter;
          galleryItems.forEach(function (item) {
            var show = (filter === 'all' || item.dataset.cat === filter);
            item.classList.toggle('hide', !show);
            if (show && !reduceMotion) {
              item.classList.remove('pop');
              // reflow to restart animation
              void item.offsetWidth;
              item.classList.add('pop');
            }
          });
        });
      });
    }
  });

  /* ---------- Contact form (live via Formspree) ----------
     Endpoint: https://formspree.io/f/mwlkqzje
     Set on the <form> in contact.html via action + data-endpoint.
     To change the endpoint later: edit contact.html, replace the
     Formspree URL in both the action="" and data-endpoint="" attributes. */
  window.handleContactSubmit = function (event) {
    var form = event.target;
    var endpoint = form.getAttribute('data-endpoint');
    var status = form.querySelector('.form-status');

    if (endpoint) {
      event.preventDefault();
      var data = new FormData(form);
      if (status) { status.textContent = 'Sending…'; status.style.color = '#5b6472'; }
      fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            if (status) { status.textContent = 'Thanks! We’ll get back to you shortly.'; status.style.color = '#0a8f3c'; }
          } else { throw new Error('bad response'); }
        })
        .catch(function () {
          if (status) { status.textContent = 'Something went wrong. Please call or WhatsApp us at +977-9860607569.'; status.style.color = '#d91474'; }
        });
      return false;
    }

    // No backend wired yet — friendly inline fallback (no data lost silently).
    event.preventDefault();
    if (status) {
      status.textContent = 'Thanks! Our online form isn’t connected to an inbox yet — please call or WhatsApp us at +977-9860607569 and we’ll get right on it.';
      status.style.color = '#d91474';
    } else {
      alert("Thanks! This form isn't connected to an inbox yet — please call or WhatsApp us at +977-9860607569 in the meantime.");
    }
    return false;
  };
})();
