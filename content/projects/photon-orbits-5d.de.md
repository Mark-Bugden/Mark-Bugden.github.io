---
# Front matter only: the page shows the English write-up and demo, with a note that they are in
# English. A body here replaces the English write-up. tagline and tags replace the manifest's.
title: "Photonen im Orbit"
demo: photon-orbits-5d
tagline: "Licht, das ein rotierendes fünfdimensionales Schwarzes Loch umkreist."
tags: ["Allgemeine Relativitätstheorie", "Schwarze Löcher", "Geodäten"]
description: "Licht, das ein rotierendes fünfdimensionales Schwarzes Loch umkreist: sphärische Photonenbahnen um ein Schwarzes Loch vom Myers-Perry-Typ, direkt im Browser gezeichnet."
---

{{< faq "Was ist das für eine Demo?" >}}
Diese Demo zeigt, wie Photonenbahnen um ein rotierendes Schwarzes Loch in einer fünfdimensionalen Raumzeit aussähen, um das Schwarze Loch vom Myers-Perry-Typ. Grundlage ist meine Forschung, die ich 2018 im Artikel [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x) veröffentlicht habe. Sie können den Spin des Schwarzen Lochs wählen und dazu die Drehimpulse des Photons. Die Demo findet die Bahn und lässt das Photon darauf umlaufen. Die Voreinstellungen reproduzieren die Abbildungen aus dem Artikel und einige weitere interessante Bahnen.

Angeregt wurde die Demo durch Leo Steins Tool [Kerr spherical photon orbits](https://duetosymmetry.com/tool/kerr-circular-photon-orbits/), das eine ähnliche Darstellung für das vierdimensionale Kerr-Loch erzeugt.
{{< /faq >}}

{{< faq "Wie können wir Licht untersuchen, das ein Schwarzes Loch umkreist?" >}}
Schwarze Löcher sind exotische Objekte in unserem Universum, doch wenn wir die Einsteinschen Feldgleichungen untersuchen, die die Gravitation beschreiben, können wir diese Objekte und ihr seltsames gravitatives Verhalten verstehen. Die Mathematik zeigt, dass ein rotierendes Schwarzes Loch Raum und Zeit mit sich zieht. In der Nähe eines solchen rotierenden Schwarzen Lochs ist die Raumzeit so stark gekrümmt, dass Licht das Schwarze Loch wie ein Satellit umkreisen kann. Das Licht bleibt dabei in konstantem Abstand vom Schwarzen Loch, daher heißen diese Bahnen sphärische Photonenbahnen. Um das gewöhnliche rotierende Schwarze Loch der vierdimensionalen Raumzeit, das Kerr-Loch, sind sie gut untersucht. Sie hängen auch mit einer ganzen Reihe weiterer Themen zusammen, etwa mit dem Aussehen eines Sterns im Gravitationskollaps, mit dem Schatten eines Schwarzen Lochs und mit dem Nachthimmel, wie ihn ein Beobachter nahe einem Schwarzen Loch sähe.
{{< /faq >}}

{{< faq "Wie unterscheidet sich ein fünfdimensionales Schwarzes Loch von einem „normalen“ Schwarzen Loch in vier Dimensionen?" >}}
Abgesehen davon, dass es in einem fünfdimensionalen Universum existiert, unterscheidet sich ein rotierendes Schwarzes Loch in fünf Dimensionen von einem rotierenden Schwarzen Loch in vier Dimensionen vor allem durch den Spin. In drei Raumdimensionen dreht sich ein Körper in einer Ebene, und senkrecht dazu gibt es nur eine Dimension, also wird der Spin eines Körpers durch eine einzige Zahl beschrieben (beim Kerr-Loch durch den Rotationsparameter $a$). In vier Raumdimensionen bleiben, wenn man die Ebene festlegt, in der sich ein Körper dreht, noch zwei dazu senkrechte Dimensionen übrig, in denen er sich ebenfalls drehen könnte – der Körper wird daher durch zwei Spins beschrieben. Bei einem rotierenden fünfdimensionalen Schwarzen Loch geben also zwei Zahlen an, wie schnell es sich dreht: die Parameter $a$ und $b$ in der Demo.

Auch die Bewegung des Photons ist in fünf Dimensionen anders als in vier. So wie das Schwarze Loch zwei Arten von Spin hat, hat das Photon zwei Arten von Drehimpuls, $\Phi$ und $\Psi$. In der Demo können Sie die Drehimpulse des Photons frei wählen, innerhalb der Bereiche, in denen es noch sphärische Bahnen gibt.
{{< /faq >}}

{{< faq "Wie veranschaulicht man eine fünfdimensionale Raumzeit?" >}}
Eine sphärische Photonenbahn bleibt auf einem festen Radius. Lässt man die Zeit weg, bewegt sich das Photon also auf einer dreidimensionalen Hyperfläche, die durch die Winkel $\theta$, $\phi$ und $\psi$ beschrieben wird. Diese Winkel beschreiben eine 3-Sphäre, die sich in drei Dimensionen nicht so leicht darstellen lässt (die gewohnte Kugeloberfläche, etwa die eines Wasserballs, ist eine 2-Sphäre, das hier ist also ihre höherdimensionale Variante). Damit sich die Bahnen leichter veranschaulichen lassen, kodiere ich die zusätzliche Information mit einem Trick in der Farbe.

Die Demo verwendet die Darstellung aus dem Artikel:

$$
\begin{aligned}
X &= \sqrt{r^2 + a^2}\,\sin\theta\cos\phi \\
Y &= \sqrt{r^2 + a^2}\,\sin\theta\sin\phi \\
Z &= \sqrt{r^2 + b^2}\,\cos\theta \\
\text{Farbe} &= \psi
\end{aligned}
$$

In der Ebene von $a$ ist das Photon $\sqrt{r^2 + a^2}\,\sin\theta$ vom Mittelpunkt entfernt, in Richtung $\phi$. In der Ebene von $b$ ist es $\sqrt{r^2 + b^2}\,\cos\theta$ vom Mittelpunkt entfernt, in Richtung $\psi$. $X$ und $Y$ geben seine Position in der Ebene von $a$ an. $Z$ ist sein Abstand vom Mittelpunkt in der Ebene von $b$, als Höhe aufgetragen, und die Farbe ist seine Richtung in dieser Ebene. Die Darstellung lässt also nichts weg: Position und Farbe ergeben zusammen alle vier Raumkoordinaten.

Bei festem Radius liegt jeder Punkt auf einem Sphäroid. Es ist für $a > b$ abgeplattet, für $a = b$ eine Kugel und für $b > a$ entlang $Z$ gestreckt, wie der „Rugbyball“ in Abb. 4.6 des Artikels. Die Projektion im Artikel dreht das Bild außerdem um einen konstanten Winkel, $\arctan(a/r)$. Bei festem Radius ist das eine starre Drehung, deshalb lässt die Demo sie weg und dreht stattdessen die Kamera.

Die Farben folgen dem Farbkreis aus Abb. 4.1 des Artikels: Rot bei $\psi = 0$, dann im Abstand von je $\pi/3$ Gelb, Grün, Cyan, Blau und Magenta. Der Ring oben links in der 3D-Ansicht ist die Legende, mit einem Zeiger, der das $\psi$ des Photons anzeigt. Gegenüberliegende Farben sind für Betrachter mit Rot-Grün-Sehschwäche schwerer zu unterscheiden, deshalb zeigt der Torus in der Seitenleiste $\psi$ auch über die Position.

Bei $\Phi = 0$ führt die Bahn direkt über den Pol, bei $\Psi = 0$ kreuzt sie den Äquator. Dort laufen die Koordinaten einfach weiter, wie in den Abbildungen des Artikels: Der Weg führt über den Pol oder wechselt auf die untere Hälfte des Sphäroids und behält dabei seine Farbe. Jeder von null verschiedene Drehimpuls hält die Bahn von der Achse fern, und sie kehrt kurz davor um, wobei sich $\phi$ oder $\psi$ rasch ändert.

**Der Zusammenhang mit dem Kerr-Loch.** Für $b = 0$ und $\Psi = 0$ dreht sich das Loch nicht in der Ebene von $b$, und das Photon hat darin keinen Drehimpuls. Es bewegt sich also entlang einer festen Geraden durch den Mittelpunkt dieser Ebene: $\psi$ ändert sich nie, und die ganze Bahn hat eine einzige Farbe. Das Bild gleicht dann den üblichen Darstellungen sphärischer Photonenbahnen um ein Kerr-Loch. $X$ und $Y$ spannen die Ebene auf, in der sich das Loch dreht, $Z$ steht senkrecht darauf, wie die Achse des Kerr-Lochs, und die Bahn schwingt über den Äquator von einer Seite zur anderen. So sehen Abb. 4.2 und 4.3 aus. Die Bahnen selbst sind nicht die des Kerr-Lochs, denn es ist ein anderes Schwarzes Loch, aber man liest sie genauso.
{{< /faq >}}

{{< faq "Was bewirken die Bedienelemente? Was zeigen die Diagramme?" >}}
- **Spins** legt die Rotationsparameter $a$ und $b$ des Schwarzen Lochs fest. Sie sind auf $a + b \le 1$ beschränkt, denn darüber hinaus gibt es keinen Horizont. Bei $a + b = 1$ ist das Loch extremal, und der Hinweis „Extremal“ erscheint.
- **Momenta** ist ein Feld mit $\Phi$ nach rechts und $\Psi$ nach oben. Der schattierte Bereich enthält die Paare, für die es eine sphärische Bahn gibt, und die Tönung zeigt den Radius der Bahn: dunkler für Bahnen weiter innen, heller für Bahnen weiter außen. Ziehen Sie den Punkt, um eine Bahn zu wählen. Er rastet an den Achsen ein, wo $\Phi = 0$ oder $\Psi = 0$ ist, und mit den Schiebereglern und den Pfeiltasten lässt er sich in feineren Schritten bewegen.
- **Trail length** gibt an, wie viel vom bisherigen Weg des Photons gezeichnet bleibt. Gemessen wird diese Länge im affinen Parameter $\lambda$, der Uhr der Demo.
- Der Pfeil unter dem Sphäroid zeigt, in welche Richtung sich das Loch in der Ebene von $a$ dreht. Die Drehung des Lochs in der Ebene von $b$ zeigt sich nur in den Farben, deshalb läuft der Pfeil für $b$ um die Farblegende herum.

Der Bereich im Feld ist eine konvexe Raute mit gekrümmten Seiten, und außerhalb davon gibt es keine sphärische Bahn. Die Ecken sind Kreisbahnen in jeweils einer der beiden Ebenen, und die Ränder sind Bahnen, die auf einem Breitenkreis bleiben.

Die Seitenleiste zeigt $\theta$, $\phi$ und $\psi$ in Abhängigkeit von $\lambda$ über die sichtbare Spur. Der Farbstreifen unter $\psi$ ist die Farbe der Spur im jeweiligen Moment. $\phi$ und $\psi$ laufen von $0$ bis $2\pi$ und beginnen dann wieder von vorn. Die Kurven sind Geodäten, deshalb bleiben sie auch an den Achsen glatt: Dort läuft $\theta$ über $0$ oder $\pi/2$ hinaus weiter, statt zu springen.

Der zweite Reiter zeigt die Spur auf einem Torus, mit $\phi$ nach rechts und $\psi$ nach oben, jeweils von $0$ bis $2\pi$. Jede Schwingung in der Breite verschiebt $\phi$ und $\psi$ jeweils um eine feste Zahl von Umdrehungen, und beide Zahlen stehen in der Statuszeile. Nur wenn beide rational sind, schließt sich die Bahn, und dann ist sie eine geschlossene Kurve auf dem Torus. Jede andere Bahn wiederholt sich nie: Mit der Zeit füllt sie das Quadrat aus und in 3D das ganze Breitenband.
{{< /faq >}}

{{< faq "Was bedeutet „extremal“?" >}}
Ein Schwarzes Loch einer bestimmten Masse kann sich nur begrenzt schnell drehen. Ein rotierendes Schwarzes Loch hat zwei Horizonte, den Ereignishorizont und darin einen inneren Horizont. Mit wachsendem Spin rücken sie zusammen, und beim schnellstmöglichen Spin verschmelzen sie. Ein solches Schwarzes Loch ist extremal. Drehte es sich noch schneller, gäbe es überhaupt keinen Horizont mehr, nur eine nackte Singularität, und die sollte laut der Hypothese der kosmischen Zensur nie entstehen. Ein extremales Schwarzes Loch ist außerdem kalt: Seine Hawking-Temperatur ist null.

Für ein Kerr-Loch der Masse $M$ bedeutet extremal $a = M$, in Einheiten mit $G = c = 1$. Für das Schwarze Loch vom Myers-Perry-Typ mit $\mu = 1$ bedeutet es $a + b = 1$, und die beiden Horizonte treffen sich bei $r^2 = ab$. Mit nur einem Spin gibt es keinen inneren Horizont, auf den der Ereignishorizont treffen könnte, und wenn $a$ gegen $1$ geht, schrumpft der Ereignishorizont zu nichts zusammen. Die extremalen Löcher der Demo drehen sich daher in beiden Ebenen. Abb. 4.8 mit $a = 0.9$ und $b = 0.1$ zeigt ein solches.
{{< /faq >}}

{{< faq "Wie ist diese Demo entstanden?" >}}
**Die Berechnung.** Die Demo simuliert das Photon nicht in vielen kleinen Schritten. Stattdessen nutzt sie aus, wie regelmäßig die Bahn ist. Eine sphärische Photonenbahn bleibt auf festem Radius, und jede Schwingung zwischen ihren beiden Breiten gleicht der vorigen, bis darauf, wie weit sich das Photon in $\phi$ und $\psi$ gedreht hat. Die Demo berechnet also eine einzige Schwingung sehr genau und setzt den ganzen Weg durch Wiederholen daraus zusammen. Dazu schreibt sie die Bewegungsgleichungen in der Mino-Zeit, in der sich die Schwingung in der Breite von allem anderen trennt, und integriert über eine Schwingung mit der Simpsonregel, wobei sie die scharfen Spitzen nahe den Achsen exakt behandelt. Der Weg ist auf etwa $10^{-7}$ genau, auch eine lange Spur driftet nie, und eine direkte Integration der vollständigen Geodätengleichungen stimmt damit überein. Diese Bahnen sind instabil, deshalb hält die Demo, wie der Artikel, den Radius fest und zeigt die ideale Bahn.

**Der Code** liegt auf [GitHub](https://github.com/Mark-Bugden/photon-orbits-5d). Die Tests des Python-Modells gleichen es mit dem Artikel, mit geschlossenen Ausdrücken und mit der direkten Integration ab, und die Tests des JavaScript-Codes rechnen die Ergebnisse des Modells nach. Die 3D-Ansicht wird mit [three.js](https://threejs.org/) gezeichnet, das Feld und die Seitenleiste auf einfachen Canvas-Elementen.

**Programmieren mit einem KI-Agenten:** Ich habe die Demo in mehreren Etappen mit Claude Code entwickelt, dem Programmieragenten von Anthropic.

1. **Recherche.** Der Agent prüfte den Artikel Zeile für Zeile, reproduzierte seine Abbildungen und verschaffte sich einen Überblick über die bereits vorhandenen Werkzeuge, darunter das von Leo Stein.
2. **Ein Plan,** in dem ich die Designfragen klärte, etwa den Farbkreis, die Darstellung von Bahnen durch die Achsen und die Wahl der Uhr.
3. **Die Physik:** das Python-Modell und seine Tests sowie ein Dokument, das jede Gleichung so aufführt, wie sie implementiert ist, und das ich geprüft habe.
4. **Die Portierung nach JavaScript,** deren Tests die Ergebnisse des Python-Modells nachrechnen.
5. **Die Oberfläche:** die 3D-Ansicht, dann das Feld und die Voreinstellungen, per Skript an die Abbildungen des Artikels angepasst, dann die Seitenleiste. Der Agent testete jeden Teil in einem Headless-Browser, bevor ich ihn durchsah.
{{< /faq >}}

## Literatur

- Bugden, M. (2018). [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x). *General Relativity and Gravitation* 50. [arXiv:1801.03389](https://arxiv.org/abs/1801.03389).
- Myers, R. C. and Perry, M. J. (1986). Black holes in higher dimensional space-times. *Annals of Physics* 172, 304–347.
- Frolov, V. P. and Stojković, D. (2003). [Particle and light motion in a space-time of a five-dimensional rotating black hole](https://arxiv.org/abs/gr-qc/0301016). *Physical Review D* 68, 064011.
- Teo, E. (2003). [Spherical photon orbits around a Kerr black hole](https://physics.nus.edu.sg/wp-content/uploads/sites/5/2019/10/paper.pdf). *General Relativity and Gravitation* 35, 1909–1926.
{lang="en"}
