// The home page's tracers: dots that move over the phase portrait under the pendulum's own equations
// of motion, q' = p and p' = -sin q, each trailing a short tail. They are drawn on a canvas laid over
// the whole band (.phase__flow), so like the curves they carry on to both edges of the window.
//
// The dots start evenly spread over the strip of the plane the band shows. The flow preserves area
// (Liouville), so they stay evenly spread: a dot inside a cell circles its centre for ever, and the
// dots above and below drift right and left. A leapfrog step keeps each dot on its energy level. While
// a section is lit (its cell or pill hovered or focused, as in site.css), the dots in its cell take
// the accent colour and speed up.
//
// The scroll sequence: on screens at least 48rem wide and 37.5rem tall, without prefers-reduced-motion,
// this adds .morph-on to <html>, which pins the home page under the header (site.css), and scrolling
// moves the dots instead of the page. The canvas then covers the whole stage. One step of scrolling
// for each selected project moves the dots into its picture (js/project-shapes.js), beside its card;
// after the last, the footer fades in. Each picture holds still for the first and last fifth of a
// step. Over the first step the name, the curves, the pills and the caption fade out, the dots' tails
// fade with them, and the dots take on the pictures' colours and square shape, while the particles the
// pictures need beyond the portrait's dots fade in from the curves. Back at the top, the portrait is
// as it is without the sequence.
//
// With prefers-reduced-motion there are no tracers, and the loop runs only while the band is on screen.
import { COUNT, tone, shapes, scatter } from './project-shapes.js';

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
  // The energies of the curves it draws: closed orbits round the centres, and rotations above and
  // below the separatrix (E = 1).
  var ORBITS = [-0.4, 0, 0.4, 0.75], ROTATIONS = [1.4, 2.05, 2.9];

  var SPEED = 0.3;          // time units of the pendulum per second: a small swing takes about 21 s
  var LIT_SPEED = 0.99;     // the same for a lit cell's dots: a small swing takes about 6.3 s
  var TAIL = 16;            // tail samples kept per dot
  var SAMPLE = 1 / 20;      // seconds between tail samples, so a tail shows the last 0.8 s
  var FADE = 0.2;           // seconds for a cell's dots to light up or go back
  var EDGE = 24;            // the band's dots fade out over its top and bottom 24px, as in site.css

  // The linked cells, centred on q = -2 pi, 0 and 2 pi, in the order of the dots' groups 1 to 3.
  var sections = ['about', 'publications', 'projects'].map(function (key) {
    return {
      links: document.querySelectorAll('.phase__cell--' + key + ', .phase__pill--' + key),
      lit: 0
    };
  });

  // Sizes in CSS pixels: the canvas, the panel's left edge and the band's top edge within it, pixels
  // per viewBox unit, and the band's own width and height.
  var width = 0, height = 0, left = 0, bandTop = 0, unit = 1, bandWidth = 0, bandHeight = 0;
  // The simulated strip: q from qa to qa + span, whole periods from saddle to saddle, a little wider
  // than the band shows. A dot leaving one end comes back in at the other, a whole number of periods
  // away, which is the same point of the pendulum's motion.
  var qa = 0, span = TAU;

  var count = 0, q, p, tailQ, tailP, groups;
  var newest = 0, filled = 0, sinceSample = 0;
  // The extra particles the pictures need beyond the portrait's dots, on the curves: particle k of the
  // pictures is dot k for k < count, and extra particle k - count after that.
  var extra = 0, xq, xp;
  // Each dot's group split by its colour in the pictures, the extra particles likewise, and every
  // particle likewise (by its index in the pictures).
  var groupTones, extraTones, allTones;
  // For each particle, while the sequence runs: where it is drawn, its size, and for a dot, how far it
  // has moved from its place in the portrait (its tail moves with it).
  var X, Y, Z, dx, dy;

  var colours = { fg: [232, 236, 242], accent: [246, 190, 85], muted: [154, 166, 184], curve: [82, 97, 120] };
  var visible = false, frameId = 0, last = 0;

  // The scroll sequence: the track the visitor scrolls through, the stage pinned in it, and one step
  // for each selected project's card, with its picture.
  var track = document.querySelector('[data-home-morph]');
  var stage = track && track.querySelector('.home-morph__stage');
  var intro = stage && stage.querySelector('.home-intro');
  var caption = band.parentNode.querySelector('figcaption');
  var header = document.querySelector('.site-header');
  var footer = document.querySelector('.site-footer');
  var steps = stage ? Array.prototype.map.call(stage.querySelectorAll('[data-step]'), function (item) {
    return { item: item, shape: shapes[item.getAttribute('data-slug')] || scatter };
  }) : [];
  var roomy = matchMedia('(min-width: 48rem) and (min-height: 37.5rem)');
  var STEP = 1.4;           // window heights of scrolling for each step
  var FOOTER = 0.4;         // window heights of scrolling over which the footer fades in, at the end
  var HOLD = 0.2;           // each picture holds still for the first and last fifth of a step
  var on = false;
  var progress = 0;         // how far through the steps the visitor has scrolled, from 0 to 1
  var active = 0;           // the card showing: 0 for none (the name and the figure), then 1, 2, ...
  var shown = { intro: 1, footer: 0 };
  var headerHeight = 0;
  var clock = 0;            // seconds of animation in the pictures
  var area = { cx: 0, cy: 0, w: 1, h: 1 };    // the space for the picture beside the card
  var at = [0, 0, 0], to = [0, 0, 0];
  var rounded = typeof ctx.roundRect === 'function';
  var css = {};             // the colours as CSS strings, for the pictures' overlays

  function sx(qv) { return left + unit * VIEW_W * (qv + 3 * Math.PI) / (6 * Math.PI); }
  function sy(pv) { return bandTop + unit * (MID - SCALE * pv); }
  function qAt(x) { return (x - left) / (unit * VIEW_W) * 6 * Math.PI - 3 * Math.PI; }

  // The canvas covers the band, or while the sequence runs, the whole stage. The dots are seeded again
  // only when the band's own geometry changes.
  function layout() {
    var host = (on ? stage : band).getBoundingClientRect();
    var b = band.getBoundingClientRect(), r = panel.getBoundingClientRect();
    var l = r.left - host.left, u = r.width / VIEW_W;
    // Rounded as the browser places the band's own canvas, on a whole pixel, so the dots land on the
    // same pixels in either.
    bandTop = Math.round(b.top) - Math.round(host.top);
    if (host.width !== width || host.height !== height) {
      width = host.width;
      height = host.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    if (b.width !== bandWidth || b.height !== bandHeight || l !== left || u !== unit) {
      bandWidth = b.width;
      bandHeight = b.height;
      left = l;
      unit = u;
      var margin = 1; // room for a tail to leave the band before its dot wraps round
      qa = TAU * Math.floor((qAt(0) - margin + Math.PI) / TAU) - Math.PI;
      span = TAU * Math.ceil((qAt(bandWidth) + margin - qa) / TAU);
      seed();
    }
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

    // The extra particles, each on one of the curves: a closed orbit round one of the strip's centres,
    // the separatrix, or a rotation, in rough proportion to the curves' lengths.
    extra = Math.max(0, COUNT - count);
    xq = new Float64Array(extra);
    xp = new Float64Array(extra);
    var centres = Math.round(span / TAU);
    for (k = 0; k !== extra; k++) {
      var r = Math.random(), sign = Math.random() < 0.5 ? -1 : 1, energy;
      if (r < 0.32) {
        energy = ORBITS[Math.floor(Math.random() * ORBITS.length)];
        var phase = Math.random() * TAU;
        xq[k] = qa + Math.PI + TAU * Math.floor(Math.random() * centres) + Math.acos(-energy) * Math.sin(phase);
        sign = Math.cos(phase) < 0 ? -1 : 1;
      } else {
        energy = r < 0.5 ? 1 : ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
        xq[k] = qa + Math.random() * span;
      }
      xp[k] = sign * Math.sqrt(Math.max(0, 2 * (energy + Math.cos(xq[k]))));
    }

    var all = count + extra;
    groupTones = groups.map(function (list) { return byTone(list, 0); });
    extraTones = byTone(Int32Array.from({ length: extra }, function (v, k) { return k; }), count);
    allTones = byTone(Int32Array.from({ length: all }, function (v, k) { return k; }), 0);
    X = new Float64Array(all);
    Y = new Float64Array(all);
    Z = new Float64Array(all);
    dx = new Float64Array(count);
    dy = new Float64Array(count);
  }

  // The indices in list, split by the colour their particles take in the pictures. A particle's index
  // in the pictures is its index in the list plus offset.
  function byTone(list, offset) {
    var lists = [[], [], []];
    for (var i = 0; i !== list.length; i++) lists[tone(list[i] + offset)].push(list[i]);
    return lists.map(function (l) { return Int32Array.from(l); });
  }

  function lit(s) {
    var links = sections[s].links;
    for (var i = 0; i !== links.length; i++) {
      if (links[i].matches(':hover') || links[i].matches(':focus-visible')) return true;
    }
    return false;
  }

  // One leapfrog step for each dot, and while the sequence runs (withExtra), for each extra particle.
  function advance(dt, withExtra) {
    var g, s, i, k, n, qv, pv, shift, substeps, h;
    for (s = 0; s !== 3; s++) {
      var target = lit(s) ? 1 : 0, sec = sections[s];
      sec.lit = target ? Math.min(1, sec.lit + dt / FADE) : Math.max(0, sec.lit - dt / FADE);
    }
    for (g = 0; g !== 4; g++) {
      var t = dt * (g ? SPEED + (LIT_SPEED - SPEED) * sections[g - 1].lit : SPEED);
      substeps = Math.ceil(t / 0.04);
      h = t / substeps;
      var list = groups[g];
      for (i = 0; i !== list.length; i++) {
        k = list[i];
        qv = q[k];
        pv = p[k];
        for (n = 0; n !== substeps; n++) {
          pv -= 0.5 * h * Math.sin(qv);
          qv += h * pv;
          pv -= 0.5 * h * Math.sin(qv);
        }
        shift = qv - qa >= span ? -span : qv - qa < 0 ? span : 0;
        if (shift) {
          qv += shift;
          for (n = 0; n !== TAIL; n++) tailQ[k * TAIL + n] += shift;
        }
        q[k] = qv;
        p[k] = pv;
      }
    }
    if (withExtra) {
      substeps = Math.ceil(dt * SPEED / 0.04);
      h = dt * SPEED / substeps;
      for (k = 0; k !== extra; k++) {
        qv = xq[k];
        pv = xp[k];
        for (n = 0; n !== substeps; n++) {
          pv -= 0.5 * h * Math.sin(qv);
          qv += h * pv;
          pv -= 0.5 * h * Math.sin(qv);
        }
        xq[k] = qv - qa >= span ? qv - span : qv - qa < 0 ? qv + span : qv;
        xp[k] = pv;
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
  function mixed(a, b, t) {
    return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); });
  }
  function mix(a, b, t) { return rgb(mixed(a, b, t)); }
  function tones() { return [colours.accent, colours.muted, colours.curve]; }

  // Each tail is drawn as segments that fade towards its end; segment j of every dot in a group is one
  // path, so a frame is a few dozen strokes, however many dots there are.
  // e is how far the dots have gone towards the first picture. At 0 they are the portrait's; as e grows,
  // dot k is drawn at (X, Y) with size Z, its tail moves with it by (dx, dy) and fades as the curves
  // do, and it turns from round to square and from its own colour to its colour in the pictures. The
  // extra particles fade in.
  function drawDots(e) {
    var fade = (1 - e) * (1 - e);
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.3;
    for (var g = 0; g !== 4; g++) {
      var list = groups[g], light = g ? sections[g - 1].lit : 0;
      if (!list.length) continue;
      var colour = mixed(colours.fg, colours.accent, light);
      ctx.strokeStyle = ctx.fillStyle = rgb(colour);
      var i, k, x, y;
      for (var j = 0; fade && j !== filled; j++) {
        var a = (j ? newest - j + 1 + TAIL : 0) % TAIL, b = (newest - j + TAIL) % TAIL;
        ctx.globalAlpha = (0.42 + 0.3 * light) * Math.pow(1 - j / filled, 1.6) * fade;
        ctx.beginPath();
        for (i = 0; i !== list.length; i++) {
          k = list[i];
          ctx.moveTo(sx(j ? tailQ[k * TAIL + a] : q[k]) + dx[k], sy(j ? tailP[k * TAIL + a] : p[k]) + dy[k]);
          ctx.lineTo(sx(tailQ[k * TAIL + b]) + dx[k], sy(tailP[k * TAIL + b]) + dy[k]);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 0.8 + 0.2 * light + (0.2 - 0.2 * light) * e;
      if (e) {
        squares(groupTones[g], 0, colour, e);
        continue;
      }
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
    if (e) {
      ctx.globalAlpha = e;
      squares(extraTones, count, colours.fg, e);
    }
    ctx.globalAlpha = 1;
  }

  // The particles in lists (split by tone; offset turns an index in a list into one in the pictures),
  // as squares of size Z at (X, Y), with corners rounded by 1.6px * (1 - e), in their tone mixed from
  // colour by e.
  function squares(lists, offset, colour, e) {
    var palette = tones(), corner = 1.6 * (1 - e);
    for (var t = 0; t !== 3; t++) {
      var list = lists[t];
      if (!list.length) continue;
      ctx.fillStyle = mix(colour, palette[t], e);
      ctx.beginPath();
      for (var i = 0; i !== list.length; i++) {
        var k = list[i] + offset, z = Z[k];
        if (rounded && corner) ctx.roundRect(X[k] - z / 2, Y[k] - z / 2, z, z, Math.min(corner, z / 2));
        else ctx.rect(X[k] - z / 2, Y[k] - z / 2, z, z);
      }
      ctx.fill();
    }
  }

  // The band's edges, as .phase__flow's mask draws them without the sequence: the dots fade out over
  // its top and bottom 24px, and are hidden beyond. The mask lifts as the dots leave for the picture.
  function mask(e) {
    var outside = 1 - (1 - e) * (1 - e);
    if (outside >= 1 || !height) return;
    var stop = function (y) { return Math.min(1, Math.max(0, y / height)); };
    var gradient = ctx.createLinearGradient(0, 0, 0, height), dim = 'rgba(0,0,0,' + outside + ')';
    gradient.addColorStop(0, dim);
    gradient.addColorStop(stop(bandTop), dim);
    gradient.addColorStop(stop(bandTop + EDGE), '#000');
    gradient.addColorStop(stop(bandTop + bandHeight - EDGE), '#000');
    gradient.addColorStop(stop(bandTop + bandHeight), dim);
    gradient.addColorStop(1, dim);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }

  // Where the sequence is: the step (0 for the first, from the portrait) and how far its picture has
  // formed, eased, with a hold at each end.
  function position() {
    var seg = progress * steps.length, i = Math.min(steps.length - 1, Math.floor(seg)), f = seg - i;
    f = f <= HOLD ? 0 : f >= 1 - HOLD ? 1 : (f - HOLD) / (1 - 2 * HOLD);
    return { step: i, e: f * f * (3 - 2 * f) };
  }

  function drawSequence() {
    var now = position(), e = now.e, shape, k, x, y;
    fadeIntro(now.step ? 0 : (1 - e) * (1 - e));
    if (now.step) return drawPictures(steps[now.step - 1].shape, steps[now.step].shape, e);
    // The first step, from the portrait to the first picture.
    shape = steps[0].shape;
    if (e) {
      for (k = 0; k !== count; k++) {
        shape.at(k, clock, area, to);
        x = sx(q[k]);
        y = sy(p[k]);
        dx[k] = (to[0] - x) * e;
        dy[k] = (to[1] - y) * e;
        X[k] = x + dx[k];
        Y[k] = y + dy[k];
        Z[k] = 3.2 + (to[2] - 3.2) * e;
      }
      for (k = 0; k !== extra; k++) {
        shape.at(count + k, clock, area, to);
        x = sx(xq[k]);
        y = sy(xp[k]);
        X[count + k] = x + (to[0] - x) * e;
        Y[count + k] = y + (to[1] - y) * e;
        Z[count + k] = 3.2 + (to[2] - 3.2) * e;
      }
    } else {
      dx.fill(0);
      dy.fill(0);
    }
    drawDots(e);
    mask(e);
    if (shape.overlay && e) shape.overlay(ctx, area, e * e, css);
  }

  // A step between two pictures. Each one's overlay is drawn at the square of its weight, so it is
  // gone before the particles have moved far.
  function drawPictures(from, into, e) {
    if (from.overlay && e < 1) from.overlay(ctx, area, (1 - e) * (1 - e), css);
    if (into.overlay && e > 0) into.overlay(ctx, area, e * e, css);
    for (var k = 0; k !== X.length; k++) {
      if (e < 1) from.at(k, clock, area, at);
      if (e > 0) into.at(k, clock, area, to);
      if (e === 0) { X[k] = at[0]; Y[k] = at[1]; Z[k] = at[2]; continue; }
      if (e === 1) { X[k] = to[0]; Y[k] = to[1]; Z[k] = to[2]; continue; }
      X[k] = at[0] + (to[0] - at[0]) * e;
      Y[k] = at[1] + (to[1] - at[1]) * e;
      Z[k] = at[2] + (to[2] - at[2]) * e;
    }
    ctx.globalAlpha = 1;
    squares(allTones, 0, colours.fg, 1);
  }

  // How much of the first figure shows: the name, the curves, the pills and the caption (site.css).
  function fadeIntro(v) {
    v = Math.round(v * 1000) / 1000;
    if (v === shown.intro) return;
    shown.intro = v;
    stage.style.setProperty('--intro', v);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (on) drawSequence();
    else if (!motion.matches && count) drawDots(0);
  }

  function running() { return visible && !motion.matches; }

  function frame(now) {
    frameId = 0;
    if (!running()) return draw();
    var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    // While the sequence runs, the portrait moves only while it shows: before the first picture forms.
    if (!on) advance(dt, false);
    else if (progress * steps.length < 1 - HOLD) advance(dt, true);
    clock += dt;
    draw();
    frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (frameId || !running()) return draw();
    last = 0;
    frameId = requestAnimationFrame(frame);
  }

  // While the sequence runs: the header's height, which the stage is pinned under; a narrower panel
  // for the figure, if the window is too short for the name, the band and the caption together; the
  // track's length; and the box the name and the band fill, which each card shares with its picture.
  // The box ends above the footer, which fades in over the bottom of the window at the end. The card
  // is at its bottom left.
  function measure() {
    if (!on) return;
    headerHeight = header ? header.offsetHeight : 0;
    root.style.setProperty('--header-h', headerHeight + 'px');
    var s = stage.getBoundingClientRect(), b = band.getBoundingClientRect(), column = intro.getBoundingClientRect();
    var room = s.height - (b.top - s.top) - (caption.getBoundingClientRect().bottom - b.bottom) - 16;
    if (column.width * 2 * MID / VIEW_W > room) {
      stage.style.setProperty('--phase-w', Math.max(0, room) * VIEW_W / (2 * MID) + 'px');
    } else {
      stage.style.removeProperty('--phase-w');
    }
    track.style.height = s.height + window.innerHeight * (STEP * steps.length + FOOTER) + 'px';
    b = band.getBoundingClientRect();
    var boxTop = intro.querySelector('h1').getBoundingClientRect().top - s.top;
    var boxBottom = Math.min(b.bottom - s.top, s.height - (footer ? footer.offsetHeight : 0));
    var x0 = column.left - s.left, w = column.width, boxHeight = boxBottom - boxTop;
    stage.style.setProperty('--box-top', boxTop + 'px');
    stage.style.setProperty('--box-h', boxHeight + 'px');
    // The picture goes beside the card or above it, whichever gives it more room.
    stage.style.setProperty('--panel-w', w + 'px');
    var cards = 0, cardWidth = Math.min(440, 0.42 * w);
    steps.forEach(function (step) { cards = Math.max(cards, step.item.offsetHeight); });
    var beside = Math.min(w - cardWidth - 48, boxHeight) >= Math.min(w, boxHeight - cards - 24);
    if (beside) stage.style.setProperty('--panel-w', cardWidth + 'px');
    var x1 = beside ? x0 + cardWidth + 48 : x0, y1 = beside ? boxBottom : boxBottom - cards - 24;
    area.cx = (x1 + x0 + w) / 2;
    area.w = x0 + w - x1;
    area.cy = (boxTop + y1) / 2;
    area.h = Math.max(1, y1 - boxTop);
  }

  // How far through the sequence the visitor has scrolled. The stage is pinned from the top of the
  // track, under the header; after the last step, the footer fades in.
  function scrolled() {
    if (!on) return;
    var y = headerHeight - track.getBoundingClientRect().top, run = window.innerHeight * STEP * steps.length;
    progress = Math.min(1, Math.max(0, y / run));
    var f = Math.min(1, Math.max(0, (y - run) / (window.innerHeight * FOOTER)));
    f = Math.round(f * f * (3 - 2 * f) * 1000) / 1000;
    if (f !== shown.footer) {
      shown.footer = f;
      footer.style.opacity = f;
      footer.classList.toggle('is-shown', f > 0.5);
    }
    var next = Math.round(progress * steps.length);
    if (next !== active) showCard(next);
    if (!frameId) draw();
  }

  function showCard(n) {
    active = n;
    stage.setAttribute('data-active', n);
    steps.forEach(function (step, i) { step.item.classList.toggle('is-current', i + 1 === n); });
  }

  // Scrolls to the point a given number of window heights into the sequence.
  function jumpTo(screens) {
    var top = track.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo(0, top + screens * window.innerHeight);
  }

  // The sequence runs on screens big enough for it, without prefers-reduced-motion. Switching it on or
  // off moves the canvas between the stage and the band, and leaves the dots where they are.
  function setMode() {
    var next = !!stage && !!steps.length && roomy.matches && !motion.matches;
    if (next !== on) {
      on = next;
      root.classList.toggle('morph-on', on);
      (on ? stage : band).append(canvas);
      if (!on) {
        ['--intro', '--phase-w', '--box-top', '--box-h', '--panel-w'].forEach(function (name) {
          stage.style.removeProperty(name);
        });
        root.style.removeProperty('--header-h');
        track.style.height = '';
        footer.style.opacity = '';
        footer.classList.remove('is-shown');
        shown = { intro: 1, footer: 0 };
        showCard(0);
        if (dx) { dx.fill(0); dy.fill(0); }
      }
    }
    measure();
    layout();
    scrolled();
    start();
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
    colours.muted = token('--muted');
    colours.curve = token('--curve');
    css.muted = rgb(colours.muted);
    if (!frameId) draw();
  }

  canvas.className = 'phase__flow';
  canvas.setAttribute('aria-hidden', 'true');
  band.append(canvas);
  readColours();
  setMode();
  requestAnimationFrame(function () { canvas.classList.add('is-on'); });

  function resized() {
    measure();
    layout();
    scrolled();
  }
  // The stage's layout also changes when the name or the header changes height, as when the fonts
  // load, which moves the band within the stage.
  var observer = new ResizeObserver(resized);
  [band, stage, intro, header].forEach(function (element) { if (element) observer.observe(element); });
  new IntersectionObserver(function (entries) {
    visible = entries[entries.length - 1].isIntersecting;
    start();
  }).observe(band);
  motion.addEventListener('change', setMode);
  roomy.addEventListener('change', setMode);
  window.addEventListener('scroll', scrolled, { passive: true });
  new MutationObserver(readColours).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new MutationObserver(readColours).observe(document.head, { childList: true, subtree: true, characterData: true });

  // Keyboard users: focus on a link that is faded out scrolls to where it shows. A card's links show
  // at its picture, the pills at the start, and the footer's links at the end.
  if (stage) {
    stage.addEventListener('focusin', function (event) {
      if (!on) return;
      var item = event.target.closest('[data-step]'), n = item ? Number(item.getAttribute('data-step')) : 0;
      if (n !== active) jumpTo(n * STEP);
    });
    footer.addEventListener('focusin', function () {
      if (on && shown.footer < 1) jumpTo(steps.length * STEP + FOOTER);
    });
  }
})();
