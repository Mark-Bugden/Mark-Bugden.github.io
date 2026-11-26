// The pictures the home page's dots form for the selected projects (data/projects.yaml, home: true),
// keyed by the project's slug. js/phase-flow.js moves the dots from the phase portrait into each one
// in turn as the visitor scrolls. The pictures are stylised: none of them shows real data.
//
// A shape's `at(k, s, area, out)` puts particle k at time s (seconds) into out: [x, y, size], a square
// of that size centred on (x, y), in CSS pixels. area is the space beside the card: { cx, cy, w, h },
// its centre and size. Each particle keeps one role in every shape, chosen by rnd(k, j), so nothing
// jumps between frames. A shape can also have an overlay(ctx, area, alpha, colour), a line drawing
// that fades in and out with it.

var TAU = 2 * Math.PI;

// The number of particles in every picture. The portrait has fewer; the rest fade in on its curves.
export var COUNT = 1600;

// Deterministic pseudo-random numbers in [0, 1), one for each particle k and purpose j.
export function rnd(k, j) {
  var v = Math.sin(k * 12.9898 + j * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

// Each particle's colour in the pictures: 0 is --accent (30%), 1 --muted (42%) and 2 --curve (28%).
export function tone(k) {
  var r = rnd(k, 4);
  return r < 0.3 ? 0 : r < 0.72 ? 1 : 2;
}

// photon-orbits-5d: five tilted great circles on a sphere, with the particles going round them,
// and the sphere's outline.
var TILTS = [0.3, 1.0, 1.7, 2.3, 2.9], INCLINATIONS = [1.25, 0.9, 1.1, 0.6, 1.4];
function sphere(k, s, area, out) {
  var R = 0.45 * Math.min(area.w, area.h);
  var ring = Math.floor(rnd(k, 2) * 6), a = rnd(k, 1) * TAU;
  if (ring === 5) {
    out[0] = area.cx + R * Math.cos(a + s * 0.1);
    out[1] = area.cy + R * Math.sin(a + s * 0.1);
  } else {
    var tilt = TILTS[ring], x = Math.cos(a + s * 0.5), y = Math.sin(a + s * 0.5) * Math.cos(INCLINATIONS[ring]);
    out[0] = area.cx + R * (x * Math.cos(tilt) - y * Math.sin(tilt));
    out[1] = area.cy + R * (x * Math.sin(tilt) + y * Math.cos(tilt));
  }
  out[2] = 2;
}

// zombie-outbreak: the Czech Republic, filled, with a slowly pulsing ring round Prague.
// The border is 116 points from Natural Earth 1:50m (public domain, via the world-atlas package,
// country 203): an equirectangular projection scaled by the cosine of the central latitude, simplified
// with Douglas-Peucker. Units are 1/1000 of the country's half-width; x is east, y is south, and the
// origin is the centre of the bounding box, so the country spans x from -1 to 1 and y from -0.566 to
// 0.566.
var CZ = '1000,136 930,145 876,191 861,216 800,252 778,341 768,354 727,371 681,422 641,444 600,450 512,435 496,444 475,472 443,555 421,507 371,493 321,464 302,463 269,491 177,484 107,433 71,435 -45,383 -89,396 -117,372 -139,370 -160,476 -190,475 -200,487 -224,522 -229,555 -289,543 -325,566 -419,554 -437,512 -489,478 -568,389 -600,391 -644,326 -688,298 -755,219 -785,219 -805,203 -840,159 -878,77 -911,31 -875,-41 -891,-69 -965,-134 -1000,-212 -998,-232 -975,-222 -944,-172 -892,-250 -864,-270 -800,-287 -747,-276 -731,-298 -726,-314 -676,-323 -659,-354 -639,-358 -629,-370 -619,-375 -601,-365 -590,-373 -565,-412 -464,-439 -324,-502 -358,-550 -350,-562 -339,-566 -272,-546 -267,-527 -248,-509 -251,-482 -219,-464 -207,-465 -194,-484 -143,-496 -139,-555 -60,-530 -55,-495 -32,-462 80,-429 145,-397 162,-370 243,-390 266,-374 284,-353 272,-326 243,-311 222,-284 228,-270 259,-258 349,-136 361,-134 453,-198 420,-285 501,-262 579,-206 621,-211 665,-230 674,-195 667,-178 631,-161 642,-142 716,-76 748,-89 761,-105 843,-49 856,-57 920,-34 930,22 993,89'
  .split(' ').map(function (point) {
    return point.split(',').map(function (v) { return v / 1000; });
  });
var PRAGUE = [-0.309, -0.13];

function inside(x, y) {
  var c = false;
  for (var a = 0, b = CZ.length - 1; a < CZ.length; b = a++) {
    if ((CZ[a][1] > y) !== (CZ[b][1] > y) &&
      x < (CZ[b][0] - CZ[a][0]) * (y - CZ[a][1]) / (CZ[b][1] - CZ[a][1]) + CZ[a][0]) c = !c;
  }
  return c;
}

// A fixed point inside the border for particle k, by rejection sampling, worked out once.
var mapPoints = [];
function mapPoint(k) {
  if (!mapPoints[k]) {
    var point = PRAGUE;
    for (var j = 0; j < 14; j++) {
      var u = rnd(k, 20 + j) * 2 - 1, v = (rnd(k, 40 + j) * 2 - 1) * 0.58;
      if (inside(u, v)) { point = [u, v]; break; }
    }
    mapPoints[k] = point;
  }
  return mapPoints[k];
}

// Pixels per unit of the map's coordinates.
function mapScale(area) { return 0.95 * Math.min(area.w / 2, area.h / 1.132); }

function czechia(k, s, area, out) {
  var S = mapScale(area);
  if (rnd(k, 2) < 0.2) {
    var b = rnd(k, 1) * TAU + s * 0.3, r = S * (0.16 + 0.02 * Math.sin(s * 1.5));
    out[0] = area.cx + PRAGUE[0] * S + r * Math.cos(b);
    out[1] = area.cy + PRAGUE[1] * S + r * Math.sin(b);
  } else {
    var point = mapPoint(k);
    out[0] = area.cx + S * point[0];
    out[1] = area.cy + S * point[1];
  }
  out[2] = 2;
}

function border(ctx, area, alpha, colour) {
  var S = mapScale(area);
  ctx.globalAlpha = 0.7 * alpha;
  ctx.strokeStyle = colour.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  CZ.forEach(function (point, a) {
    var x = area.cx + S * point[0], y = area.cy + S * point[1];
    if (a) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// doctor-who-ratings: a heatmap of 16 rows of uneven length, whose particles grow from dots
// into tiles.
var COLS = 34, ROWS = 16;
function heatmap(k, s, area, out) {
  var size = Math.min(0.92 * area.w / COLS, 0.8 * area.h / ROWS);
  var row = k % ROWS, length = COLS - Math.floor(rnd(row, 9) * 14), col = Math.floor(rnd(k, 1) * length);
  out[0] = area.cx - COLS * size / 2 + (col + 0.5) * size;
  out[1] = area.cy - ROWS * size / 2 + (row + 0.5) * size;
  out[2] = size * 0.74;
}

export var shapes = {
  'photon-orbits-5d': { at: sphere },
  'zombie-outbreak': { at: czechia, overlay: border },
  'doctor-who-ratings': { at: heatmap }
};

// For a selected project with no picture yet: the particles spread evenly over the space.
export var scatter = {
  at: function (k, s, area, out) {
    out[0] = area.cx + (rnd(k, 1) - 0.5) * 0.9 * area.w;
    out[1] = area.cy + (rnd(k, 2) - 0.5) * 0.9 * area.h;
    out[2] = 2;
  }
};
