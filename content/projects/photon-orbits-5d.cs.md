---
# The body translates the English write-up in photon-orbits-5d.md, which stays the source of truth:
# a change there needs the same change here. tagline and tags replace the manifest's.
title: "Po stopách fotonů"
demo: photon-orbits-5d
tagline: "Vizualizace světla obíhajícího kolem rotující pětirozměrné černé díry."
tags: ["matematická fyzika", "černé díry", "geodetiky"]
description: "Světlo obíhající kolem rotující pětirozměrné černé díry: sférické fotonové orbity kolem Myersovy–Perryho černé díry, vykreslené přímo v prohlížeči."
---

{{< faq "Co je to za demo?" >}}
Toto demo znázorňuje, jak by vypadaly fotonové orbity kolem rotující černé díry v pětirozměrném prostoročase, tedy kolem Myersovy–Perryho černé díry. Vychází z práce, kterou jsem v roce 2018 publikoval v článku [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x). Můžete zvolit spin černé díry i momenty hybnosti fotonu. Demo pak orbitu najde a pošle po ní foton. Předvolby reprodukují obrázky z článku a také několik dalších zajímavých orbit.

Inspirací pro demo byl nástroj [Kerr spherical photon orbits](https://duetosymmetry.com/tool/kerr-circular-photon-orbits/) od Lea Steina, který podobně znázorňuje orbity kolem čtyřrozměrné Kerrovy černé díry.
{{< /faq >}}

{{< faq "Jak můžeme zkoumat světlo obíhající kolem černé díry?" >}}
Černé díry jsou ve vesmíru exotické objekty, ale studium Einsteinových rovnic pole, které popisují gravitaci, nám umožňuje tyto objekty a jejich podivné gravitační chování pochopit. Z matematiky plyne, že rotující černá díra s sebou strhává prostor i čas. V blízkosti takové rotující černé díry je zakřivení prostoročasu tak velké, že kolem ní světlo může obíhat jako družice. Světlo se přitom drží ve stálé vzdálenosti od černé díry, a proto se těmto orbitám říká sférické fotonové orbity. Kolem obyčejné rotující černé díry ve čtyřrozměrném prostoročase, Kerrovy černé díry, jsou dobře prozkoumané. Souvisejí také s celou řadou dalších témat, například s tím, jak by vypadala hvězda při gravitačním kolapsu, jak by vypadal stín černé díry a jakou noční oblohu by viděl pozorovatel poblíž černé díry.
{{< /faq >}}

{{< faq "Čím se pětirozměrná černá díra liší od „normální“ černé díry ve čtyřech rozměrech?" >}}
Až na to, že existuje v pětirozměrném vesmíru, se rotující černá díra v pěti rozměrech liší od rotující černé díry ve čtyřech rozměrech hlavně spinem. Ve třech prostorových rozměrech se těleso otáčí v rovině a kolmo k ní zbývá jen jeden rozměr, takže spin tělesa popisuje jediné číslo (u Kerrovy černé díry rotační parametr $a$). Ve čtyřech prostorových rozměrech zbývají po určení roviny, v níž se těleso otáčí, ještě dva kolmé rozměry, v nichž se může otáčet také – těleso proto popisují dva spiny. Rotující pětirozměrnou černou díru tedy charakterizují dvě čísla, která udávají, jak rychle se otáčí: v demu jsou to parametry $a$ a $b$.

Pohyb fotonu se v pěti rozměrech také liší od pohybu ve čtyřech. Stejně jako má černá díra dva druhy spinu, má foton dva druhy momentu hybnosti, $\Phi$ a $\Psi$. V demu můžete momenty hybnosti fotonu volně nastavit v rozmezích, pro která ještě existují sférické orbity.
{{< /faq >}}

{{< faq "Jak znázornit pětirozměrný prostoročas?" >}}
Sférická fotonová orbita se drží na jednom poloměru. Pokud tedy pomineme čas, pohybuje se foton po trojrozměrné nadploše popsané úhly $\theta$, $\phi$ a $\psi$. Tyto úhly popisují 3-sféru, kterou ve třech rozměrech jen těžko znázorníme (obyčejná sféra, na jakou jste zvyklí, třeba nafukovací míč, je 2-sféra, takže tohle je její vícerozměrná obdoba). Aby se orbity daly snáz znázornit, používám trik: informaci navíc vyjádřím barvou.

Demo přebírá zobrazení z článku:

$$
\begin{aligned}
X &= \sqrt{r^2 + a^2}\,\sin\theta\cos\phi \\
Y &= \sqrt{r^2 + a^2}\,\sin\theta\sin\phi \\
Z &= \sqrt{r^2 + b^2}\,\cos\theta \\
\text{barva} &= \psi
\end{aligned}
$$

V rovině $a$ je foton ve vzdálenosti $\sqrt{r^2 + a^2}\,\sin\theta$ od středu, ve směru $\phi$. V rovině $b$ je ve vzdálenosti $\sqrt{r^2 + b^2}\,\cos\theta$ od středu, ve směru $\psi$. $X$ a $Y$ udávají jeho polohu v rovině $a$. $Z$ je jeho vzdálenost od středu v rovině $b$, vynesená jako výška, a barva udává jeho směr v této rovině. Zobrazení tedy nic nevynechává: poloha a barva dohromady dávají všechny čtyři prostorové souřadnice.

Při pevném poloměru leží všechny body na sféroidu. Pro $a > b$ je zploštělý, pro $a = b$ je to sféra a pro $b > a$ je protáhlý podél $Z$ jako „ragbyový míč“ na obr. 4.6 v článku. Projekce v článku navíc obraz otáčí o konstantní úhel $\arctan(a/r)$. Při pevném poloměru jde o otočení celého obrazu, takže ho demo vynechává a místo toho otáčí kamerou.

Barvy odpovídají barevnému kruhu z obr. 4.1 v článku: červená při $\psi = 0$, pak po každých $\pi/3$ žlutá, zelená, azurová, modrá a purpurová. Prstenec vlevo nahoře ve 3D pohledu slouží jako legenda a ručička na něm ukazuje $\psi$ fotonu. Lidé s červeno-zelenou barvoslepostí rozlišují protilehlé barvy hůř, a proto torus v bočním panelu ukazuje $\psi$ i polohou.

Pro $\Phi = 0$ prochází orbita přímo přes pól a pro $\Psi = 0$ protíná rovník. Souřadnice tam plynule pokračují dál, stejně jako na obrázcích v článku: dráha vede přes pól, nebo přejde na dolní polovinu sféroidu a barvu si zachová. Jakýkoli nenulový moment hybnosti drží orbitu mimo osu a orbita se těsně před ní obrátí, přičemž se $\phi$ nebo $\psi$ prudce změní.

**Vztah ke Kerrově černé díře.** Pro $b = 0$ a $\Psi = 0$ se díra v rovině $b$ neotáčí a foton v ní nemá žádný moment hybnosti. Pohybuje se tedy po pevné přímce procházející středem této roviny: $\psi$ se nikdy nemění a celá orbita má jednu barvu. Obraz pak vypadá jako běžné obrázky sférických fotonových orbit kolem Kerrovy černé díry. $X$ a $Y$ určují rovinu, v níž se díra otáčí, osa $Z$ je k ní kolmá, podobně jako osa Kerrovy černé díry, a orbita se kývá přes rovník z jedné strany na druhou. Tak vypadají obr. 4.2 a 4.3. Samotné orbity nejsou stejné jako u Kerrovy černé díry, protože jde o jinou černou díru, ale čtou se stejně.
{{< /faq >}}

{{< faq "K čemu slouží ovládací prvky? Co ukazují grafy?" >}}
- **Spins** nastavuje rotační parametry černé díry, $a$ a $b$. Jsou omezené podmínkou $a + b \le 1$, protože za touto hranicí už žádný horizont není. Při $a + b = 1$ je díra extremální a objeví se štítek „Extremal“.
- **Momenta** je ovládací plocha, na které je vodorovně $\Phi$ a svisle $\Psi$. Stínovaná oblast obsahuje dvojice, pro které existuje sférická orbita, a odstín ukazuje poloměr orbity: tmavší pro bližší orbity, světlejší pro vzdálenější. Orbitu zvolíte přetažením tečky. Tečka se přichytává k osám, kde $\Phi = 0$ nebo $\Psi = 0$, a posuvníky a šipky na klávesnici s ní pohybují po jemnějších krocích.
- **Trail length** určuje, jak velká část dosavadní dráhy fotonu zůstává vykreslená. Délka stopy se měří afinním parametrem $\lambda$, který demu slouží jako hodiny.
- Šipka pod sféroidem ukazuje, kterým směrem se díra otáčí v rovině $a$. Otáčení díry v rovině $b$ je vidět jen na barvách, a proto šipka pro $b$ vede kolem barevné legendy.

Oblast na ovládací ploše má tvar konvexního kosočtverce se zakřivenými stranami a mimo ni žádná sférická orbita neexistuje. Její rohy jsou kruhové orbity v každé ze dvou rovin a její strany jsou orbity, které se drží na jedné rovnoběžce.

Boční panel vykresluje $\theta$, $\phi$ a $\psi$ v závislosti na $\lambda$ podél viditelné stopy. Barevný pruh pod $\psi$ ukazuje barvu stopy v každém okamžiku. $\phi$ a $\psi$ probíhají od $0$ do $2\pi$ a pak začínají znovu. Křivky jsou geodetiky, a proto zůstávají hladké i při průchodu osami: $\theta$ tam místo skoku pokračuje za $0$ nebo $\pi/2$.

Druhá záložka zobrazuje stopu na toru, s $\phi$ vodorovně a $\psi$ svisle, obojí od $0$ do $2\pi$. Každý kmit v šířce posune $\phi$ a $\psi$ o pevné počty otáček, které uvádí stavový řádek. Orbita se uzavře, jen když jsou oba racionální, a na toru je pak uzavřenou křivkou. Žádná jiná orbita se nikdy neopakuje: postupně vyplní celý čtverec a ve 3D celý pás šířek.
{{< /faq >}}

{{< faq "Co znamená „extremální“?" >}}
Černá díra dané hmotnosti se nemůže otáčet libovolně rychle. Rotující černá díra má dva horizonty: horizont událostí a uvnitř něj vnitřní horizont. Jak spin roste, horizonty se k sobě přibližují, a při nejrychlejší možné rotaci splynou. Taková černá díra je extremální. Kdyby se otáčela ještě rychleji, nebyl by tu žádný horizont, jen nahá singularita, a ta by podle hypotézy kosmické cenzury nikdy neměla vzniknout. Extremální černá díra je také studená: její Hawkingova teplota je nulová.

Kerrova černá díra o hmotnosti $M$ je extremální pro $a = M$, v jednotkách, kde $G = c = 1$. U Myersovy–Perryho černé díry s $\mu = 1$ to znamená $a + b = 1$ a oba horizonty se setkají při $r^2 = ab$. Má-li díra jen jeden spin, není tu žádný vnitřní horizont, se kterým by se horizont událostí mohl setkat, a když se $a$ blíží $1$, horizont událostí se zmenší do ztracena. Extremální díry v demu se proto otáčejí v obou rovinách. Jednu takovou ukazuje obr. 4.8 s $a = 0{,}9$ a $b = 0{,}1$.
{{< /faq >}}

{{< faq "Jak toto demo vzniklo?" >}}
**Výpočet.** Demo nesimuluje foton po malých krocích. Místo toho využívá pravidelnosti orbity. Sférická fotonová orbita se drží na pevném poloměru a každý kmit mezi jejími dvěma krajními šířkami je stejný jako ten předchozí, až na to, o kolik se foton mezitím pootočil v $\phi$ a $\psi$. Demo proto velmi přesně spočítá jediný kmit a celou dráhu z něj sestaví opakováním. Pohybové rovnice k tomu zapisuje v Minově čase, ve kterém se kmit v šířce oddělí od všeho ostatního, a přes jeden kmit integruje Simpsonovým pravidlem, přičemž ostré špičky u os ošetřuje přesně. Dráha je přesná zhruba na $10^{-7}$, ani u dlouhé stopy nedochází k žádnému driftu a přímá integrace úplných rovnic geodetiky s ní souhlasí. Tyto orbity jsou nestabilní, a tak demo stejně jako článek drží poloměr pevný a ukazuje ideální orbitu.

**Kód** je na [GitHubu](https://github.com/Mark-Bugden/photon-orbits-5d). Testy modelu v Pythonu ho porovnávají s článkem, se vzorci v uzavřeném tvaru a s přímou integrací a testy JavaScriptu přepočítávají výsledky modelu. 3D pohled je vykreslený pomocí [three.js](https://threejs.org/), ovládací plocha a boční panel na obyčejných canvasech.

**Programování s AI agentem:** Demo jsem vytvářel po etapách v Claude Code, programovacím agentovi společnosti Anthropic.

1. **Rešerše.** Agent prošel článek řádek po řádku, reprodukoval jeho obrázky a zmapoval už existující nástroje, mezi nimi i ten od Lea Steina.
2. **Plán,** ve kterém jsem vyřešil otázky návrhu, například barevný kruh, jak kreslit orbity procházející osami a jaké hodiny použít.
3. **Fyzika:** model v Pythonu a jeho testy a dokument, který uvádí každou rovnici přesně tak, jak je implementovaná, a který jsem prošel.
4. **Přepis do JavaScriptu,** jehož testy přepočítávají výsledky modelu v Pythonu.
5. **Rozhraní:** 3D pohled, pak ovládací plocha a předvolby, skriptem vyladěné podle obrázků v článku, a nakonec boční panel. Agent každou část vyzkoušel v headless prohlížeči, než jsem ji zkontroloval já.
{{< /faq >}}

## Literatura

- Bugden, M. (2018). [Spherical photon orbits around a 5D Myers-Perry black hole](https://doi.org/10.1007/s10714-018-2352-x). *General Relativity and Gravitation* 50. [arXiv:1801.03389](https://arxiv.org/abs/1801.03389).
- Myers, R. C. and Perry, M. J. (1986). Black holes in higher dimensional space-times. *Annals of Physics* 172, 304–347.
- Frolov, V. P. and Stojković, D. (2003). [Particle and light motion in a space-time of a five-dimensional rotating black hole](https://arxiv.org/abs/gr-qc/0301016). *Physical Review D* 68, 064011.
- Teo, E. (2003). [Spherical photon orbits around a Kerr black hole](https://physics.nus.edu.sg/wp-content/uploads/sites/5/2019/10/paper.pdf). *General Relativity and Gravitation* 35, 1909–1926.
{lang="en"}
