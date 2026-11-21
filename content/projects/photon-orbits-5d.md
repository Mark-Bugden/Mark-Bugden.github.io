---
title: "Plotting the Photons"
slug: photon-orbits-5d
date: 2026-11-17
demo: photon-orbits-5d
summary: "Spherical photon orbits around a five-dimensional rotating (Myers-Perry) black hole, after the 2018 paper in General Relativity and Gravitation."
description: "Light orbiting a five-dimensional rotating black hole: spherical photon orbits around a Myers-Perry black hole, drawn in your browser."
---

{{< faq "What is this demo?" >}}
Close to a rotating black hole, light can orbit at a fixed distance. Such an orbit isn't confined to a plane: as the photon goes round, it swings back and forth between two latitudes, and over many turns it covers a band on a sphere. These are spherical photon orbits. Around the ordinary rotating black hole of four-dimensional spacetime, the Kerr black hole, they are well studied.

This demo draws them around a rotating black hole in five dimensions, the Myers–Perry black hole, following my 2018 paper, [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x). Choose the black hole's spins and the photon's angular momenta, and the demo finds the orbit and sends the photon round it. The presets reproduce the paper's figures.

The demo was inspired by Leo Stein's [Kerr spherical photon orbits](https://duetosymmetry.com/tool/kerr-circular-photon-orbits/) tool, which does the same for the Kerr black hole.
{{< /faq >}}

{{< faq "How does a 5-dimensional black hole differ from a “normal” black hole in 4 dimensions?" >}}
**Two spins.** In three dimensions of space, things rotate about an axis. With four dimensions of space, rotations happen in planes rather than about axes, and there are two independent planes to turn in. So a black hole in five-dimensional spacetime can spin in two planes at once. The Myers–Perry black hole does, with spin a in one plane and spin b in the other. A Kerr black hole has one spin.

The coordinates follow the planes. There is a radius r, an angle in each plane (φ in the plane of a, and ψ in the plane of b), and an angle θ, from 0 to π/2, which says how the photon's distance from the centre is shared between the two planes.

**Two angular momenta.** Besides its energy, a photon around a Kerr black hole has two constants of motion: its angular momentum about the spin axis, and the Carter constant. Here it has three: its angular momenta Φ and Ψ in the two planes, and a constant K like Carter's. Frolov and Stojković showed that with these, the equations of motion separate.

An orbit stays at one radius when the radial potential and its slope both vanish there, and that fixes r and K. So, for given spins, a pair of momenta (Φ, Ψ) gives at most one spherical orbit. This last step is numerical: in 200,000 random samples and 16 dense grids, a second orbit never turned up. The demo still checks for one every time.

**Horizons.** Like a Kerr black hole, a Myers–Perry black hole has an event horizon with an inner horizon inside it. In units where the mass parameter μ is 1, they are where (r² + a²)(r² + b²) = r², and they exist only when a + b ≤ 1. The horizon is a squashed three-sphere, where Kerr's is a squashed two-sphere. And with only one spin there is no inner horizon, while any spin at all gives a Kerr black hole two.

**Other black holes.** In four dimensions, a black hole in empty space has a spherical horizon, and its mass and spin fix it completely: it is a Kerr black hole. Five dimensions allow more. The black ring, found by Emparan and Reall, has a horizon shaped like S² × S¹: a ring whose cross-section is a sphere. For some masses and spins, a black ring and a Myers–Perry black hole share the same mass and spin, so those no longer fix the black hole. There are also black lenses, with yet another horizon shape, and combinations such as black Saturn, a black hole circled by a black ring. This demo sticks to the Myers–Perry black hole.
{{< /faq >}}

{{< faq "How do you visualise 5 dimensional spacetime?" >}}
A spherical photon orbit stays at one radius. So, leaving out time, the photon moves on a three-dimensional surface, described by the angles θ, φ and ψ. That is still one dimension too many to draw. The demo uses the paper's picture:

```
X = √(r² + a²) sin θ cos φ
Y = √(r² + a²) sin θ sin φ
Z = √(r² + b²) cos θ
colour = ψ
```

In the plane of a, the photon is √(r² + a²) sin θ from the centre, in the direction φ. In the plane of b, it is √(r² + b²) cos θ from the centre, in the direction ψ. X and Y are its position in the plane of a. Z is its distance from the centre in the plane of b, drawn as height, and the colour is its direction in that plane. So the picture leaves nothing out: position and colour together give all four coordinates of space.

At a fixed radius, every point lies on a spheroid. It is flattened when a > b, a sphere when a = b, and stretched along Z when b > a, as in Fig 4.6, the paper's “football”. The paper's projection also turns the picture by a constant angle, arctan(a/r). At a fixed radius that is a rigid rotation, so the demo leaves it out and turns the camera instead.

The colours are the paper's colour wheel from Fig 4.1: red at ψ = 0, then yellow, green, cyan, blue and magenta every π/3. The ring at the top left of the 3D view is the key, with a needle at the photon's ψ. Opposite colours are harder to tell apart for red–green colour-blind viewers, so the side panel's torus shows ψ by position too.

When Φ = 0 the orbit passes straight over the pole, and when Ψ = 0 it crosses the equator. There, the coordinates carry straight on, as in the paper's figures: the path goes over the pole, or crosses onto the lower half of the spheroid keeping its colour. Any nonzero momentum keeps the orbit away from the axis, and it turns back just short of it, with a quick sweep of φ or ψ.

**The link with Kerr.** When b = 0 and Ψ = 0, the hole doesn't turn in the plane of b, and the photon has no angular momentum in it. So the photon moves along a fixed line through the centre of that plane: ψ never changes, and the whole orbit is one colour. The picture is then like the usual pictures of spherical photon orbits around a Kerr black hole. X and Y span the plane the hole turns in, Z is at right angles to it, like Kerr's axis, and the orbit swings across the equator from one side to the other. Figs 4.2 and 4.3 are like this. The orbits themselves are not Kerr's, since this is a different black hole, but they read the same way.
{{< /faq >}}

{{< faq "What do the controls do? What do the graphs show?" >}}
- **Preset** picks one of the paper's figures, from Fig 4.2 to Fig 4.12, or one of two special holes. With equal spins, an orbit's radius depends only on Φ + Ψ. With no spin, the Tangherlini black hole, every orbit is a great circle at r = √2. A preset sets the spins and momenta, and also where the photon starts, the colours and the viewpoint, all fitted to the figure's image. The demo opens on the orbit of Figs 4.4 and 4.5.
- **Spins** sets a and b, each from 0 to 0.99. They are held to a + b ≤ 1, since beyond that there is no horizon. At a + b = 1 the hole is extremal, and an “Extremal” label appears. Negative spins would only mirror the picture.
- **Momenta** is a pad, with Φ across and Ψ up. The shaded region holds the pairs that have a spherical orbit, tinted by the orbit's radius, darker for orbits closer in, with a key in the corner. Drag the dot to choose an orbit. It snaps to the axes, where Φ = 0 or Ψ = 0, and the sliders and the arrow keys move it in finer steps. With a > 0 the hole turns towards −φ, so photons that orbit with the spin have Φ < 0, and the pad labels its halves “with a” and “against a”. Likewise for b. When the spins change, the dot keeps its direction, and how far it is towards the edge.
- **Trail length** is how much of the photon's past path stays drawn. It is measured in the affine parameter λ, which is the demo's clock. Coordinate time isn't computed.
- **Play/Pause** starts and stops the photon, and **Reset** puts it back where the last preset started it.
- **The 3D view** turns when you drag it, and zooms with its buttons or a pinch. The third button resets the view. The arrow below the spheroid shows which way the hole turns in the plane of a. Its turning in the plane of b shows only in the colours, so b's arrow goes round the colour key.
- **The status line** gives the orbit's radius, its band of latitudes, and how far φ and ψ advance for each swing in latitude.

The region on the pad is a convex, curved diamond, and outside it there is no spherical orbit. Its corners are circular orbits in each of the two planes, and its edges are orbits that stay at one latitude; Fig 4.12 is one of them.

The side panel plots θ, φ and ψ against λ over the visible trail, with the photon at the right-hand end, as the paper's Figs 4.9 and 4.11 do for the orbits of Figs 4.8 and 4.10. The dashed lines are the edges of the band of latitudes, and the strip of colour under ψ is the trail's colour at each moment. φ and ψ run from 0 to 2π and wrap round. The curves are geodesics, so they stay smooth through the axes: there, θ carries on past 0 or π/2 instead of jumping.

The second tab puts the trail on a torus, with φ across and ψ up, each from 0 to 2π. Each swing in latitude advances φ and ψ by a fixed number of turns, which the status line gives. Only if both are rational does the orbit close, and then it is a closed curve on the torus. Any other orbit never repeats: over time it fills the square, and in 3D the whole band of latitudes.
{{< /faq >}}

{{< faq "What does extremal mean?" >}}
A black hole of a given mass can only spin so fast. A rotating black hole has two horizons, the event horizon and an inner horizon inside it. As the spin grows, they move together, and at the fastest spin they merge. That black hole is extremal. Any faster, and there would be no horizon at all, just a naked singularity, which the cosmic censorship conjecture says should never form. An extremal black hole is also cold: its Hawking temperature is zero.

For a Kerr black hole of mass M, extremal means a = M, in units where G = c = 1. For the Myers–Perry black hole, with μ = 1, it means a + b = 1, and the two horizons meet at r² = ab. With only one spin, there is no inner horizon to meet, and as a approaches 1 the event horizon shrinks to nothing. So the demo's extremal holes spin in both planes. Fig 4.8, with a = 0.9 and b = 0.1, is one.

At an extremal hole, the edge of the pad's region on the side that turns with the hole becomes the straight segment Φ + Ψ = −1. Along it, the orbits close down onto the horizon while still sweeping a wide band of latitudes. Near that edge the hole drags the photon round: just inside it, at a = b = 0.5, φ turns about 21 times for each swing in latitude. The pad stops the dot just short of the edge. This straight edge isn't in the paper; it turned up while building the demo.
{{< /faq >}}

{{< faq "How was this demo made?" >}}
**The computation.** The demo never integrates the equations of motion step by step. At a fixed radius, writing the motion in Mino time (dσ = dλ/ρ²) separates the latitude from everything else. A change of variable, sin²θ = ȳ − Δy cos χ, turns the swing between the band's edges into an angle χ that only ever increases. Then λ, φ and ψ are integrals over χ of known functions. One swing is tabulated by Simpson's rule at 256 points (512 when the band comes within about half a degree of an axis), and the sharp peaks next to the axes are integrated exactly. A longer path repeats the table, moved on by each swing's advance in λ, φ and ψ. So the path is accurate to about 10⁻⁷, and a long trail doesn't drift. That matters near the axes: on Fig 4.10's orbit, which passes close to both, a fixed-step integration in λ (fourth-order Runge–Kutta, in steps of 0.05) is off by 1.8 radians in ψ after a single swing.

**The checks.** On six orbits, a direct integration of the geodesic equations, from the metric itself, agrees with the tables to 2 × 10⁻⁸ in θ, φ and ψ, and to 1.2 × 10⁻⁷ in ψ for Fig 4.10, where ψ swings sharply near the equator. The demo's JavaScript is a port of a Python reference model, and reproduces its results to 3 × 10⁻¹⁶.

**The fixed radius.** Every one of these orbits is unstable. A small nudge off the radius grows by a factor of about e⁴ per swing, and a full integration that includes the radius leaves the sphere within about six swings, however tight the tolerance. So the demo holds the radius fixed, as the paper does, and shows the ideal orbit.

**The code** is on [GitHub](https://github.com/Mark-Bugden/photon-orbits-5d). The Python model's tests check it against the paper, against closed forms and against the direct integration, and the JavaScript's tests replay the model's results. The 3D view is drawn with [three.js](https://threejs.org/), and the pad and the side panel on plain canvases.

**The agent.** I built the demo with Claude Code, Anthropic's coding agent, in stages. Each stage was a pull request that I reviewed before it went live:

1. **Research.** The agent checked the paper line by line, reproduced its figures, and surveyed the tools that already exist, Leo Stein's among them.
2. **A plan,** in which I settled the design questions, such as the colour wheel, how to draw orbits through the axes, and which clock to use.
3. **The physics, before any drawing:** the Python model and its tests, and a document of every equation as implemented, which I reviewed.
4. **The JavaScript port,** whose tests replay the Python model's results.
5. **The interface:** the 3D view, then the pad and the presets, fitted to the paper's figures by script, then the side panel. The agent checked each in a headless browser before I reviewed it.
{{< /faq >}}

## References

- Bugden, M. (2018). [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x). *General Relativity and Gravitation* 50. [arXiv:1801.03389](https://arxiv.org/abs/1801.03389).
- Myers, R. C. and Perry, M. J. (1986). Black holes in higher dimensional space-times. *Annals of Physics* 172, 304–347.
- Emparan, R. and Reall, H. S. (2002). [A rotating black ring in five dimensions](https://arxiv.org/abs/hep-th/0110260). *Physical Review Letters* 88, 101101.
- Frolov, V. P. and Stojković, D. (2003). [Particle and light motion in a space-time of a five-dimensional rotating black hole](https://arxiv.org/abs/gr-qc/0301016). *Physical Review D* 68, 064011.
- Teo, E. (2003). [Spherical photon orbits around a Kerr black hole](https://physics.nus.edu.sg/wp-content/uploads/sites/5/2019/10/paper.pdf). *General Relativity and Gravitation* 35, 1909–1926.
- Emparan, R. and Reall, H. S. (2008). [Black holes in higher dimensions](https://arxiv.org/abs/0801.3471). *Living Reviews in Relativity* 11, 6.
