---
# The body translates the English write-up in zombie-outbreak.md, which stays the source of truth:
# a change there needs the same change here. tagline and tags replace the manifest's.
demo: zombie-outbreak
tagline: "Simulace šíření zombie nákazy po celé České republice."
tags: ["matematické modelování", "PDR", "epidemiologie"]
description: "Simulace šíření zombie nákazy na skutečné mapě zalidnění České republiky: model SZR (lidé, zombie, odstranění) v každém čtverečním kilometru, přičemž lidé se přesouvají mezi sousedními buňkami."
---

{{< faq "Co je to za demo?" >}}
Kdykoli vidím film o zombie, říkám si, jak je nerealistický: zombie ovládnou města za den nebo dva a zbytek světa krátce nato. Zombie nákazy se matematicky modelovaly už dřív (první odborný článek, který jsem kdy četl, byl právě o zombie nákaze), ale většina modelů pracuje s celou populací najednou, takže z nich není vidět, jak se zombie šíří po celé zemi. Chtěl jsem vidět, jak by šíření nákazy vypadalo v zemi, kde jsem žil.

Demo ukazuje zombie nákazu na mapě zalidnění České republiky, kde jeden pixel odpovídá jednomu čtverečnímu kilometru. První týden si nákazy nikdo nevšimne. Blokády můžete plánovat od začátku klikáním na jednotlivé kraje, ale stavět se začne až 7. den, a i pak je k dispozici jen jedna stavební četa, která nestaví lusknutím prstů. Na pozadí běží stejná nákaza bez karantény, a díky tomu demo ví, kolik lidí vaše karanténa zachránila. Počítá také lidi, které jste zavřeli: všechny v oblasti, kterou jste odřízli od zbytku země, uvězněné tam spolu se zombie. Vy zrůdo.
{{< /faq >}}

{{< faq "Jak se modeluje zombie nákaza?" >}}
Průběh nákazy se řídí modelem SZR (lidé, zombie, odstranění), který navrhli Munz, Hudea, Imad a Smith? (2009). Lidé ($S$) jsou pokousáni a mění se v zombie ($Z$). Lidé se mohou bránit a zombie zneškodnit, čímž je přesunou mezi odstraněné ($R$). Jak už to ve filmech bývá, zombie, která padne, nemusí zůstat ležet: odstranění mohou znovu povstat jako zombie. Článek počítá také s narozeními a přirozenými úmrtími, ale demo trvá jen rok, takže je vynechávám.

V článku je populace dokonale promíchaná: každý se může setkat s každým. V každém čtverečním kilometru běží stejný model a lidé se přesouvají mezi sousedními čtverci. Model popisují tyto rovnice:

$$
\frac{\partial S}{\partial t} = -\beta S Z + \nabla \cdot (\chi S \, \nabla z)
$$

Lidé jsou pokousáni a prchají před zombie.
{.equation-note}

$$
\frac{\partial Z}{\partial t} = \beta S Z - \alpha S Z + \zeta R + D \, \Delta Z
$$

Zombie koušou, jsou zneškodňovány, povstávají a bloudí.
{.equation-note}

$$
\frac{\partial R}{\partial t} = \alpha S Z - \zeta R
$$

Zneškodněné zombie jsou odstraněny a mohou znovu povstat.
{.equation-note}

Parametry $\chi$ a $D$ popisují pohyb obyvatel: $D$ udává, jak rychle zombie náhodně bloudí, a $\chi$, jak rychle lidé prchají do sousedních čtverců, kde zombie tvoří menší podíl všech přítomných. Tento podíl je $z = Z / (S + Z)$, tedy jakou část všech ve čtverci tvoří zombie. Zbylé tři parametry pocházejí z článku: $\beta$, $\alpha$ a $\zeta$ udávají, jak rychle zombie koušou, jsou zneškodňovány a znovu povstávají.

Pro parametry modelu jsem připravil několik předvoleb v podobě čtyř kmenů: *Munz et al. (2009)* používá rychlosti přímo z článku, *Shamblers* jsou pomalejší, *Frenzied* rychlejší a *Risers* prohrávají většinu soubojů, ale rychle znovu povstávají.
{{< /faq >}}

{{< faq "Odkud pocházejí data?" >}}
Data o obyvatelstvu pocházejí z odhadu WorldPop pro Českou republiku k roku 2020, upraveného tak, aby celkový počet obyvatel odpovídal údaji OSN. Síť WorldPop je vymezená úhly, ne vzdálenostmi: každá buňka má 30 úhlových vteřin zeměpisné šířky na 30 úhlových vteřin zeměpisné délky. Poledníky se směrem od rovníku sbíhají, takže kolem 50° s. š., kde leží Česká republika, měří buňka od severu k jihu asi 0,93 km, ale od východu k západu jen 0,60 km. Každá buňka tedy pokrývá asi 0,55 km², ne celý čtvereční kilometr. Kdyby se každá buňka přesto brala jako čtvereční kilometr, napočítalo by se 19,3 milionu lidí místo 10,75 milionu a mapa by vyšla roztažená do šířky. Tomu se demo vyhýbá tak, že data převzorkuje na plochojevnou síť čtverců o straně 1 km (ETRS89-LAEA), která obyvatelstvo nezkresluje. Hranice krajů a státní hranice pocházejí z Natural Earth.
{{< /faq >}}

{{< faq "Dokáže karanténa nákazu zastavit?" >}}
To musíte zjistit sami. Vyzkoušejte různé kmeny a najděte optimální strategii, jak stavět blokády. Můžete také otevřít nabídku *Advanced* a parametry nastavit ručně, nebo si nakreslit vlastní blokády.
{{< /faq >}}

{{< faq "Je to realistický model?" >}}
Já vím, já vím, zombie neexistují.

Ale předpokládejme na chvíli, že existují. Jaká má model omezení a v čem se liší od toho, co by se doopravdy stalo?

- Lidé cestují. V modelu zombie bloudí jen do sousedních čtverců a lidé prchají jen o čtverec vedle, ale skutečná nákaza by mohla autem nebo vlakem přeskočit z Prahy do Brna za jedno odpoledne. Z velké části právě proto mohou blokády v demu vůbec fungovat.
- Ve skutečném davu počet lidí, které člověk může potkat, od určitého bodu přestane růst. V modelu počet kousnutí s hustotou zalidnění čtverce stále roste.
- Nikdo nezměřil, jak rychle zombie koušou nebo jak často jsou zneškodněny, takže hodnoty rychlostí jsou jen ilustrativní. Totéž platí pro den odhalení nákazy a rychlost čety: byly zvoleny tak, aby karanténa mohla fungovat, ale musela být rychlá.
- Ve skutečných epidemiích hraje roli náhoda, ale model je deterministický, takže stejný plán dá vždy stejný výsledek.
- Skuteční lidé by dělali víc, než jen utíkali. V modelu se nikdo neschovává, neevakuuje ani neorganizuje a nikdo se v boji se zombie nezlepšuje.
- Skutečné blokády jsou děravé a skutečné hranice fungují oběma směry. V demu dokončenou blokádou nic neprojde, zombie, které překročí státní hranici, z modelu odejdou a lidé Českou republiku nikdy neopustí.
{{< /faq >}}

{{< faq "Jak toto demo vzniklo?" >}}
**Kód** je na [GitHubu](https://github.com/Mark-Bugden/zombie-outbreak). Pipeline v Pythonu převádí data o obyvatelstvu na kilometrovou síť a průběh nákazy simuluje referenční model v NumPy. Demo ho v JavaScriptu spouští znovu, ve web workeru, a testy dema ověřují, že se obě verze přesně shodují. Mapa a graf jsou vykreslené na obyčejných canvasech.

**Programování s AI agentem:** Demo jsem vytvářel po etapách v Claude Code, programovacím agentovi společnosti Anthropic.

1. **Rešerše.** Agent prošel mé původní notebooky z roku 2023, ve kterých běžel model SIR s migrací na mapě zalidnění Německa.
2. **Plán,** ve kterém jsem vyřešil otázky návrhu, například že se nákaza odhalí až po týdnu, že všechny blokády staví jediná četa a že souběžně poběží stejná nákaza bez karantény, aby šlo spočítat zachráněné.
3. **Data:** obyvatelstvo převedené na plochojevnou kilometrovou síť a zkontrolované podle celkového počtu obyvatel státu, oficiálních počtů obyvatel krajů a polohy měst.
4. **Model:** referenční model v NumPy a jeho testy, pak přepis do JavaScriptu, jehož testy přepočítávají výsledky referenčního modelu.
5. **Karanténa:** blokády, uzavírání krajů a četa, pak simulace bez karantény a souhrn. Kmeny, den odhalení nákazy a rychlost čety jsme spolu ladili na celé mapě, podle zkušebních simulací, které agent spustil.
6. **Doladění** podle mých poznámek k demu na webu: graf jako časová osa, méně ovládacích prvků, „blockade“ místo „cordon“, barva pro mrtvé a demo, které se vejde do okna.
{{< /faq >}}

## Zdroje

- Munz, P., Hudea, I., Imad, J. and Smith?, R. J. (2009). [When zombies attack!: Mathematical modelling of an outbreak of zombie infection](https://loe.org/images/content/091023/Zombie%20Publication.pdf). In *Infectious Disease Modelling Research Progress*, pp. 133–150. Nova Science.
- Population: [WorldPop](https://dx.doi.org/10.5258/SOTON/WP00675), Czech Republic 2020, UN-adjusted, 1 km ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). WorldPop (www.worldpop.org - School of Geography and Environmental Science, University of Southampton; Department of Geography and Geosciences, University of Louisville; Departement de Geographie, Universite de Namur) and Center for International Earth Science Information Network (CIESIN), Columbia University (2018). Global High Resolution Population Denominators Project - Funded by The Bill and Melinda Gates Foundation (OPP1134076).
- Borders: [Natural Earth](https://www.naturalearthdata.com/), 1:10m (public domain).
{lang="en"}
