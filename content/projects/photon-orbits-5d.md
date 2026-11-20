---
title: "Plotting the Photons"
slug: photon-orbits-5d
date: 2026-11-17
demo: photon-orbits-5d
summary: "Spherical photon orbits around a five-dimensional rotating (Myers-Perry) black hole, after the 2018 paper in General Relativity and Gravitation."
description: "Light orbiting a five-dimensional rotating black hole: spherical photon orbits around a Myers-Perry black hole, drawn in your browser."
---

Close to a rotating black hole, light can orbit at a fixed distance. Such an orbit isn't confined to a plane: as the photon goes round, it swings back and forth between two latitudes, and over many turns it covers a band on a sphere. These are spherical photon orbits. Around the ordinary rotating black hole of four-dimensional spacetime, the Kerr black hole, they are well studied. This demo draws them around a rotating black hole in five dimensions, following my 2018 paper, [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x).

A black hole in five dimensions can spin in two independent planes at once, and the photon moves in one more direction than a picture can show. The demo draws three of them as a picture and shows the fourth as colour.

## The black hole

With four dimensions of space, rotations happen in planes rather than about axes, and there are two independent planes to turn in. The Myers–Perry black hole spins in both, with spins a and b. In units where the mass parameter μ is 1, it has a horizon only when a + b ≤ 1. At a + b = 1 the hole is extremal: its inner and outer horizons have merged, and it spins as fast as a black hole of its mass can. The demo labels this case "Extremal", and the preset for the paper's Fig 4.8 is one.

The coordinates are a radius r, an angle θ from 0 to π/2, which says how the photon's distance from the centre is shared between the two planes, and an angle in each plane: φ in the plane of a, and ψ in the plane of b.

## Spherical photon orbits

Besides its energy, a photon here has three constants of motion: its angular momenta Φ and Ψ in the two planes, and a constant K like Kerr's Carter constant. An orbit stays at one radius when the radial potential and its slope both vanish there, and that fixes r and K. So, for given spins, a pair of momenta (Φ, Ψ) gives at most one spherical orbit. This last step is numerical: in 200,000 random samples and 16 dense grids, a second orbit never turned up. The solver still checks for one every time.

That makes the momenta the natural controls. On the pad, Φ runs across and Ψ up, and the shaded region holds the pairs that have an orbit, tinted by its radius. The region is a convex, curved diamond. Its corners are the paper's circular orbits in the two planes, and its edges are orbits that stay at one latitude; Fig 4.12 is one of them. With a > 0 the hole turns towards −φ, so photons that orbit with the spin have Φ < 0. The pad labels its halves "with a" and "against a", and likewise for b.

Two special holes are worth a look. With no spin (the Tangherlini black hole), every orbit is a great circle at r = √2. With equal spins, an orbit's radius depends only on Φ + Ψ.

At an extremal hole, the edge of the region on the side that turns with the hole becomes the straight segment Φ + Ψ = −1. Along it, the orbits close down onto the horizon while still sweeping a wide band of latitudes. Near that edge the hole drags the photon round: just inside it, at a = b = 0.5, φ turns about 21 times for each swing in latitude. This straight edge turned up while building the demo.

## Drawing four dimensions

The picture is the paper's:

```
X = √(r² + a²) sin θ cos φ
Y = √(r² + a²) sin θ sin φ
Z = √(r² + b²) cos θ
colour = ψ
```

X and Y lie flat in the plane of a. Z is the distance out in the plane of b, drawn as height, and the colour is the direction within that plane.

At a fixed radius, every point lies on a spheroid. It is flattened when a > b, a sphere when a = b, and stretched along Z when b > a. The paper's projection also turns the picture by a constant angle, arctan(a/r). At a fixed radius that is a rigid rotation, so the demo leaves it out and turns the camera instead.

The colours are the paper's colour wheel from Fig 4.1: red at ψ = 0, then yellow, green, cyan, blue and magenta every π/3. The ring in the corner of the 3D view is the key, with a needle at the photon's ψ.

When Φ = 0 the orbit passes straight over the pole, and when Ψ = 0 it crosses the equator. There, the coordinates carry straight on, as in the paper's figures: the path goes over the pole, or crosses onto the lower half of the spheroid keeping its colour. Any nonzero momentum keeps the orbit away from the axis, and it turns back just short of it, with a quick sweep of φ or ψ.

## The side panel

The side panel plots θ, φ and ψ against the affine parameter λ over the visible trail, as the paper's Figs 4.9 and 4.11 do. The dashed lines are the edges of the band of latitudes, and the strip of colour under ψ is the trail's colour at each moment. The curves are geodesics, so they stay smooth through the axes: there, θ carries on past 0 or π/2, and φ and ψ don't jump.

The second tab puts the trail on a torus, with φ across and ψ up, each from 0 to 2π. Each swing in latitude advances φ and ψ by a fixed number of turns, which the status line gives. Only if both are rational does the orbit close; otherwise it never repeats, and over time the trail covers the whole band of latitudes. On the torus, a closed orbit is a closed curve, and any other slowly fills the square.

## How it is computed

The demo never integrates the equations of motion step by step. At a fixed radius, writing the motion in Mino time (dσ = dλ/ρ²) separates the latitude from everything else. A change of variable, sin²θ = ȳ − Δy cos χ, turns the swing between the band's edges into an angle χ that only ever increases. Then λ, φ and ψ are integrals over χ of known functions. One swing is tabulated by Simpson's rule at 256 points (512 when the band comes within about half a degree of an axis), and the sharp peaks next to the axes are integrated exactly. A longer path repeats the table, moved on by each swing's advance in λ, φ and ψ. So the path is accurate to about 10⁻⁷, and a long trail doesn't drift. That matters near the axes: on Fig 4.10's orbit, which passes close to both, a fixed-step integration in λ (fourth-order Runge–Kutta, in steps of 0.05) is off by 1.8 radians in ψ after a single swing.

Two checks back this up. On six orbits, a direct integration of the geodesic equations, from the metric itself, agrees with the tables to 2 × 10⁻⁸ in θ, φ and ψ, and to 1.2 × 10⁻⁷ in ψ for Fig 4.10, where ψ swings sharply near the equator. And the demo's JavaScript is a port of a Python reference model, whose results it reproduces to 3 × 10⁻¹⁶.

Every one of these orbits is unstable. A small nudge off the radius grows by a factor of about e⁴ per swing, and a full integration that includes the radius leaves the sphere within about six swings, however tight the tolerance. So the demo holds the radius fixed, as the paper does, and shows the ideal orbit.

## The presets

The presets reproduce the paper's Figs 4.2 to 4.12. Figs 4.9 and 4.11 plot the orbits of Figs 4.8 and 4.10 against λ, so those presets fill the side panel too. Each preset sets the spins and momenta, and also the stretch of path shown, the colours and the viewpoint, all fitted to the figure's image. The demo opens on Fig 4.5's orbit, with three swings of trail rather than the figure's 27. Two more presets show the special holes: equal spins, and no spin.

## Limits

- The radius is held fixed. Real spherical photon orbits are unstable, so the demo shows the ideal orbit, as the paper does.
- That each pair of momenta has at most one orbit is shown numerically, not proved.
- The spins run from 0 to 0.99. Negative spins only mirror the picture.
- The clock is λ. Coordinate time isn't computed.
- Colour carries the fourth coordinate, and opposite colours are harder to tell apart for red–green colour-blind viewers. The torus shows ψ by position instead.

## The code

The code is on [GitHub](https://github.com/Mark-Bugden/photon-orbits-5d). A Python reference model computes the orbits, and its tests check it against the paper, against closed forms and against a direct integration of the geodesic equations. The demo's JavaScript port replays the model's results in its own tests. The 3D view is drawn with [three.js](https://threejs.org/). I built the demo with the help of agentic coding.

The demo was inspired by Leo Stein's [Kerr spherical photon orbits](https://duetosymmetry.com/tool/kerr-circular-photon-orbits/) tool, which does the same for four-dimensional Kerr black holes.

## References

- Bugden, M. (2018). [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x). *General Relativity and Gravitation* 50. [arXiv:1801.03389](https://arxiv.org/abs/1801.03389).
- Myers, R. C. and Perry, M. J. (1986). Black holes in higher dimensional space-times. *Annals of Physics* 172, 304–347.
- Frolov, V. P. and Stojković, D. (2003). [Particle and light motion in a space-time of a five-dimensional rotating black hole](https://arxiv.org/abs/gr-qc/0301016). *Physical Review D* 68, 064011.
- Teo, E. (2003). [Spherical photon orbits around a Kerr black hole](https://physics.nus.edu.sg/wp-content/uploads/sites/5/2019/10/paper.pdf). *General Relativity and Gravitation* 35, 1909–1926.
