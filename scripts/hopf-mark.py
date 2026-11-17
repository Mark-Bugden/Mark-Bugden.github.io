"""Draw the site's mark: four fibres of the Hopf fibration, linked as they are in space.

Usage: python scripts/hopf-mark.py
Writes layouts/partials/mark.html (inline in the header; coloured by site.css) and
static/favicon.svg (standalone; light and dark colours of its own).

Each fibre of the Hopf map S^3 -> S^2 is the great circle
    t -> (cos(eta) e^{it}, sin(eta) e^{i(t + alpha)}).
Stereographic projection from (0, 0, 0, 1) sends it to a circle in R^3, and an orthographic view
sends that circle to an ellipse. The four fibres share eta = pi/4 (the Clifford torus) and differ in
alpha. Each ellipse is split into the half nearer the viewer and the half behind; drawing the halves
back to front, each over a background-coloured halo, makes linked fibres cross over and under.
"""
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIBRES = [(math.pi / 4, 2 * math.pi * k / 4) for k in range(4)]
TILT = 0.28  # radians about the x axis, away from looking straight down the torus axis
SIZE, PAD = 32, 2.5
STROKE, HALO = 2.4, 5  # in viewBox units; site.css uses the same widths for .mark


def sub(a, b): return [a[i] - b[i] for i in range(3)]
def add(a, b): return [a[i] + b[i] for i in range(3)]
def mul(a, s): return [x * s for x in a]
def dot(a, b): return sum(a[i] * b[i] for i in range(3))
def norm(a): return math.sqrt(dot(a, a))
def cross(a, b): return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def fibre_point(eta, alpha, t):
    x1, x2 = math.cos(eta) * math.cos(t), math.cos(eta) * math.sin(t)
    x3, x4 = math.sin(eta) * math.cos(t + alpha), math.sin(eta) * math.sin(t + alpha)
    p = [x1 / (1 - x4), x2 / (1 - x4), x3 / (1 - x4)]
    c, s = math.cos(TILT), math.sin(TILT)
    return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]


def circle(eta, alpha):
    """Centre, radius and unit normal of the projected fibre, from three of its points."""
    p, q, r = (fibre_point(eta, alpha, 0.3 + k * 2 * math.pi / 3) for k in range(3))
    a, b = sub(q, p), sub(r, p)
    n = cross(a, b)
    centre = add(p, mul(add(mul(cross(n, a), dot(b, b)), mul(cross(b, n), dot(a, a))), 1 / (2 * dot(n, n))))
    return centre, norm(sub(p, centre)), mul(n, 1 / norm(n))


def halves(index, centre, radius, normal):
    """The back and front halves of the circle's image, viewed along -z."""
    u = cross(normal, [0, 0, 1])
    u = mul(u, 1 / norm(u))
    v = cross(normal, u)
    rx, ry = radius, radius * abs(normal[2])
    angle = math.degrees(math.atan2(u[1], u[0]))
    a, b = add(centre, mul(u, radius)), sub(centre, mul(u, radius))
    for sign in (1, -1):
        m = add(centre, mul(v, sign * radius))
        yield m[2], index, a, b, m, rx, ry, angle


def paths():
    arcs = [h for i, f in enumerate(FIBRES) for h in halves(i, *circle(*f))]
    boxes = []
    for _, _, a, b, _, rx, ry, angle in arcs:
        cx, cy, t = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, math.radians(angle)
        hx, hy = math.hypot(rx * math.cos(t), ry * math.sin(t)), math.hypot(rx * math.sin(t), ry * math.cos(t))
        boxes.append((cx - hx, cx + hx, cy - hy, cy + hy))
    x0, x1 = min(b[0] for b in boxes), max(b[1] for b in boxes)
    y0, y1 = min(b[2] for b in boxes), max(b[3] for b in boxes)
    scale = (SIZE - 2 * PAD) / max(x1 - x0, y1 - y0)
    ox = PAD + (SIZE - 2 * PAD - (x1 - x0) * scale) / 2
    oy = PAD + (SIZE - 2 * PAD - (y1 - y0) * scale) / 2

    def screen(p):
        return ox + (p[0] - x0) * scale, oy + (y1 - p[1]) * scale

    def f(x):
        return f"{x:.2f}".rstrip("0").rstrip(".")

    for _, index, a, b, m, rx, ry, angle in sorted(arcs, key=lambda arc: arc[0]):
        (ax, ay), (bx, by), (mx, my) = screen(a), screen(b), screen(m)
        # SVG's y axis points down, so sweep = 1 (clockwise on screen) when A -> M -> B turns that way.
        sweep = 1 if (mx - ax) * (by - ay) - (my - ay) * (bx - ax) > 0 else 0
        rxs, rys = rx * scale, ry * scale
        arc = f"A{f(rxs)} {f(rys)} {f(-angle)} 0 {sweep} "
        d = f"M{f(ax)} {f(ay)}{arc}{f(bx)} {f(by)}"
        # The halo stops short of the half's ends, so it never covers the other half of its own fibre
        # where the two meet. P(t) = C + rxs cos(t) u + rys sin(t) w runs from A (t = 0) through M to B.
        cx, cy = (ax + bx) / 2, (ay + by) / 2
        ux, uy = (ax - cx) / rxs, (ay - cy) / rxs
        wx, wy = (mx - cx) / max(rys, 1e-9), (my - cy) / max(rys, 1e-9)
        trim = min(1.0, (HALO + STROKE) / 2 / max(rys, 1e-9))
        p = lambda t: (cx + rxs * math.cos(t) * ux + rys * math.sin(t) * wx, cy + rxs * math.cos(t) * uy + rys * math.sin(t) * wy)
        (hx0, hy0), (hx1, hy1) = p(trim), p(math.pi - trim)
        halo = f"M{f(hx0)} {f(hy0)}{arc}{f(hx1)} {f(hy1)}"
        yield d, halo, "a" if index == 0 else "f"


def main():
    arcs = list(paths())
    inline = "".join(f'<path class="h" d="{h}"/><path class="{c}" d="{d}"/>' for d, h, c in arcs)
    (ROOT / "layouts/partials/mark.html").write_text(
        "{{- /* Generated by scripts/hopf-mark.py; edit that, not this. Colours come from site.css (.mark). */ -}}\n"
        f'<svg class="mark" viewBox="0 0 {SIZE} {SIZE}" aria-hidden="true" focusable="false">{inline}</svg>\n',
        encoding="utf-8",
    )
    # site.css's --fg and --accent. The light accent is its color-mix(in oklab, #7CE0C3 50%, #000)
    # worked out, since a favicon has no color-mix().
    style = (
        "path{fill:none;stroke-width:3.2;stroke-linecap:round}.f{stroke:#e8ecf2}.a{stroke:#7ce0c3}"
        "@media (prefers-color-scheme:light){.f{stroke:#10151d}.a{stroke:#2c564a}}"
    )
    plain = "".join(f'<path class="{c}" d="{d}"/>' for d, _, c in arcs)
    (ROOT / "static/favicon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}"><style>{style}</style>{plain}</svg>\n',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
