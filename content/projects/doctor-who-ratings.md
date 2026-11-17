---
title: "Directing the Doctor"
slug: doctor-who-ratings
date: 2025-05-17
demo: doctor-who-ratings
summary: "Who is the best Doctor? An analysis of IMDb ratings for every Doctor Who episode from 1963 on."
description: "Who is the best Doctor? IMDb ratings for every Doctor Who episode since 1963: the best and worst episodes, writers and directors, and each Doctor."
draft: true
aliases: ["/portfolio/doctorwho.html"]
---

<!-- 
TODO(mark): rewrite. This is the old blog post from portfolio/doctorwho.html (May 2025), migrated as the starting draft.
TODO(mark): confirm you may use the banner (it imitates the show's logo) and the photo of David Tennant (it looks like a BBC promotional still); remove them if not.
 -->

{{< figure src="images/doctor-who/banner.png" alt="Banner: the words Doctor Who over a nebula, subtitled Television Analysis and Ratings Derived from IMDb Statistics." eager="true" >}}

## Introduction

Doctor Who is a long-running television show, with a devoted fanbase spanning generations. Each incarnation of the Doctor has their own loyal following, and the fans inevitably debate which version of the Doctor stands out as the best. Rather than weighing in with my own personal opinions, I decided to take a more data-oriented approach to finally answer the question:

Who is the best Doctor?
{.callout}

In addition to this question, we will be looking at the best and worst episodes, how the episodes have changed over time and which are the best writers and directors. In the associated notebook, we also took a deep-dive into what factors drive episode quality, by calculating how much of the variation of the ratings could be explained by the Doctor, as opposed to the writers and directors. The results were actually quite interesting, so if you are interested you can check them out in the [GitHub repository](https://github.com/Mark-Bugden/doctor-who-ratings).

## Dataset overview

This analysis uses IMDb user ratings for Doctor Who episodes from 1963 to the present day. Each episode entry includes:

- Title
- Year
- Season and episode number
- IMDb rating (1-10 scale)
- Number of votes
- Doctor
- Writer(s)
- Director(s)

The dataset covers a total of **863 episodes** over **41 seasons**.

Specials, including Christmas and regeneration episodes, are currently not included in the analysis. Each episode is associated with the lead actor playing the Doctor at the time, enabling comparisons across different actors and eras.

Data was scraped and collated from IMDb using a custom Python script and manually cleaned to ensure consistency across metadata fields such as episode names and numbering.

**A note on IMDb and the Gatwa era:** IMDb categorises Doctor Who seasons into three categories: the classical series (1963 - 1989), the modern series (2005 - 2022), and the Gatwa era (2023 - present). This blog post and notebook were written during the release window of Season 15, and therefore do not contain all statistics from those episodes.

## Best and worst episodes

Let's start with the simplest way to view the data - by looking at the best and worst episodes, as rated by the IMDb users. Starting with the best:

{{< table caption="Top-rated episodes of Doctor Who" >}}
| Era | Season | Episode | Title | Doctor | Rating | Votes |
| --- | ---: | ---: | --- | --- | ---: | ---: |
| modern | 3 | 10 | Blink | David Tennant | 9.8 | 25531 |
| modern | 9 | 11 | Heaven Sent | Peter Capaldi | 9.6 | 13853 |
| modern | 4 | 9 | Forest of the Dead | David Tennant | 9.4 | 12017 |
| modern | 5 | 10 | Vincent and the Doctor | Matt Smith | 9.3 | 13773 |
| modern | 4 | 8 | Silence in the Library | David Tennant | 9.3 | 11727 |
| modern | 2 | 4 | The Girl in the Fireplace | David Tennant | 9.2 | 13738 |
| modern | 2 | 13 | Doomsday | David Tennant | 9.2 | 11179 |
| modern | 3 | 9 | The Family of Blood | David Tennant | 9.2 | 10824 |
| modern | 4 | 13 | Journey's End | David Tennant | 9.2 | 10403 |
| modern | 4 | 10 | Midnight | David Tennant | 9.1 | 11060 |
{{< /table >}}

I don't think many people are really surprised to see **Blink** at the top. It's a bit of an odd one - the Doctor is barely even in the episode - but it's become a fan favourite for a reason. It is noteworthy that David Tennant is the Doctor for 8 out of the 10 best-rated episodes.

What about the worst-rated episodes?

{{< table caption="Lowest-rated episodes of Doctor Who" >}}
| Era | Season | Episode | Title | Doctor | Rating | Votes |
| --- | ---: | ---: | --- | --- | ---: | ---: |
| modern | 12 | 3 | Orphan 55 | Jodie Whittaker | 4.2 | 7205 |
| classical | 6 | 34 | The Space Pirates: Episode 6 | Patrick Troughton | 4.7 | 323 |
| classical | 6 | 33 | The Space Pirates: Episode 5 | Patrick Troughton | 4.9 | 319 |
| classical | 6 | 31 | The Space Pirates: Episode 3 | Patrick Troughton | 5.0 | 321 |
| classical | 6 | 32 | The Space Pirates: Episode 4 | Patrick Troughton | 5.0 | 319 |
| modern | 14 | 1 | Space Babies | Ncuti Gatwa | 5.1 | 9141 |
| modern | 11 | 4 | Arachnids in the UK | Jodie Whittaker | 5.1 | 8741 |
| modern | 11 | 5 | The Tsuranga Conundrum | Jodie Whittaker | 5.1 | 8162 |
| modern | 12 | 10 | The Timeless Children | Jodie Whittaker | 5.1 | 6814 |
| classical | 6 | 29 | The Space Pirates: Episode 1 | Patrick Troughton | 5.1 | 342 |
{{< /table >}}

It seems as though the Space Pirates episodes of Patrick Troughton were particularly disliked, but the low ratings here is more complicated than it might initially seem. It turns out that only Episode 2 exists in full - the other episodes are missing from the archives, which means that watching the full serial would require using reconstructions (tele-snaps and audio), which is likely what contributes to the poor ratings. All that being said, Episode 2 only received a rating of 5.6, so it's safe to say that people weren't particularly fond of the Space Pirates in any case.

It's clear in the tables above that episodes from the modern series get more votes than episodes from the classical series. This is likely due to a larger and younger audience, who are more inclined to visit IMDb and cast votes. On average, modern-era episodes receive more than ten times as many votes as classical-era episodes. This means we can be less confident in the reliability of the classical ratings compared to those from the modern era.

## Ratings over time

IMDb ratings offer a broad measure of how audiences responded to each episode of *Doctor Who*. By plotting ratings against air dates, we can observe trends across the show's history, from the early black-and-white serials to the modern era.

The chart below shows all rated episodes from 1963 to the present. Each dot represents a single episode, and are coloured based on who the Doctor was for that episode. Additionally, the size of the dot is indicative of how many votes that episode received - bigger dots have more votes.

{{< figure src="images/doctor-who/ratings_over_time.png" alt="Scatter plot of IMDb rating against year for every Doctor Who episode from 1963 to 2025, one dot per episode, coloured by Doctor and sized by number of votes." >}}

**Key observations:**

- Ratings during the classic era (1963-1989) are highly variable, with scattered peaks and valleys.
- There is a noticeable increase in average ratings following the 2005 reboot.
- Ratings trend downward in the later seasons of the modern era, especially post-2017.

Plotting the average rating per year gives us a nice concise way to see the "big picture" trends.

{{< figure src="images/doctor-who/mean_ratings_over_time.png" alt="Line chart of the mean IMDb rating per year, coloured by Doctor: about 7 to 8 through the classic era, around 8 after 2005, a dip to about 6 around 2018 to 2020, then a recovery." >}}

We can also look at how episodes were rated across each season. The heatmaps below show the distribution of ratings for each episode within a season for both the classical and modern eras, making it easier to spot patterns and get more refined information about how each episode is rated *within* a given season.

{{< figure src="images/doctor-who/classical_ratings_heatmap.png" alt="Heatmap of IMDb ratings by season (1 to 26) and episode for the classic era. Season 6's Space Pirates episodes stand out in blue, for low ratings, and season 12 in red, for high ones." >}}

From this heatmap we can immediately see a few notable features, such as the Space Pirates serial of Season 6, or the popular "Genesis of the Daleks" arc in Season 12. It's worth noting that in the classical era of Doctor Who, the episodes were structured as *serialised stories*. Each story was made up of shorter episodes, collected into a single arc of up to 12 episodes (although 4-6 was most common). We can see this structure clearly in the data - the ratings for an episode in a single story tend to be similar to the ratings of other episodes in that story, forming the similarly coloured groups in the above heatmap.

{{< figure src="images/doctor-who/modern_ratings_heatmap.png" alt="Heatmap of IMDb ratings by season (1 to 13) and episode for the modern era. Seasons 11 to 13 are noticeably bluer, meaning lower rated, than seasons 1 to 10." >}}

Unlike the classical era, in the modern era most episodes are self-contained, standalone episodes with a longer format. Although linked episodes do exist in the modern era, they are titled differently and much less common.

*Note:* The Gatwa era is not included in the heatmaps due to the limited number of rated episodes available so far.

## Best writers and directors

Before turning to the Doctors themselves, it's worth looking at the people who helped shape their stories. Writers and directors have a huge impact on the tone, pacing, and emotional weight of each episode.

To evaluate writers and directors, I used a **shrinkage-adjusted average**, which helps avoid overrating people who only worked on a handful of episodes. (I'll explain how this works in more detail when we get to the Doctors.) The top five writers and directors are shown in the tables below:

{{< table caption="Top-rated writers" >}}
| Writer | Shrinkage rating | Episodes |
| --- | ---: | ---: |
| Paul Cornell | 8.08 | 3 |
| Steven Moffat | 8.07 | 83 |
| Terry Nation | 8.05 | 90 |
| Malcolm Hulke | 8.05 | 57 |
| Robert Banks Stewart | 7.97 | 12 |
{{< /table >}}

{{< table caption="Top-rated directors" >}}
| Director | Shrinkage rating | Episodes |
| --- | ---: | ---: |
| Rachel Talalay | 8.32 | 6 |
| Hettie Macdonald | 8.26 | 3 |
| Graeme Harper | 8.24 | 18 |
| Toby Haynes | 8.21 | 4 |
| David Maloney | 8.03 | 46 |
{{< /table >}}

**Key observations:**

- Both classic and modern-era contributors appear in the top ranks, suggesting that high-quality episodes span the show's entire history.
- Writer-director combinations likely play a crucial role in episode success, with names like Moffat, Macdonald, and Talalay frequently associated with fan-favourite stories.

Of course, even the best writing and direction needs a strong lead. Now that we've looked at the creative forces behind the scenes, it's time to turn to the face of the show itself: the Doctor.

## Best Doctor

We've had some hints as to which Doctor may be the best, but now it's time to finally settle it. To quantitatively determine which Doctor has the best ratings from fans, I decided to calculate several different metrics. The first and most obvious is the **naïve average** rating per Doctor across all of their episodes. Although this gives an idea of how positively that Doctor's episodes were rated, it doesn't account for vote volume or episode count. The **vote-weighted average** improves on this by giving more influence to episodes with more IMDb votes. Instead of treating each episode equally, it reflects how viewers collectively rated a Doctor's run - factoring in which episodes had the most engagement. However, even vote-weighted ratings can be skewed if a Doctor appeared in only a few episodes. To address this, we compute a **shrinkage-adjusted average**, which regularizes the vote-weighted average based on how many episodes each Doctor appeared in, pulling averages for small-sample examples closer to the global average. (We used this to calculate which were the best writers and directors in the previous section.)

Together, these three metrics provide a fairer and more robust way to compare how each Doctor's episodes were received. That said, as we'll see, the differences between them are relatively small - suggesting a reassuring consistency across the various approaches. The chart below shows how each Doctor scored across all three metrics. While the rankings are close, a clear frontrunner does emerge.

{{< figure src="images/doctor-who/doctor_comparisons.png" alt="Horizontal bar chart of the average, vote-weighted and shrinkage-adjusted IMDb rating for each of the 13 Doctors. David Tennant scores highest on all three." >}}

And the winner is...

David Tennant
{.callout}

{{< figure src="images/doctor-who/david_tennant.png" alt="David Tennant as the Doctor, stepping out of the TARDIS." caption="David Tennant as the Tenth Doctor: consistently a fan favourite." size="small" >}}

Across all three rating metrics, Tennant consistently comes out on top, combining high ratings, strong audience engagement, and a substantial number of episodes.

So there it is - the data has spoken. David Tennant takes the crown. Of course, stats don't tell the whole story - but they are very useful the next time you are at a house party and you need to prove to someone why David Tennant is the best Doctor.
