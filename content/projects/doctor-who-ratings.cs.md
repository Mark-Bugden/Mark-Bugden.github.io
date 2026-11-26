---
# The body translates the English write-up in doctor-who-ratings.md, which stays the source of truth:
# a change there needs the same change here. tagline and tags replace the manifest's.
title: "Hodnocení regenerací"
demo: doctor-who-ratings
tagline: "Analýza všech řadových epizod seriálu Doctor Who od roku 1963 podle jejich hodnocení na IMDb."
tags: ["analýza dat", "hodnocení na IMDb", "Doctor Who"]
description: "Hodnocení z IMDb pro všechny řadové epizody seriálu Doctor Who od roku 1963: na časové ose, v teplotní mapě a v žebříčku Doktorů, scenáristů a režisérů."
---

{{< faq "Kdo je nejlepší Doktor?" >}}
Seriál Doctor Who se s přestávkami vysílá od roku 1963. Každá regenerace Doktora má své nerdské fanoušky, kteří budou přísahat, že ta jejich je nejlepší. Asi nikoho nepřekvapí, že jsem se rozhodl spor rozsoudit matematikou a statistikou.

Demo ukazuje hodnocení každé řadové epizody na časové ose a v teplotní mapě podle sérií a epizod. Doktory, scenáristy a režiséry také seřadí v žebříčku.

Krátká odpověď: ať počítáte jakkoli, jako nejlepší Doktor vychází David Tennant a jako nejlepší scenárista Steven Moffat. Většina ostatních umístění závisí na tom, jak si hodnocení definujete.
{{< /faq >}}

{{< faq "Odkud pocházejí data?" >}}
Hodnocení a počty hlasů pocházejí z [nekomerčních datových sad](https://developer.imdb.com/non-commercial-datasets/) IMDb, podle stavu k 18. listopadu 2026.

Vše ostatní pochází ze seznamů epizod [původního](https://en.wikipedia.org/wiki/List_of_Doctor_Who_episodes_(1963%E2%80%931989)) a [obnoveného](https://en.wikipedia.org/wiki/List_of_Doctor_Who_episodes_(2005%E2%80%932025)) seriálu *Doctor Who* na Wikipedii: které epizody tvoří jednotlivé příběhy, kdy se vysílaly a kdo je napsal a režíroval.

Celkem jde o 863 epizod v 291 příbězích. Zahrnuté jsou jen řadové epizody. Speciály, tak jak je vede Wikipedie, jsou vynechané: vánoční a novoroční epizody, výroční speciály a televizní film z roku 1996. Tím vypadávají Osmý, Válečný a Čtrnáctý Doktor, takže zbývá 13 Doktorů.

**Výhrady.**

- Hodnocení pocházejí z IMDb, od těch, kdo se danou epizodu rozhodli ohodnotit. Epizody původního seriálu mají mnohem méně hlasů: medián 587 na epizodu oproti 8 101 u obnoveného seriálu.
- Data zachycují stav k 18. listopadu 2026, takže se čísla mohou časem trochu změnit.
- Speciály jsou vynechané, takže se příběhy jako *The Day of the Doctor* nikomu nezapočítávají do skóre.
{{< /faq >}}

{{< faq "Proč počítat příběhy, a ne epizody?" >}}
Původní seriál vyprávěl své příběhy na pokračování, nejčastěji ve čtyřech nebo šesti epizodách, kdežto obnovený seriál vypráví příběh většinou v jedné epizodě, občas ve dvou. Při počítání epizod by každý Doktor z původního seriálu měl váhu podle toho, jak dlouhé byly jeho příběhy. Jednotkou je tu proto příběh, jak ho čísluje Wikipedie. Hodnocení příběhu je průměrem hodnocení jeho epizod a jeho váha je průměrný počet hlasů na epizodu, takže šestidílný příběh se počítá jednou, stejně jako jediná epizoda.
{{< /faq >}}

{{< faq "Jak se přiděluje skóre?" >}}
Každý Doktor, scenárista nebo režisér dostane skóre vypočtené z hodnocení svých příběhů. Hodnocení určují tři faktory:

**Průměr.** Jeden ze tří různých průměrů: prostý průměr hodnocení příběhů, průměr vážený počtem hlasů na epizodu nebo medián.

**Smršťování.** Christopher Eccleston má 10 příběhů, kdežto Tom Baker 41. To znamená, že průměr Christophera Ecclestona je méně spolehlivý než průměr Toma Bakera. Smršťování to zohledňuje tak, že každému přidá epizody navíc, všechny s hodnocením rovným celkovému průměru. Hodnocení všech se tím přitáhne blíž k průměru, ale na Christophera Ecclestona to má větší vliv než na Toma Bakera. Výsledkem je, že hrstka skvělých epizod sama o sobě nestačí. Vysoké skóre vyžaduje vysoký průměr napříč mnoha epizodami.

Konkrétněji: při $k$ epizodách navíc s hodnocením rovným celkovému průměru $m$ dostane Doktor, který má v $n$ epizodách průměr $\bar{x}$, skóre:

$$
\text{skóre} = \frac{k m + n \bar{x}}{k + n}
$$

Hodnota $k$ je věcí úsudku, a proto ji v demu nastavuje posuvník.

**Očištění o vliv éry.** Obě éry si na IMDb nevedou stejně: příběhy nové éry mají v průměru 7,65 a ty z původního seriálu 7,29 (váženo počtem hlasů). Při srovnávání epizod napříč érami tak mají příběhy nové éry náskok. Očištění o vliv éry ho odstraňuje tím, že každou epizodu hodnotí vůči průměru její vlastní éry. Epizoda původního seriálu s hodnocením 7,8 získá +0,5, protože průměr původního seriálu překonává o půl bodu. Epizoda obnoveného seriálu se stejným hodnocením 7,8 získá jen +0,15. Skóre pak udává, o kolik bodů je epizoda nad typickou epizodou téže éry, nebo pod ní.

Scenáristé a režiséři potřebují k zařazení do žebříčku alespoň tři příběhy a společně napsaný příběh se plně započítá každému ze scenáristů.

Výchozí nastavení je průměr vážený počtem hlasů, $k = 5$ a vypnuté očištění o vliv éry.
{{< /faq >}}

{{< faq "Záleží odpověď na tom, jak se počítá?" >}}
Sestavil jsem žebříček pro každou kombinaci nastavení: tři průměry, smršťování od 0 do 20 a očištění o vliv éry zapnuté nebo vypnuté. To dává $3 \times 21 \times 2 = 126$ kombinací.

Ve všech kombinacích vychází jako nejlepší Doktor David Tennant a jako nejhorší Jodie Whittaker. Mezi scenáristy je Steven Moffat první ve všech 126.

Většina ostatních umístění závisí na tom, jak hodnocení definujete: Tom Baker se pohybuje od 2. do 7. místa, Christopher Eccleston od 3. do 7., Peter Capaldi od 2. do 6. a Matt Smith od 2. do 4. místa.
{{< /faq >}}

{{< faq "Jak toto demo vzniklo?" >}}
**Kód** je na [GitHubu](https://github.com/Mark-Bugden/doctor-who-ratings). Pipeline v Pythonu propojuje datové sady IMDb s tabulkami z Wikipedie, kontroluje výsledek a počítá pořadí v žebříčku. Demo je v JavaScriptu počítá znovu a testy dema ověřují, že se obě verze přesně shodují. Grafy jsou kreslené ručně v SVG a HTML.

**Programování s AI agentem:** Demo jsem vytvářel po etapách v Claude Code, programovacím agentovi společnosti Anthropic.

1. **Rešerše.** Agent krok za krokem prošel můj původní notebook z roku 2025.
2. **Plán,** ve kterém jsem vyřešil otázky návrhu, například že se budou počítat příběhy místo epizod, odkud se vezmou údaje o scenáristech a režisérech a které předpoklady žebříčku půjde měnit.
3. **Data:** pipeline v Pythonu a její testy, které ověřují počet epizod v každé sérii podle Wikipedie a to, že příběhy kolem každé regenerace připadnou správnému Doktorovi.
4. **Rozhraní:** časová osa a teplotní mapa, pak žebříček, jehož pořadí spočítané v JavaScriptu testy porovnávají s pořadím z Pythonu.
5. **Doladění** podle mých poznámek k demu na webu: jasnější barvy teplotní mapy, méně ovládacích prvků, lepší vyhledávání a okénka při najetí myší, která už nezakrývají časovou osu. Barvy agent vykreslil v několika variantách přímo ve skutečném demu a já jsem si z nich vybral.
{{< /faq >}}

Information courtesy of IMDb (https://www.imdb.com). Used with permission.
{lang="en"}

Wikipedia information under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
{lang="en"}
