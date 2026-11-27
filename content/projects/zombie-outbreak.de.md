---
# The body translates the English write-up in zombie-outbreak.md, which stays the source of truth:
# a change there needs the same change here. tagline and tags replace the manifest's.
demo: zombie-outbreak
tagline: "Eine Simulation eines Zombie-Ausbruchs in ganz Tschechien."
tags: ["mathematische Modellierung", "PDGL", "Epidemiologie"]
description: "Ein Zombie-Ausbruch, simuliert auf einer echten Bevölkerungskarte Tschechiens: ein SZR-Modell (Menschen, Zombies, Entfernte) in jedem Quadratkilometer, dazu Menschen, die zwischen benachbarten Zellen wandern."
---

{{< faq "Was ist das für eine Demo?" >}}
Jedes Mal, wenn ich einen Zombiefilm sehe, denke ich, wie unrealistisch er ist: Die Zombies überrennen die Städte in ein, zwei Tagen und kurz darauf den Rest der Welt. Zombie-Ausbrüche wurden schon früher mathematisch modelliert (der erste Fachartikel, den ich je gelesen habe, handelte von einem), aber die meisten Modelle betrachten die ganze Bevölkerung auf einmal, sodass man nicht sieht, wie sich die Zombies in einem Land ausbreiten. Ich wollte sehen, wie die Ausbreitung der Infektion in dem Land aussähe, in dem ich lebte.

Die Demo zeigt einen Zombie-Ausbruch auf einer Bevölkerungskarte Tschechiens, mit einem Quadratkilometer pro Pixel. In der ersten Woche bemerkt niemand die Infektion. Sie können von Anfang an Blockaden planen, indem Sie auf die einzelnen Regionen klicken, aber gebaut wird erst ab Tag 7, und selbst dann gibt es nur einen Bautrupp, der nicht im Handumdrehen baut. Im Hintergrund läuft derselbe Ausbruch ohne Quarantäne, und daran sieht die Demo, wie viele Menschen Ihre Quarantäne gerettet hat. Sie zählt auch die Menschen, die Sie eingeschlossen haben: alle in einem Gebiet, das Sie vom Rest des Landes abgeschnitten haben, zusammen mit den Zombies eingesperrt. Sie Monster.
{{< /faq >}}

{{< faq "Wie modelliert man einen Zombie-Ausbruch?" >}}
Der Ausbruch folgt dem SZR-Modell (Menschen, Zombies, Entfernte) von Munz, Hudea, Imad und Smith? (2009). Menschen ($S$) werden gebissen und zu Zombies ($Z$). Menschen können sich wehren und Zombies erledigen, die damit zu den Entfernten ($R$) übergehen. Wie im Film bleibt ein Zombie, der zu Boden geht, nicht immer liegen: Entfernte können als Zombies wieder aufstehen. Der Artikel berücksichtigt auch Geburten und natürliche Todesfälle, doch da die Demo nur ein Jahr dauert, lasse ich sie weg.

Im Artikel ist die Bevölkerung gut durchmischt: Jeder kann jedem begegnen. In jedem Quadratkilometer läuft dasselbe Modell, und Menschen wandern zwischen benachbarten Quadraten. Für das Modell gelten folgende Gleichungen:

$$
\frac{\partial S}{\partial t} = -\beta S Z + \nabla \cdot (\chi S \, \nabla z)
$$

Menschen werden gebissen und fliehen vor Zombies.
{.equation-note}

$$
\frac{\partial Z}{\partial t} = \beta S Z - \alpha S Z + \zeta R + D \, \Delta Z
$$

Zombies beißen, werden erledigt, stehen wieder auf und wandern umher.
{.equation-note}

$$
\frac{\partial R}{\partial t} = \alpha S Z - \zeta R
$$

Erledigte Zombies werden entfernt und können wieder aufstehen.
{.equation-note}

Die Parameter $\chi$ und $D$ beschreiben, wie sich die Bevölkerung bewegt: $D$ gibt an, wie schnell Zombies zufällig umherwandern, und $\chi$, wie schnell Menschen in benachbarte Quadrate fliehen, in denen Zombies einen kleineren Anteil der Anwesenden ausmachen. Dieser Anteil ist $z = Z / (S + Z)$, also der Anteil der Zombies an allen in einem Quadrat. Die übrigen drei Parameter stammen aus dem Artikel: $\beta$, $\alpha$ und $\zeta$ sind die Raten, mit denen Zombies beißen, erledigt werden und wieder aufstehen.

Für die Parameter des Modells habe ich einige Voreinstellungen hinterlegt, in Form von vier Stämmen: *Munz et al. (2009)* verwendet die Raten aus dem Artikel selbst, *Shamblers* sind langsamer, *Frenzied* schneller, und *Risers* verlieren die meisten Kämpfe, stehen aber schnell wieder auf.
{{< /faq >}}

{{< faq "Woher stammen die Daten?" >}}
Die Bevölkerungsdaten stammen aus der WorldPop-Schätzung 2020 für Tschechien, so angepasst, dass die Gesamtzahl für das Land mit der Zahl der Vereinten Nationen übereinstimmt. Das Raster von WorldPop ist in Winkeln statt in Entfernungen angelegt: Jede Zelle umfasst 30 Bogensekunden geographischer Breite mal 30 Bogensekunden geographischer Länge. Die Längenkreise rücken zusammen, je weiter man sich vom Äquator entfernt, daher ist eine Zelle um 50° nördlicher Breite, wo Tschechien liegt, von Nord nach Süd etwa 0,93 km lang, von Ost nach West aber nur 0,60 km. Jede Zelle umfasst also etwa 0,55 km², keinen ganzen Quadratkilometer. Behandelt man jede Zelle trotzdem als Quadratkilometer, zählt man am Ende 19,3 Millionen Menschen statt 10,75 Millionen, und die Karte wird in die Breite gezogen. Um das zu vermeiden, rechnet die Demo die Daten auf ein flächentreues Raster aus 1-km-Quadraten (ETRS89-LAEA) um, das die Bevölkerung nicht verzerrt. Die Grenzen der Regionen und die Staatsgrenze stammen von Natural Earth.
{{< /faq >}}

{{< faq "Kann eine Quarantäne den Ausbruch stoppen?" >}}
Das müssen Sie selbst herausfinden. Probieren Sie verschiedene Stämme aus und finden Sie eine optimale Strategie für den Bau von Blockaden. Sie können auch das Menü *Advanced* öffnen, um die Parameter von Hand einzustellen, oder eigene Blockaden zeichnen.
{{< /faq >}}

{{< faq "Ist das ein realistisches Modell?" >}}
Ich weiß, ich weiß, Zombies gibt es nicht.

Aber nehmen wir für den Moment an, es gäbe sie. Welche Grenzen hat das Modell, und worin unterscheidet es sich von dem, was wirklich passieren würde?

- Menschen reisen. Im Modell wandern Zombies nur in benachbarte Quadrate, und Menschen fliehen nur ins Nachbarquadrat, aber ein echter Ausbruch könnte mit Auto oder Zug an einem Nachmittag von Prag nach Brünn springen. Das ist ein wesentlicher Grund dafür, dass Blockaden in der Demo überhaupt funktionieren können.
- In einer echten Menschenmenge wächst die Zahl der Menschen, denen man begegnen kann, irgendwann nicht mehr. Im Modell nehmen die Bisse immer weiter zu, je voller ein Quadrat ist.
- Niemand hat gemessen, wie schnell Zombies beißen oder wie oft sie erledigt werden, daher sind die Raten nur beispielhaft. Das gilt auch für den Tag der Entdeckung und das Tempo des Bautrupps: Sie wurden so gewählt, dass eine Quarantäne funktionieren kann, aber schnell sein muss.
- Bei echten Ausbrüchen spielt der Zufall eine Rolle, aber das Modell ist deterministisch, sodass derselbe Plan immer dasselbe Ergebnis liefert.
- Echte Menschen würden mehr tun als weglaufen. Im Modell versteckt sich niemand, es gibt keine Evakuierungen, niemand organisiert sich, und niemand wird im Kampf gegen Zombies besser.
- Echte Blockaden sind undicht, und echte Grenzen wirken in beide Richtungen. In der Demo kommt nichts durch eine fertige Blockade, Zombies, die die Staatsgrenze überqueren, scheiden aus dem Modell aus, und Menschen verlassen Tschechien nie.
{{< /faq >}}

{{< faq "Wie ist diese Demo entstanden?" >}}
**Der Code** liegt auf [GitHub](https://github.com/Mark-Bugden/zombie-outbreak). Eine Python-Pipeline rechnet die Bevölkerungsdaten auf das 1-km-Raster um, und ein Referenzmodell in NumPy simuliert den Ausbruch. Die Demo führt es in JavaScript noch einmal aus, in einem Web Worker, und ihre Tests prüfen, dass beide exakt übereinstimmen. Karte und Diagramm werden auf einfachen Canvas-Elementen gezeichnet.

**Programmieren mit einem KI-Agenten:** Ich habe die Demo in mehreren Etappen mit Claude Code entwickelt, dem Programmieragenten von Anthropic.

1. **Recherche.** Der Agent ging meine ursprünglichen Notebooks von 2023 durch, in denen ein SIR-Modell mit Migration auf einer Bevölkerungskarte Deutschlands lief.
2. **Ein Plan,** in dem ich die Designfragen klärte, etwa dass der Ausbruch erst nach einer Woche bemerkt wird, dass ein einziger Bautrupp jede Blockade baut und dass derselbe Ausbruch ohne Quarantäne nebenher läuft, um die Geretteten zu zählen.
3. **Die Daten:** die Bevölkerung, umgerechnet auf ein flächentreues 1-km-Raster und abgeglichen mit der Gesamtzahl für das Land, den amtlichen Einwohnerzahlen der Regionen und der Lage der Städte.
4. **Das Modell:** das NumPy-Referenzmodell und seine Tests, dann die Portierung nach JavaScript, deren Tests die Ergebnisse des Referenzmodells nachrechnen.
5. **Die Quarantäne:** Blockaden, Abriegelungen und der Bautrupp, dann der Lauf ohne Quarantäne und die Zusammenfassung. Die Stämme, der Tag der Entdeckung und das Tempo des Bautrupps wurden gemeinsam mit mir auf der ganzen Karte abgestimmt, anhand von Testläufen, die der Agent durchführte.
6. **Feinschliff,** nach meinen Notizen zur Live-Demo: das Diagramm als Zeitleiste, weniger Bedienelemente, „blockade“ statt „cordon“, eine Farbe für die Toten und eine Demo, die ins Fenster passt.
{{< /faq >}}

## Quellen

- Munz, P., Hudea, I., Imad, J. and Smith?, R. J. (2009). [When zombies attack!: Mathematical modelling of an outbreak of zombie infection](https://loe.org/images/content/091023/Zombie%20Publication.pdf). In *Infectious Disease Modelling Research Progress*, pp. 133–150. Nova Science.
- Population: [WorldPop](https://dx.doi.org/10.5258/SOTON/WP00675), Czech Republic 2020, UN-adjusted, 1 km ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). WorldPop (www.worldpop.org - School of Geography and Environmental Science, University of Southampton; Department of Geography and Geosciences, University of Louisville; Departement de Geographie, Universite de Namur) and Center for International Earth Science Information Network (CIESIN), Columbia University (2018). Global High Resolution Population Denominators Project - Funded by The Bill and Melinda Gates Foundation (OPP1134076).
- Borders: [Natural Earth](https://www.naturalearthdata.com/), 1:10m (public domain).
{lang="en"}
