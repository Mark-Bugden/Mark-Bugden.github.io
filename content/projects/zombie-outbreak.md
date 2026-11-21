---
title: "Quantifying the Quarantine"
slug: zombie-outbreak
date: 2026-11-17
demo: zombie-outbreak
summary: "A simulation of a zombie outbreak spreading across a country, running a humans–zombies–removed model in every cell of a population density map."
description: "Simulating a zombie outbreak across a real population map of the Czech Republic: a humans–zombies–removed model per square kilometre, with people moving between neighbouring cells."
aliases: ["/portfolio/zombies.html"]
---

{{< faq "What is this demo?" >}}
Whenever I see a zombie movie, I think how unrealistic it is: the zombies take over the cities in a day or two, and the rest of the world soon after. Zombie outbreaks have been modelled mathematically before (the first academic paper I ever read was about one), but most models treat the whole population at once, so you can't see how the zombies spread through a country. I wanted to see what the spread of infection would look like in the country I lived in.

The demo shows a zombie outbreak on a population map of the Czech Republic, one square kilometre to a pixel. For the first week of the infection, nobody notices it. You can plan blockades from the start by clicking on the different regions, but nothing is built until day 7, and even then there is only one crew, who don't build instantaneously. The same outbreak with no quarantine runs in the background, which is how the demo knows how many people your quarantine saved. It also counts the people you sealed in: those inside an area that you cut off from the rest of the country, trapped in with the zombies. You monster.
{{< /faq >}}

{{< faq "How do you model a zombie outbreak?" >}}
The outbreak follows the humans–zombies–removed (SZR) model of Munz, Hudea, Imad and Smith? (2009). Humans ($S$) are bitten and become zombies ($Z$). Humans can fight back and put zombies down, which moves them to the removed ($R$). As in the films, a zombie that goes down doesn't always stay down: the removed can rise again as zombies. The paper also has births and natural deaths, but since the demo only lasts a year I don't include them.

The paper's population is well mixed: everyone can meet everyone. Each square kilometre runs the same model, and people move between neighbouring squares. The equations governing the model are:

$$
\frac{\partial S}{\partial t} = -\beta S Z + \nabla \cdot (\chi S \, \nabla z)
$$

Humans are bitten, and flee from zombies.
{.equation-note}

$$
\frac{\partial Z}{\partial t} = \beta S Z - \alpha S Z + \zeta R + D \, \Delta Z
$$

Zombies bite, are put down, rise and wander.
{.equation-note}

$$
\frac{\partial R}{\partial t} = \alpha S Z - \zeta R
$$

Zombies put down are removed, and can rise again.
{.equation-note}

The parameters $\chi$ and $D$ describe how people move: $D$ is how fast zombies wander at random, and $\chi$ is how fast humans flee towards neighbouring squares where zombies are a smaller share of the people around. That share is $z = Z / (S + Z)$, the fraction of everyone in a square who is a zombie. The other three parameters come from the paper: $\beta$, $\alpha$ and $\zeta$ are the rates at which zombies bite, are put down and rise again.

I have included some preset values for the parameters of the model, as four strains: *Munz et al. (2009)* uses the paper's own rates, *Shamblers* are slower, *Frenzied* are faster, and *Risers* lose most fights but rise again quickly.
{{< /faq >}}

{{< faq "Where does the data come from?" >}}
The population data comes from WorldPop's 2020 estimate for the Czech Republic, adjusted so that the national total matches the UN's figure. WorldPop's grid is measured in angles rather than distances: each cell is 30 arc-seconds of latitude by 30 arc-seconds of longitude. Lines of longitude get closer together as you move away from the equator, so at around 50°N, where the Czech Republic is, a cell is about 0.93 km from north to south but only 0.60 km from east to west. This means that each cell covers about 0.55 km², not a full square kilometre. If you treat each cell as a square kilometre anyway, you end up counting 19.3 million people instead of 10.75 million, and the map comes out stretched sideways. To avoid this, the demo resamples the data onto an equal-area grid of 1 km squares (ETRS89-LAEA), which avoids distorting the population. The region and national borders come from Natural Earth.
{{< /faq >}}

{{< faq "Can a quarantine stop the outbreak?" >}}
This is up to you to find out. Try different strains and find an optimal strategy for creating blockades. You can also open the *Advanced* menu to manually adjust the parameters, or draw your own blockades.
{{< /faq >}}

{{< faq "Is this a realistic model?" >}}
I know, I know, zombies don't exist.

But let's assume for the moment that they do. What are the limitations of the model, and how does it differ from what would really happen?

- People travel. In the model, zombies only wander into neighbouring squares and humans only flee next door, but a real outbreak could jump from Prague to Brno in an afternoon by car or train. This is a big part of why blockades can work at all in the demo.
- In a real crowd, the number of people you can meet levels off. In the model, bites keep growing with how crowded a square is.
- Nobody has measured how fast zombies bite or how often they are put down, so the rates are illustrative. So are the detection day and the crew's speed, which were chosen so that a quarantine can work but has to be quick.
- Real outbreaks involve luck, but the model is deterministic, so the same plan always gives the same result.
- Real people would do more than run. Nobody in the model hides, evacuates or organises, and nobody gets any better at fighting zombies.
- Real blockades leak, and real borders work both ways. In the demo, nothing crosses a finished blockade, zombies that cross the national border leave the model, and humans never leave the Czech Republic.
{{< /faq >}}

{{< faq "How was this demo made?" >}}
**The code** is on [GitHub](https://github.com/Mark-Bugden/zombie-outbreak). A Python pipeline regrids the population data onto the 1 km grid, and a NumPy reference model runs the outbreak. The demo runs it again in JavaScript, in a web worker, and its tests check that the two agree exactly. The map and the chart are drawn on plain canvases.

**Agentic coding:** I built the demo with Claude Code, Anthropic's coding agent, in stages.

1. **Research.** The agent went through my original notebooks from 2023, which ran an SIR model with migration on a population map of Germany.
2. **A plan,** in which I settled the design questions, such as noticing the outbreak only after a week, having one crew build every blockade, and running the same outbreak with no quarantine alongside to count the people saved.
3. **The data:** the population regridded onto an equal-area 1 km grid, and checked against the national total, the regions' official populations and where the cities are.
4. **The model:** the NumPy reference model and its tests, then the JavaScript port, whose tests replay the reference model's results.
5. **The quarantine:** blockades, seals and the crew, then the run with no quarantine and the summary. The strains, the detection day and the crew's speed were tuned with me on the full map, from trials the agent ran.
6. **Polish,** from my notes on the live demo: the chart as a timeline, fewer controls, "blockade" in place of "cordon", a colour for the dead, and a demo that fits the window.
{{< /faq >}}

## Credits

- Munz, P., Hudea, I., Imad, J. and Smith?, R. J. (2009). [When zombies attack!: Mathematical modelling of an outbreak of zombie infection](https://loe.org/images/content/091023/Zombie%20Publication.pdf). In *Infectious Disease Modelling Research Progress*, pp. 133–150. Nova Science.
- Population: [WorldPop](https://dx.doi.org/10.5258/SOTON/WP00675), Czech Republic 2020, UN-adjusted, 1 km ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). WorldPop (www.worldpop.org - School of Geography and Environmental Science, University of Southampton; Department of Geography and Geosciences, University of Louisville; Departement de Geographie, Universite de Namur) and Center for International Earth Science Information Network (CIESIN), Columbia University (2018). Global High Resolution Population Denominators Project - Funded by The Bill and Melinda Gates Foundation (OPP1134076).
- Borders: [Natural Earth](https://www.naturalearthdata.com/), 1:10m (public domain).
