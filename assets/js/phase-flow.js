// The home page's tracers: dots that move over the phase portrait under the pendulum's own equations
// of motion, q' = p and p' = -sin q, each trailing a short tail. They are drawn on a canvas laid over
// the whole band (.phase__flow), so like the curves they carry on to both edges of the window.
//
// The dots start evenly spread over the strip of the plane the band shows. The flow preserves area
// (Liouville), so they stay evenly spread: a dot inside a cell circles its centre for ever, and the
// dots above and below drift right and left. A leapfrog step keeps each dot on its energy level. While
// a section is lit (its cell, pill or section link hovered or focused, as in site.css), the dots in
// its cell take the accent colour and speed up.
//
// With prefers-reduced-motion there are no tracers, and the loop runs only while the band is on screen.
//
// Prototype switch: while <html data-phase-probe> is set (from the development panel), moving the
// mouse over the figure draws the orbit through the pointer.
(function () {
  var band = document.querySelector('.phase__band');
  var panel = band && band.querySelector('.phase__panel');
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!panel || !ctx) return;

  var root = document.documentElement;
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var TAU = 2 * Math.PI;

  // The figure's geometry, as in scripts/phase-portrait.py: the panel is 1200 viewBox units wide and
  // spans q from -3 pi to 3 pi; p = 0 is at y = 220, and one unit of p is 76 units of y.
  var VIEW_W = 1200, MID = 220, SCALE = 76;

  var SPEED = 0.9;          // time units of the pendulum per second: a small swing takes about 7 s
  var BOOST = 1.2;          // extra speed of a lit cell's dots
  var TAIL = 16;            // tail samples kept per dot
  var SAMPLE = 1 / 40;      // seconds between tail samples, so a tail shows the last 0.4 s
  var FADE = 0.2;           // seconds for a cell's dots to light up or go back

  // The linked cells, centred on q = -2 pi, 0 and 2 pi, in the order of the dots' groups 1 to 3.
  var sections = ['about', 'publications', 'projects'].map(function (key) {
    return {
      links: document.querySelectorAll('.phase__cell--' + key + ', .phase__pill--' + key + ', .section-link--' + key),
      lit: 0
    };
  });

  // Sizes in CSS pixels: the band, the panel's left edge within it, and pixels per viewBox unit.
  var width = 0, height = 0, left = 0, unit = 1;
  // The simulated strip: q from qa to qa + span, whole periods from saddle to saddle, a little wider
  // than the band shows. A dot leaving one end comes back in at the other, a whole number of periods
  // away, which is the same point of the pendulum's motion.
  var qa = 0, span = TAU;

  var count = 0, q, p, tailQ, tailP, groups;
  var newest = 0, filled = 0, sinceSample = 0;

  var colours = { fg: [232, 236, 242], accent: [246, 190, 85] };
  var pointer = null;
  var visible = false, frameId = 0, last = 0;

  function sx(qv) { return left + unit * VIEW_W * (qv + 3 * Math.PI) / (6 * Math.PI); }
  function sy(pv) { return unit * (MID - SCALE * pv); }
  function qAt(x) { return (x - left) / (unit * VIEW_W) * 6 * Math.PI - 3 * Math.PI; }
  function pAt(y) { return (MID - y / unit) / SCALE; }

  function layout() {
    var b = band.getBoundingClientRect(), r = panel.getBoundingClientRect();
    if (b.width === width && b.height === height && r.left - b.left === left) return;
    width = b.width;
    height = b.height;
    left = r.left - b.left;
    unit = r.width / VIEW_W;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var margin = 1; // room for a tail to leave the band before its dot wraps round
    qa = TAU * Math.floor((qAt(0) - margin + Math.PI) / TAU) - Math.PI;
    span = TAU * Math.ceil((qAt(width) + margin - qa) / TAU);
    seed();
    draw();
  }

  // One dot in each cell of a jittered grid, about `gap` pixels apart. The grid covers every energy
  // the band can show: up to that of its top and bottom edges at a saddle. That set is invariant, so
  // the band stays evenly filled; dots with more energy would leave it near the centres and leave
  // gaps behind.
  function seed() {
    var gap = Math.max(26, Math.min(48, 0.04 * unit * VIEW_W));
    var pEdge = MID / SCALE;
    var eMax = pEdge * pEdge / 2 + 1;
    var pMax = Math.sqrt(2 * (eMax + 1));
    var dq = gap / (unit * VIEW_W / (6 * Math.PI)), dp = gap / (unit * SCALE);
    var nq = Math.ceil(span / dq), np = Math.ceil(2 * pMax / dp);
    var qs = [], ps = [];
    for (var i = 0; i !== nq; i++) {
      for (var j = 0; j !== np; j++) {
        var qv = qa + (i + Math.random()) * span / nq;
        var pv = -pMax + (j + Math.random()) * 2 * pMax / np;
        if (pv * pv / 2 - Math.cos(qv) > eMax) continue;
        qs.push(qv);
        ps.push(pv);
      }
    }
    count = qs.length;
    q = Float64Array.from(qs);
    p = Float64Array.from(ps);
    tailQ = new Float64Array(count * TAIL);
    tailP = new Float64Array(count * TAIL);
    // Group 0 is every dot outside the linked cells. A dot below the separatrix's energy never leaves
    // its cell, and the strip's ends are saddles, so a dot's group never changes.
    var lists = [[], [], [], []];
    for (var k = 0; k < count; k++) {
      var cell = Math.round(q[k] / TAU);
      var bound = p[k] * p[k] / 2 - Math.cos(q[k]) < 1;
      lists[bound && Math.abs(cell) <= 1 ? cell + 2 : 0].push(k);
    }
    groups = lists.map(function (list) { return Int32Array.from(list); });
    newest = 0;
    filled = 0;
    sinceSample = 0;
  }

  function lit(s) {
    var links = sections[s].links;
    for (var i = 0; i !== links.length; i++) {
      if (links[i].matches(':hover') || links[i].matches(':focus-visible')) return true;
    }
    return false;
  }

  function advance(dt) {
    var g, s, i, k;
    for (s = 0; s !== 3; s++) {
      var target = lit(s) ? 1 : 0, sec = sections[s];
      sec.lit = target ? Math.min(1, sec.lit + dt / FADE) : Math.max(0, sec.lit - dt / FADE);
    }
    for (g = 0; g !== 4; g++) {
      var t = dt * SPEED * (g ? 1 + BOOST * sections[g - 1].lit : 1);
      var steps = Math.ceil(t / 0.04), h = t / steps;
      var list = groups[g];
      for (i = 0; i !== list.length; i++) {
        k = list[i];
        var qv = q[k], pv = p[k];
        for (var n = 0; n !== steps; n++) {
          pv -= 0.5 * h * Math.sin(qv);
          qv += h * pv;
          pv -= 0.5 * h * Math.sin(qv);
        }
        var shift = qv - qa >= span ? -span : qv - qa < 0 ? span : 0;
        if (shift) {
          qv += shift;
          for (n = 0; n !== TAIL; n++) tailQ[k * TAIL + n] += shift;
        }
        q[k] = qv;
        p[k] = pv;
      }
    }
    sinceSample += dt;
    if (sinceSample >= SAMPLE || !filled) {
      sinceSample = filled ? Math.min(sinceSample - SAMPLE, SAMPLE) : 0;
      newest = (newest + 1) % TAIL;
      for (k = 0; k !== count; k++) {
        tailQ[k * TAIL + newest] = q[k];
        tailP[k * TAIL + newest] = p[k];
      }
      filled = Math.min(filled + 1, TAIL - 1);
    }
  }

  function rgb(c) { return 'rgb(' + c.join(',') + ')'; }
  function mix(a, b, t) {
    return rgb([0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }));
  }

  // Each tail is drawn as segments that fade towards its end; segment j of every dot in a group is one
  // path, so a frame is a few dozen strokes, however many dots there are.
  function drawDots() {
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.3;
    for (var g = 0; g !== 4; g++) {
      var list = groups[g], light = g ? sections[g - 1].lit : 0;
      if (!list.length) continue;
      var colour = mix(colours.fg, colours.accent, light);
      ctx.strokeStyle = ctx.fillStyle = colour;
      var i, k, x, y;
      for (var j = 0; j !== filled; j++) {
        var a = (j ? newest - j + 1 + TAIL : 0) % TAIL, b = (newest - j + TAIL) % TAIL;
        ctx.globalAlpha = (0.42 + 0.3 * light) * Math.pow(1 - j / filled, 1.6);
        ctx.beginPath();
        for (i = 0; i !== list.length; i++) {
          k = list[i];
          ctx.moveTo(sx(j ? tailQ[k * TAIL + a] : q[k]), sy(j ? tailP[k * TAIL + a] : p[k]));
          ctx.lineTo(sx(tailQ[k * TAIL + b]), sy(tailP[k * TAIL + b]));
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 0.8 + 0.2 * light;
      ctx.beginPath();
      for (i = 0; i !== list.length; i++) {
        k = list[i];
        x = sx(q[k]);
        y = sy(p[k]);
        ctx.moveTo(x + 1.6, y);
        ctx.arc(x, y, 1.6, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // The orbit through the pointer: the level set of H(q, p) = p^2 / 2 - cos q at the pointer's energy
  // E. Below the separatrix (E below 1) it is the closed orbit round the nearest centre; above it, the
  // rotation on the pointer's side of p = 0.
  function drawProbe() {
    var q0 = qAt(pointer.x), p0 = pAt(pointer.y), E = p0 * p0 / 2 - Math.cos(q0);
    ctx.beginPath();
    if (E < 1) {
      var qc = TAU * Math.round(q0 / TAU), reach = Math.acos(Math.max(-1, -E));
      for (var k = 0; k !== 121; k++) {
        var t = TAU * k / 120, dq = reach * Math.cos(t);
        var pv = Math.sqrt(Math.max(0, 2 * (E + Math.cos(dq)))) * (Math.sin(t) > 0 ? 1 : -1);
        ctx.lineTo(sx(qc + dq), sy(pv));
      }
    } else {
      var side = p0 < 0 ? -1 : 1;
      for (var x = -4; x <= width + 4; x += 3) {
        ctx.lineTo(x, sy(side * Math.sqrt(2 * (E + Math.cos(qAt(x))))));
      }
    }
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = ctx.fillStyle = rgb(colours.accent);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, 3.5, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (!motion.matches && count) drawDots();
    if (pointer) drawProbe();
  }

  function running() { return visible && !motion.matches; }

  function frame(now) {
    frameId = 0;
    if (!running()) return draw();
    advance(last ? Math.min((now - last) / 1000, 0.1) : 0);
    last = now;
    draw();
    frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (frameId || !running()) return draw();
    last = 0;
    frameId = requestAnimationFrame(frame);
  }

  // Colours come from the tokens, so the dots follow the theme button and the accent preview panel.
  // A 1px canvas turns whatever the token holds into sRGB bytes.
  var swatch = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  function token(name) {
    swatch.clearRect(0, 0, 1, 1);
    swatch.fillStyle = '#000';
    swatch.fillStyle = getComputedStyle(root).getPropertyValue(name).trim();
    swatch.fillRect(0, 0, 1, 1);
    var d = swatch.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  function readColours() {
    colours.fg = token('--fg');
    colours.accent = token('--accent');
    if (!frameId) draw();
  }

  canvas.className = 'phase__flow';
  canvas.setAttribute('aria-hidden', 'true');
  band.append(canvas);
  readColours();
  layout();
  requestAnimationFrame(function () { canvas.classList.add('is-on'); });

  new ResizeObserver(layout).observe(band);
  new IntersectionObserver(function (entries) {
    visible = entries[entries.length - 1].isIntersecting;
    start();
  }).observe(band);
  motion.addEventListener('change', start);
  new MutationObserver(readColours).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new MutationObserver(readColours).observe(document.head, { childList: true, subtree: true, characterData: true });

  band.addEventListener('pointermove', function (event) {
    var on = event.pointerType !== 'touch' && root.hasAttribute('data-phase-probe');
    if (!on && !pointer) return;
    var b = band.getBoundingClientRect();
    pointer = on ? { x: event.clientX - b.left, y: event.clientY - b.top } : null;
    if (!frameId) draw();
  });
  band.addEventListener('pointerleave', function () {
    pointer = null;
    if (!frameId) draw();
  });
})();
