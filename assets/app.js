/* ============================================================
   Hemang Sharma — Portfolio · interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var sheet = document.getElementById('mobileSheet');
  document.querySelectorAll('[data-menu-open]').forEach(function (b) {
    b.addEventListener('click', function () { sheet.classList.add('open'); document.body.style.overflow = 'hidden'; });
  });
  document.querySelectorAll('[data-menu-close]').forEach(function (b) {
    b.addEventListener('click', function () { sheet.classList.remove('open'); document.body.style.overflow = ''; });
  });

  /* ---------- Resume: open PDF in a new tab ---------- */
  document.querySelectorAll('[data-resume]').forEach(function (a) {
    a.setAttribute('href', 'assets/hemang-sharma-resume.pdf');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* ---------- Nav highlight is page-level ----------
     Each page marks its own nav item with class="active" in the HTML
     (Home on index, Projects on Projects.html, About on About.html).
     No scroll-spy: links are cross-page, so the current page stays lit. */

  /* ---------- Testimonials — infinite peeking carousel ---------- */
  (function () {
    var viewport = document.getElementById('tviewport');
    var track = document.getElementById('tcarTrack');
    if (!viewport || !track) return;

    var reals = Array.prototype.slice.call(track.children);
    var N = reals.length;
    if (!N) return;

    // clone last -> front, first -> end for seamless infinite loop
    var firstClone = reals[0].cloneNode(true);
    var lastClone = reals[N - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    track.insertBefore(lastClone, reals[0]);
    track.appendChild(firstClone);

    var slides = Array.prototype.slice.call(track.children); // length N+2
    var pos = 1;            // start on first real slide
    var animating = false;

    // dots (one per real slide)
    var dotsWrap = document.getElementById('dots');
    dotsWrap.innerHTML = '';
    var dots = [];
    for (var i = 0; i < N; i++) {
      (function (real) {
        var d = document.createElement('button');
        d.setAttribute('aria-label', 'Go to testimonial ' + (real + 1));
        d.addEventListener('click', function () { goTo(real + 1); });
        dotsWrap.appendChild(d);
        dots.push(d);
      })(i);
    }

    function realIndex() { return (pos - 1 + N) % N; }

    function place(animate) {
      track.style.transition = animate ? '' : 'none';
      // use layout box (offsetLeft/offsetWidth) — immune to the scale() transform on cards
      var slide = slides[pos];
      var x = viewport.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
      track.style.transform = 'translateX(' + x + 'px)';
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === pos); });
      var ri = realIndex();
      dots.forEach(function (d, i) { d.classList.toggle('on', i === ri); });
      if (!animate) { void track.offsetWidth; track.style.transition = ''; }
    }

    function goTo(target) {
      if (animating) return;
      animating = true;
      pos = target;
      place(true);
    }
    function next() { goTo(pos + 1); }
    function prev() { goTo(pos - 1); }

    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform') return;
      animating = false;
      if (pos === slides.length - 1) { pos = 1; place(false); }       // past last real -> first
      else if (pos === 0) { pos = slides.length - 2; place(false); }  // before first real -> last
    });

    var nextBtn = document.querySelector('[data-next]');
    var prevBtn = document.querySelector('[data-prev]');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // click a peeking side card to bring it center
    slides.forEach(function (s, i) {
      s.addEventListener('click', function () { if (i !== pos && !animating) goTo(i); });
    });

    // touch / swipe
    var startX = 0, dragging = false;
    viewport.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (!dragging) return; dragging = false;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
    }, { passive: true });

    // gentle autoplay, paused on hover / off-screen
    var timer = null;
    function start() { stop(); timer = setInterval(next, 6500); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);

    window.addEventListener('resize', function () { place(false); });

    // initial layout (after fonts/images settle)
    place(false);
    window.addEventListener('load', function () { place(false); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(false); });
    start();
  })();

  /* ---------- "Currently listening to" component (no audio — links out) ---------- */
  var TRACKS = [
    { t: 'Crawling', a: 'Linkin Park', dur: '3:29',
      art: 'assets/img/lp-hybrid-theory.png',
      url: 'https://music.youtube.com/search?q=Crawling%20Linkin%20Park' },
    { t: 'Creep', a: 'Radiohead', dur: '3:59',
      art: 'assets/img/creep-pablo-honey.png',
      url: 'https://music.youtube.com/search?q=Creep%20Radiohead' },
    { t: 'Kal Chaudhvin Ki Raat Thi', a: 'Jagjit Singh', dur: '6:11',
      art: 'assets/img/kalchaudhvin-duniya.png',
      url: 'https://music.youtube.com/search?q=Kal%20Chaudhvin%20Ki%20Raat%20Thi%20Jagjit%20Singh' }
  ];
  var player = document.getElementById('player');
  if (player) {
  var playBtn = document.getElementById('playBtn');
  var npTitle = document.getElementById('npTitle');
  var npArtist = document.getElementById('npArtist');
  var npArt = document.getElementById('npArt');
  var npArtLink = document.getElementById('npArtLink');
  var trackEls = Array.prototype.slice.call(document.querySelectorAll('.track'));
  var cur = 0, playing = true;  // "currently listening" → equalizer animates by default

  var PLAY_SVG = '<svg viewBox="0 0 24 24" shape-rendering="crispEdges" fill="currentColor"><path d="M7 4h3v16H7zM10 6h3v12h-3zM13 8h3v8h-3zM16 10h2v4h-2z"/></svg>';
  var PAUSE_SVG = '<svg viewBox="0 0 24 24" shape-rendering="crispEdges" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

  function renderPlayer() {
    var trk = TRACKS[cur];
    npTitle.textContent = trk.t;
    npArtist.textContent = trk.a;
    if (npArt) npArt.setAttribute('src', trk.art);
    playBtn.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
    playBtn.setAttribute('aria-label', playing ? 'Pause equalizer' : 'Play equalizer');
    player.classList.toggle('paused', !playing);
    trackEls.forEach(function (el, i) { el.classList.toggle('on', i === cur); });
  }
  function toggle() { playing = !playing; renderPlayer(); }
  function setTrack(i) { cur = (i + TRACKS.length) % TRACKS.length; playing = true; renderPlayer(); }

  if (playBtn) playBtn.addEventListener('click', toggle);
  var tn = document.querySelector('[data-track-next]');
  var tp = document.querySelector('[data-track-prev]');
  if (tn) tn.addEventListener('click', function () { setTrack(cur + 1); });
  if (tp) tp.addEventListener('click', function () { setTrack(cur - 1); });
  // Each track row promotes itself to the "currently listening" header.
  // No navigation — everything stays on this page.
  trackEls.forEach(function (el) {
    el.addEventListener('click', function () { setTrack(parseInt(el.getAttribute('data-i'), 10)); });
  });
  renderPlayer();
  }

  /* like toggle */
  var likeBtn = document.getElementById('likeBtn');
  if (likeBtn) likeBtn.addEventListener('click', function () { likeBtn.classList.toggle('liked'); });

  /* ---------- Copy email ---------- */
  var emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      var email = emailBtn.getAttribute('data-email');
      var done = function () {
        emailBtn.classList.add('show-copied');
        setTimeout(function () { emailBtn.classList.remove('show-copied'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () { window.location.href = 'mailto:' + email; });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }

  /* ---------- Scroll reveal (additive one-shot entrance) ----------
     Content is visible by default in CSS; we only ADD an animation
     class. Nothing here can ever leave content hidden. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('anim'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Playground: seamless marquee + custom "View on Behance" cursor ---------- */
  (function () {
    var marquee = document.getElementById('playMarquee');
    var track = document.getElementById('playTrack');
    var cursor = document.getElementById('playCursor');
    if (!marquee || !track) return;

    // duplicate the set once so translateX(-50%) loops seamlessly
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      track.appendChild(clone);
    });

    // speed: keep px/sec constant regardless of content width
    function setDuration() {
      var oneSet = track.scrollWidth / 2;        // width of a single set
      var speed = 70;                            // px per second
      track.style.setProperty('--play-dur', (oneSet / speed) + 's');
    }
    setDuration();
    window.addEventListener('resize', setDuration);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setDuration);
    window.addEventListener('load', setDuration);

    // custom cursor follows pointer over the gallery — DESKTOP MOUSE ONLY.
    // Touch devices have no reliable mouseleave, so the pill would stick on screen.
    var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (cursor && finePointer) {
      var raf = null, mx = 0, my = 0;
      function move(e) {
        mx = e.clientX; my = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          cursor.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-140%)';
          raf = null;
        });
      }
      function hideCursor() { cursor.classList.remove('show'); }
      marquee.addEventListener('mouseenter', function () { cursor.classList.add('show'); });
      marquee.addEventListener('mousemove', move);
      marquee.addEventListener('mouseleave', hideCursor);
      // safety nets so the pill can never get stranded
      window.addEventListener('blur', hideCursor);
      document.addEventListener('visibilitychange', hideCursor);
      window.addEventListener('scroll', function () {
        if (!marquee.matches(':hover')) hideCursor();
      }, { passive: true });
    } else if (cursor) {
      // touch / coarse pointer: never show the floating pill, restore native tap
      cursor.remove();
      marquee.style.cursor = 'pointer';
    }
  })();

  /* ---------- About: draggable lanyard ID card with spring-back ---------- */
  (function () {
    var swing = document.getElementById('idSwing');
    if (!swing) return;
    var dragging = false, angle = 0, vel = 0, raf = null, last = 0;
    var pivotX = 0, pivotY = 0;
    var MAX = 30; // deg clamp

    function clamp(v, m){ return Math.max(-m, Math.min(m, v)); }

    function onDown(e){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      var r = swing.getBoundingClientRect();
      pivotX = r.left + r.width / 2;
      pivotY = r.top + 4;
      dragging = true;
      swing.classList.add('dragging');
      try { swing.setPointerCapture(e.pointerId); } catch(_){}
      onMove(e);
    }
    function onMove(e){
      if (!dragging) return;
      var dx = e.clientX - pivotX;
      var dy = Math.max(1, e.clientY - pivotY);
      var deg = Math.atan2(dx, dy) * 180 / Math.PI;
      angle = clamp(deg, MAX);
      swing.style.transform = 'rotate(' + angle + 'deg)';
    }
    function onUp(e){
      if (!dragging) return;
      dragging = false;
      try { swing.releasePointerCapture(e.pointerId); } catch(_){}
      // spring back (underdamped)
      vel = 0; last = performance.now();
      var step = function (now){
        var dt = Math.min(0.032, (now - last) / 1000); last = now;
        var accel = -180 * angle - 14 * vel; // stiffness, damping
        vel += accel * dt;
        angle += vel * dt;
        if (Math.abs(angle) < 0.15 && Math.abs(vel) < 0.15){
          swing.style.transform = '';
          swing.classList.remove('dragging'); // resume idle CSS sway
          raf = null;
          return;
        }
        swing.style.transform = 'rotate(' + angle + 'deg)';
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    swing.addEventListener('pointerdown', onDown);
    swing.addEventListener('pointermove', onMove);
    swing.addEventListener('pointerup', onUp);
    swing.addEventListener('pointercancel', onUp);
  })();

  /* ---------- Case study: copy-email buttons ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy-email]'), function (btn) {
    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-copy-email');
      var done = function () {
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 1700);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, done);
      } else {
        var t = document.createElement('textarea');
        t.value = email; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  });

  /* ---------- Case study: persona lightbox (zoom + pan) ---------- */
  (function () {
    var lb = document.getElementById('csLightbox');
    if (!lb) return;
    var stage = document.getElementById('csLbStage');
    var img = document.getElementById('csLbImg');
    var scale = 1, min = 1, max = 4, tx = 0, ty = 0;
    var panning = false, sx = 0, sy = 0, stx = 0, sty = 0;

    function apply() {
      img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    }
    function reset() { scale = 1; tx = 0; ty = 0; apply(); }
    function open() {
      reset();
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cs-lb-open');
    }
    function close() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cs-lb-open');
    }
    function zoom(delta, cx, cy) {
      var ns = Math.min(max, Math.max(min, scale + delta));
      if (ns === scale) return;
      // keep the point under the cursor stable-ish
      if (cx != null) {
        var r = stage.getBoundingClientRect();
        var ox = cx - r.left - r.width / 2;
        var oy = cy - r.top - r.height / 2;
        tx = ox - (ox - tx) * (ns / scale);
        ty = oy - (oy - ty) * (ns / scale);
      }
      scale = ns;
      if (scale === 1) { tx = 0; ty = 0; }
      apply();
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-lightbox-open]'), function (el) {
      el.addEventListener('click', open);
    });
    Array.prototype.forEach.call(lb.querySelectorAll('[data-lightbox-close]'), function (el) {
      el.addEventListener('click', close);
    });
    lb.querySelector('[data-zoom-in]').addEventListener('click', function () { zoom(0.5); });
    lb.querySelector('[data-zoom-out]').addEventListener('click', function () { zoom(-0.5); });
    lb.querySelector('[data-zoom-reset]').addEventListener('click', reset);

    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 0.3 : -0.3, e.clientX, e.clientY);
    }, { passive: false });

    // double-click toggles zoom
    stage.addEventListener('dblclick', function (e) {
      if (scale > 1) reset(); else zoom(1.5, e.clientX, e.clientY);
    });

    // drag to pan (pointer)
    stage.addEventListener('pointerdown', function (e) {
      if (scale <= 1) return;
      panning = true; stage.classList.add('dragging');
      sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!panning) return;
      tx = stx + (e.clientX - sx); ty = sty + (e.clientY - sy); apply();
    });
    function endPan() { panning = false; stage.classList.remove('dragging'); }
    stage.addEventListener('pointerup', endPan);
    stage.addEventListener('pointercancel', endPan);

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === '+' || e.key === '=') zoom(0.5);
      else if (e.key === '-') zoom(-0.5);
    });
  })();

  /* ---------- Case study: prototype video (click poster to play) ---------- */
  (function () {
    var wrap = document.getElementById('protoVideo');
    if (!wrap) return;
    var vid = wrap.querySelector('video');
    var btn = wrap.querySelector('.cs-play');
    var cap = wrap.querySelector('.cs-vcap');
    if (!vid || !btn) return;
    function play() {
      wrap.classList.add('playing');
      vid.setAttribute('controls', 'controls');
      if (cap) cap.style.display = 'none';
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    }
    btn.addEventListener('click', play);
    vid.addEventListener('pause', function () {
      // let users re-reveal the big play affordance only when ended
      if (vid.ended) { wrap.classList.remove('playing'); if (cap) cap.style.display = ''; vid.removeAttribute('controls'); }
    });
  })();

})();
