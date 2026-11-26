---
title: "Judging the Journey"
slug: soudai
date: 2026-11-17
demo: soudai
summary: "Predicting how long civil court cases in the Czech Republic take, from the histories of 208,227 cases."
description: "A model that forecasts when a civil case at a Czech district court will end, from its history so far, and the routes cases take from filing to a final decision."
---

{{< faq "What does the demo show?" >}}
The demo has two tabs.

**Forecast.** Pick a real past case, at random or by its court and case number, or describe one yourself: its court and its events so far. A model gives the chance that the case ends within 1, 3, 6 and 12 months. A case ends when its decision becomes legally final, which means it can no longer be appealed. For a real case, the demo also shows what happened next. "How well it does" scores the model against simpler methods, on cases it never saw.

**Process map.** The journey of a civil case from filing to a legally final decision: the stages cases pass through, the share of cases making each move, and the typical wait between stages. Pick a court to compare it with the whole country.

**Nothing here is legal advice.** The forecasts come from patterns in the records of past cases, and know nothing about the facts or the law of any case. The project makes no claims about why courts differ.
{{< /faq >}}

{{< faq "Where does the data come from?" >}}
**Case histories** come from [infosoud.gov.cz](https://infosoud.gov.cz/), the courts' public case-tracking service. For each case it lists the dates and types of its events, such as the filing, a hearing, a decision, an appeal, and the decision becoming legally final. Its records hold no names.

The scope is ordinary civil cases at first instance (the courts' register C) at all 86 district-level courts, registered from 2020 to 2025. That's 1,725,672 cases, counted exactly (see below). From them, 208,227 were drawn at random, 400 per court and year, and their histories fetched: 1,391,808 events in all. Each sampled case is weighted by how many registered cases it stands for, so every share and time in the demo is for all 1.7 million.

**Published decisions,** from [rozhodnuti.justice.cz](https://rozhodnuti.justice.cz/), the public database of anonymised court decisions, helped find each court's senates (see below). The judge's name, which that data includes, is dropped when it's read, and the decisions' full texts were never fetched.

**The Ministry of Justice's official statistics** were used as a check on the counts.

The case histories were fetched between 20 and 25 November 2026. The whole collection took about 320,000 requests, at no more than three a second, with every response cached.
{{< /faq >}}

{{< faq "How are the cases counted?" >}}
A court's judges work in senates: a judge or panel of judges, each with its own numbering. A case number such as 15 C 384/2022 is senate 15, register C, case 384 of 2022, and the numbers start again at 1 each year in each senate. So the highest number that exists in a senate and year is the number of cases it registered, and a binary search on infosoud finds it in about 13 requests.

The counts run 0.43–0.53% above the Ministry's official intake each year. They count every case entered in the register, which runs slightly above the official figure.

A case's number gives the year it was registered. For about one case in five, that's the year after it was filed. That fits cases that began as electronic payment orders and moved to the civil register, but it's inferred, not checked. Times in the demo run from the filing date.
{{< /faq >}}

{{< faq "What does a case's journey look like?" >}}
Each case's history is read as a path through seven stages: filed, hearing, decided, appeal, revived (a decision cancelled and the case reopened), suspended, and legally final.

Two routes cover 87% of cases: filed → hearing → decided → legally final (71.8%), and the same with no hearing (15.6%). In 90% of cases, the first decision is on the day of the first hearing.

Across all courts, half of cases have a decision within 149 days of filing, and half are legally final within 184 days. After a year, 9.7% are still undecided, and 13.1% aren't yet legally final.

Cases still open when their records were fetched count for as long as they're known to have waited. Leaving them out would make the waits look shorter. The methods are Kaplan–Meier, and Aalen–Johansen where a stage has several ways out.

Courts differ a lot. The median time to a decision runs from 92 days (Jeseník) to 238 days (Prague 1 and Litoměřice). They also differ in what their records show: Hradec Králové records a hearing in 22% of cases, against 80% nationally. Whether that's practice or record-keeping isn't known.
{{< /faq >}}

{{< faq "How does the forecast work?" >}}
The model reads a case's events one at a time, in order: each event's type, the days since the one before, and the days since filing. A recurrent neural network (a GRU) keeps a running summary of the case as it reads. At the moment of the forecast, it adds the court and the time since the last event, and gives the chance that the case ends in each of the next 36 months, if it hasn't ended before. The chances it ends within 1, 3, 6 and 12 months follow from those.

The demo averages five such networks, trained the same way from different random starts. Each has 7,228 weights, few enough that the demo computes every forecast in the browser.

**Training.** The networks learned from the cases registered in 2020–2023, as their records stood on 31 December 2023: anything later was hidden from them. Cases still open on that day count for as long as they were known to be open. Cases have got faster over the years, so recent examples count for more: an example's weight halves for every year before 2024.

**Testing.** The scores below are on the 69,336 sampled cases registered in 2024–2025, followed to November 2026. So they're the scores of a model built on 1 January 2024 and used on the cases that came after.
{{< /faq >}}

{{< faq "How well does it do?" >}}
Every method was trained and scored the same way, forecasting each test case at filing, and 1, 3, 6 and 12 months in.

- **Concordance:** given two cases, how often the method expects the right one to end first. 0.5 is a coin toss, and higher is better.
- **Brier score:** the average squared gap between the forecast chance and what happened (1 if the case ended within the time, 0 if not). 0 is perfect, and always saying 50% scores 0.25.

The hand-made features are the court, the stage the case is in and how long it has been there, the time since filing and since the last event, the number of hearings, and whether the case has been decided, appealed or revived.

| Method | Concordance | Brier score, 6 months |
| --- | --- | --- |
| Court average: the court's typical time from filing | 0.606 | 0.199 |
| Process map: the court, the case's stage and how long it has been in it | 0.640 | 0.192 |
| Cox model on the hand-made features | 0.607 | 0.199 |
| Gradient-boosted trees on the hand-made features | 0.643 | 0.189 |
| The same network, on the hand-made features | 0.640 | 0.190 |
| The five GRU networks, reading the events | 0.647 | 0.189 |

The networks rank cases best, and forecast best 1 and 3 months ahead. But they don't clearly beat the gradient-boosted trees: 6 months ahead the two are the same, and 12 and 24 months ahead the trees are slightly better. What helps is reading the sequence of events, since the same network fed the hand-made features does worse than the trees.

At filing, a case is only its court, and no method does better than the court's average.
{{< /faq >}}

{{< faq "What are the limits?" >}}
- **Cases have got faster.** The share not finished 6 months after filing fell from 55% for cases registered in 2020–2021 to 43% in 2025. The model learned from the earlier years, so where it gives under a 60% chance of ending within 6 months, 3 to 8 points more cases end than it says.
- **Courts' records differ,** so a court's forecasts reflect its record-keeping as well as its pace.
- **infosoud keeps only a case's latest disposal date,** so when a reopened case is decided again, the date of its first decision is lost.
- **2.2% of cases were still open** when their records were fetched. They count as still waiting, not dropped.
- **infosoud's interface is undocumented** and can change.
{{< /faq >}}

{{< faq "How was this demo made?" >}}
**The code** is on [GitHub](https://github.com/Mark-Bugden/soudai), under the MIT License. A Python pipeline fetches the records, counts the cases, computes the journeys, and trains and scores the models: PyTorch for the networks, LightGBM for the trees and lifelines for the Cox model. The demo runs the networks again in JavaScript, and its tests check that its forecasts match PyTorch's. The charts are drawn by hand in SVG.
{{< /faq >}}

Case histories from [infosoud.gov.cz](https://infosoud.gov.cz/), and published decisions from [rozhodnuti.justice.cz](https://rozhodnuti.justice.cz/). Official statistics: Ministerstvo spravedlnosti ČR, InfoData.
