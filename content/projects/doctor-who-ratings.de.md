---
# The body translates the English write-up in doctor-who-ratings.md, which stays the source of truth:
# a change there needs the same change here. tagline and tags replace the manifest's.
title: "Regenerationen im Ranking"
demo: doctor-who-ratings
tagline: "Alle regulären Doctor-Who-Folgen seit 1963 mit ihren IMDb-Bewertungen."
tags: ["Datenanalyse", "IMDb-Bewertungen", "Doctor Who"]
description: "IMDb-Bewertungen aller regulären Doctor-Who-Folgen seit 1963: auf einer Zeitleiste, in einer Heatmap und in einer Rangliste der Doctors, Autoren und Regisseure."
---

{{< faq "Wer ist der beste Doctor?" >}}
Doctor Who läuft mit Unterbrechungen seit 1963. Jede Regeneration des Doctors hat nerdige Fans, die Stein und Bein schwören, dass ihre die beste ist. Es überrascht wohl kaum, dass ich beschlossen habe, die Frage mit Mathematik und Statistik zu entscheiden.

Die Demo zeigt die Bewertung jeder regulären Folge auf einer Zeitleiste und in einer Heatmap nach Staffel und Folge. Außerdem bringt sie die Doctors, Autoren und Regisseure in eine Rangliste.

Die kurze Antwort: Wie man auch zählt, David Tennant geht als bester Doctor hervor und Steven Moffat als bester Autor. Die meisten anderen Platzierungen hängen davon ab, wie man die Bewertung definiert.
{{< /faq >}}

{{< faq "Woher stammen die Daten?" >}}
Bewertungen und Stimmenzahlen stammen aus den [nichtkommerziellen Datensätzen](https://developer.imdb.com/non-commercial-datasets/) von IMDb, Stand 18. November 2026.

Alles andere stammt aus den Wikipedia-Listen der Folgen von *Doctor Who* für die [klassische](https://en.wikipedia.org/wiki/List_of_Doctor_Who_episodes_(1963%E2%80%931989)) und die [neue](https://en.wikipedia.org/wiki/List_of_Doctor_Who_episodes_(2005%E2%80%932025)) Serie: welche Folgen zu jeder Geschichte gehören, wann sie ausgestrahlt wurden und wer sie geschrieben und inszeniert hat.

Insgesamt sind das 863 Folgen in 291 Geschichten. Berücksichtigt sind nur reguläre Folgen. Die Specials, so wie Wikipedia sie aufführt, bleiben außen vor: die Weihnachts- und Neujahrsfolgen, die Jubiläumsspecials und der Fernsehfilm von 1996. Damit fallen der achte Doctor, der War Doctor und der vierzehnte Doctor heraus, und es bleiben 13 Doctors.

**Einschränkungen.**

- Die Bewertungen sind die von IMDb, abgegeben von denen, die die jeweilige Folge bewerten wollten. Folgen der klassischen Serie haben weit weniger Stimmen: im Median 587 pro Folge, gegenüber 8 101 bei der neuen Serie.
- Die Daten sind eine Momentaufnahme vom 18. November 2026, die Zahlen können sich also mit der Zeit etwas ändern.
- Specials sind nicht enthalten, daher fließen Geschichten wie *The Day of the Doctor* in niemandes Score ein.
{{< /faq >}}

{{< faq "Warum Geschichten zählen und nicht Folgen?" >}}
Die klassische Serie erzählte ihre Geschichten als Mehrteiler, die meisten mit vier oder sechs Folgen, während die neue Serie eine Geschichte meist in einer Folge erzählt, manchmal in zwei. Würde man Folgen zählen, hinge das Gewicht jedes Doctors der klassischen Serie davon ab, wie lang seine Mehrteiler waren. Die Einheit ist hier deshalb die Geschichte, so wie Wikipedia sie nummeriert. Die Bewertung einer Geschichte ist der Mittelwert der Bewertungen ihrer Folgen, und ihr Gewicht ist die durchschnittliche Zahl der Stimmen pro Folge, sodass ein Sechsteiler einmal zählt, genauso wie eine einzelne Folge.
{{< /faq >}}

{{< faq "Wie werden die Scores vergeben?" >}}
Jeder Doctor, Autor oder Regisseur erhält einen Score aus den Bewertungen seiner Geschichten. Die Bewertung hängt von drei Faktoren ab:

**Der Durchschnitt.** Einer von drei verschiedenen Durchschnitten: der Mittelwert der Bewertungen der Geschichten, der nach Stimmen pro Folge gewichtete Mittelwert oder der Median.

**Shrinkage.** Christopher Eccleston hat 10 Geschichten, Tom Baker dagegen 41. Das bedeutet, dass Christopher Ecclestons Durchschnitt weniger verlässlich ist als der von Tom Baker. Shrinkage trägt dem Rechnung, indem jeder zusätzliche Folgen erhält, alle mit dem Gesamtdurchschnitt bewertet. Das zieht die Bewertungen aller näher an den Durchschnitt, wirkt sich aber auf Christopher Eccleston stärker aus als auf Tom Baker. Im Ergebnis reicht eine Handvoll großartiger Folgen allein nicht aus. Für einen hohen Score braucht es einen hohen Durchschnitt über viele Folgen.

Genauer gesagt: Bei $k$ zusätzlichen Folgen mit dem Gesamtdurchschnitt $m$ erhält ein Doctor, der über $n$ Folgen im Schnitt $\bar{x}$ hat, den Score:

$$
\text{Score} = \frac{k m + n \bar{x}}{k + n}
$$

Der Wert von $k$ ist Ermessenssache, deshalb gibt es dafür in der Demo einen Schieberegler.

**Ära-Bereinigung.** Die beiden Ären schneiden auf IMDb nicht gleich ab: Die Geschichten der neuen Ära haben im Schnitt 7,65, die klassischen 7,29 (nach Stimmen gewichtet). Ein Vergleich von Folgen über die Ären hinweg verschafft den Geschichten der neuen Ära daher einen Vorsprung. Die Ära-Bereinigung beseitigt ihn, indem sie jede Folge am Durchschnitt ihrer eigenen Ära misst. Eine klassische Folge mit der Bewertung 7,8 erhält +0,5, weil sie den klassischen Durchschnitt um einen halben Punkt übertrifft. Eine Folge der neuen Serie mit denselben 7,8 erhält nur +0,15. Die Scores lassen sich dann als Punkte über oder unter einer typischen Folge derselben Ära lesen.

Autoren und Regisseure brauchen mindestens drei Geschichten, um in die Rangliste zu kommen, und eine gemeinsam geschriebene Geschichte zählt für jeden Autor voll.

Voreingestellt sind der nach Stimmen gewichtete Mittelwert, $k = 5$ und keine Ära-Bereinigung.
{{< /faq >}}

{{< faq "Hängt die Antwort davon ab, wie man zählt?" >}}
Ich habe für jede Kombination der Einstellungen eine Rangliste erstellt: drei Durchschnitte, Shrinkage von 0 bis 20 und Ära-Bereinigung an oder aus. Das ergibt $3 \times 21 \times 2 = 126$ Kombinationen.

In allen Kombinationen geht David Tennant als bester Doctor hervor, und Jodie Whittaker landet auf dem letzten Platz. Unter den Autoren steht Steven Moffat in allen 126 auf Platz eins.

Die meisten anderen Platzierungen hängen davon ab, wie man die Bewertung definiert: Tom Baker liegt zwischen Platz 2 und 7, Christopher Eccleston zwischen Platz 3 und 7, Peter Capaldi zwischen Platz 2 und 6 und Matt Smith zwischen Platz 2 und 4.
{{< /faq >}}

{{< faq "Wie ist diese Demo entstanden?" >}}
**Der Code** liegt auf [GitHub](https://github.com/Mark-Bugden/doctor-who-ratings). Eine Python-Pipeline verknüpft die Datensätze von IMDb mit den Tabellen aus Wikipedia, prüft das Ergebnis und berechnet die Platzierungen der Rangliste. Die Demo berechnet sie in JavaScript noch einmal, und ihre Tests prüfen, dass beide exakt übereinstimmen. Die Diagramme sind von Hand in SVG und HTML gezeichnet.

**Programmieren mit einem KI-Agenten:** Ich habe die Demo in mehreren Etappen mit Claude Code entwickelt, dem Programmieragenten von Anthropic.

1. **Recherche.** Der Agent ging mein ursprüngliches Notebook von 2025 Schritt für Schritt durch.
2. **Ein Plan,** in dem ich die Designfragen klärte, etwa dass Geschichten statt Folgen gezählt werden, woher die Angaben zu Autoren und Regisseuren stammen und welche Annahmen man in der Rangliste ändern kann.
3. **Die Daten:** die Python-Pipeline und ihre Tests, die die Zahl der Folgen jeder Staffel mit Wikipedia abgleichen und prüfen, dass die Geschichten rund um jede Regeneration dem richtigen Doctor zugeordnet werden.
4. **Die Oberfläche:** die Zeitleiste und die Heatmap, dann die Rangliste, deren in JavaScript berechnete Platzierungen gegen die aus Python getestet werden.
5. **Feinschliff,** nach meinen Notizen zur Live-Demo: leuchtendere Farben in der Heatmap, weniger Bedienelemente, eine bessere Suche und Tooltips, die die Zeitleiste nicht mehr verdecken. Für die Farben renderte der Agent Varianten in der echten Demo, und ich wählte zwischen ihnen.
{{< /faq >}}

Information courtesy of IMDb (https://www.imdb.com). Used with permission.
{lang="en"}

Wikipedia information under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
{lang="en"}
