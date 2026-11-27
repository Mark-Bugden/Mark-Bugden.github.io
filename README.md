# mark-bugden.com

Mark Bugden's personal site, at [mark-bugden.com](https://mark-bugden.com/): projects with interactive demos, background and publications, in English, Czech and German. It is built with Hugo. Each demo is a bundle that its own project repo publishes on a GitHub release, and the site fetches each project's latest release.

## Run it locally

You need Node 20 or later, the GitHub CLI signed in (`gh auth login`) and, on Windows, Git Bash. `scripts/install-tools.sh` puts the Hugo extended and lychee versions that CI uses into `.tools/`.

```sh
git clone https://github.com/Mark-Bugden/Mark-Bugden.github.io.git && cd Mark-Bugden.github.io
git config core.hooksPath .githooks   # check before every push (see below)
scripts/install-tools.sh && export PATH="$PWD/.tools:$PATH"
scripts/fetch-demos.sh
hugo server -D        # http://localhost:1313, draft write-ups included
```

### Check before you push

`scripts/check.sh` runs the checks that decide whether CI passes. It does four things:

- installs the pinned tools
- fetches and validates every bundle
- builds the site as production does
- checks the site's own links

The pages workflow runs the same script, so a branch that passes it here passes there.

The pre-push hook in `.githooks/` runs it before every push, once `core.hooksPath` is set as above. The script builds the working tree, so the hook stops a push that has uncommitted changes or isn't of the checked-out branch.

## How it fits together

- **Demos.** [`data/projects.yaml`](data/projects.yaml) lists each demo's slug, repo and title. The title is the project's name, and the site takes it from there alone, so to rename a project, change it there. The demo's manifest, in the project repo, has a title of its own, which screen readers hear as the name of a canvas demo. Projects are listed in alphabetical order of their titles, unless an entry has an `order`. [`scripts/fetch-demos.sh`](scripts/fetch-demos.sh) does the following for each one:
  - downloads `demo-<slug>.zip` from the repo's latest release, or from the release in the entry's `tag`, if it has one
  - validates it with the demo-kit version it was built with (`kitVersion` in its manifest)
  - unpacks it into `static/demos/<slug>/`, which is gitignored

  The bundle contract is in the [demo-kit README](https://github.com/Mark-Bugden/demo-kit#readme).
- **Write-ups** live in `content/projects/<slug>.md`, with `demo: <slug>` in the front matter. A project page has two tabs, or three: Demo, which holds only the demo; More info (`#more-info`), which holds the tagline and the write-up, and ends with the build date and a link to the source; and, when the manifest has a `modelCard`, Model card (`#model-card`). The card shows the fields of `modelCard` that are there, in this order: `what` (required), `use`, `architecture`, `parameters`, `training`, `data`, `metric`, `comparison` (a table: `columns`, `rows`, and optionally `groups` of columns under one heading and a `note`), `limits` and `version`. A project is listed only when two things are true:
  - its manifest status is `in-progress` or `live`
  - its write-up is not a draft

  The build fails if a published write-up's bundle is missing, is still a stub, or disagrees with `data/projects.yaml`.
- **The home page** shows only the selected projects, those with `home: true` in `data/projects.yaml`. Screens at least 48rem wide and 37.5rem tall get a scroll sequence instead of an ordinary page, unless the visitor prefers reduced motion:
  - Scrolling moves an animation, never the page.
  - The name gives way to the heading "Selected projects". The phase portrait's dots form a picture of each selected project in turn, beside its card. At the end, the footer fades in.
  - The code is in [`assets/js/phase-flow.js`](assets/js/phase-flow.js). The pictures are in [`assets/js/project-shapes.js`](assets/js/project-shapes.js), keyed by slug.
  - A new selected project needs a picture there. Until it has one, its dots just spread out.
- **Styles** are all in [`assets/css/site.css`](assets/css/site.css). Its design tokens on `:root` hold every colour and typeface: dark, and light only when the visitor picks it with the header button. Demos keep the kit's own tokens on `[data-demo]`. The fonts (Space Grotesk, Inter and JetBrains Mono) are self-hosted in `static/fonts/`, each in a Latin and a Latin Extended file. Browsers fetch the Latin Extended files only for text that needs them, such as Czech.
- **Maths** in a write-up is LaTeX: `$…$` inline, and `$$…$$` on lines of its own for a displayed equation. Hugo's built-in KaTeX typesets it when the site builds, so the page runs no script for it, and a LaTeX error fails the build. Pages with maths also load [`assets/css/katex.css`](assets/css/katex.css), with fonts from `static/fonts/katex/`. These come from the KaTeX version inside the pinned Hugo, so update them when Hugo's KaTeX changes.
  - KaTeX never breaks a displayed equation over lines, so each must fit 320px, the column on a 360px phone. Narrower columns shrink it to fit.
  - For a note under an equation, put a paragraph after it, with `{.equation-note}` on the line below the paragraph.
- **Deploys.** [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every pull request and every push to `main`. It also runs when a project releases a demo, and once a day. It runs `scripts/check.sh`, which fetches and validates the bundles, builds with `hugo --minify --panicOnWarning`, and checks the site's own links. Then it checks external links too, but only reports the ones that fail, under a warning in the run's summary, so another site's outage never fails a run or holds back a deploy. On `main` it then deploys to GitHub Pages. Stub bundles are validated but not deployed.
- **The domain.** GitHub Pages serves the site at `mark-bugden.com`, and redirects `mark-bugden.github.io` and `www.mark-bugden.com` there. The domain is set in the repo's Settings → Pages, not in a `CNAME` file, which GitHub ignores when a site deploys from Actions. Its DNS records are at Name.com. Leave the MX and TXT records there alone: they carry the email.

## How a change goes live

Each change is one PR, and merging it puts it live.

- **A demo change** is a PR in the project repo. It bumps `version` in `demo/package.json`; its CI fails if the demo changed and that version is already released. When it merges, the project's Demo workflow does the following:
  - builds the bundle and sets the manifest's `built` to that day
  - releases it as `v<version>`
  - starts this site's Pages workflow, which deploys it a few minutes later
- **A demo-kit change** is a PR in demo-kit that bumps its version. Merging it tags the release. A demo moves to it in its own PR, by bumping the kit's tag in its `demo/package.json`. The site needs no change.
- **A site change** (layout, text, a write-up) is a PR here.

To roll a demo back, set `tag:` on its entry in `data/projects.yaml` to the release to hold it at. Remove the line once a fixed release is out.

A project starts this site's Pages workflow with its `SITE_DEPLOY_TOKEN` secret. This is a fine-grained personal access token with access to this repo only, and one permission: Actions, read and write. Without it, or once it expires, a release goes live at the next daily run instead. To set it in every project repo:

```sh
read -rsp "Token: " token; echo
for repo in zombie-outbreak doctor-who-ratings soudai lol-win-prediction photon-orbits-5d; do
  gh secret set SITE_DEPLOY_TOKEN --repo "Mark-Bugden/$repo" --body "$token"
done
```

## Languages

English is at the root (`/about/`), Czech is under `/cs/` and German is under `/de/`. The language menu in the header links each language's version of the current page. If a page has no version in that language, the link goes to the nearest page above it that does. The menu shows Czech as "CZ", but its language tag and URL use `cs`, the code for the Czech language.

Where each kind of text lives:

- **Interface text** (nav, headings, labels, alt text, the date format) is in [`i18n/`](i18n/), with the same keys in `en.toml`, `cs.toml` and `de.toml`. Templates use `{{ i18n "key" }}` and never hard-code visible text.
- **Page text** is in `content/<page>.cs.md` and `content/<page>.de.md`, next to the English `content/<page>.md`. Hugo pairs them by file name.
- **The role lines and site description** are under `[languages.<lang>.params]` in [`hugo.toml`](hugo.toml).
- **The timeline:** each entry in [`data/timeline.yaml`](data/timeline.yaml) has `cs` and `de` maps. Any field they leave out is shown in English.
- **Project names** stay in English in every language, marked `lang="en"`. Each is the project's `title` in [`data/projects.yaml`](data/projects.yaml), and the build fails if a write-up sets a `title` of its own.
- **Project write-ups and demos** are in English only for now.
  - `content/projects/<slug>.cs.md` and `.de.md` hold only front matter: a translated `description`, `tagline` and `tags`. The tagline and tags replace the manifest's English ones.
  - With no body, these pages show the English write-up and demo, marked `lang="en"`, under a note saying they are in English. Adding a body replaces the English write-up.
  - The English write-up is the source of truth. A Czech or German page is listed only while its English page is published, and the build fails if one exists without the other.
- **Publication titles and venues** stay in English, since they are the papers' own.

When you change text:

- Change English, Czech and German in the same PR. A field missing from `cs.toml` or `de.toml` silently falls back to English.
- Translations are drafted, then cross-checked by a reviewer on a different model before they go in. That's how the first Czech and German text was written.
- Mark English text on a Czech or German page with `lang="en"`.
- Link to pages with `relLangURL`, so the link stays in the page's language. Link to static files (`demos/`, `fonts/`, images) with `relURL`.
- GitHub Pages serves the English `/404.html` for every missing URL. The Czech and German 404 pages are built, but never shown.

## Publish a project

1. In the project repo, set the manifest's `status` to `in-progress` or `live`, in a PR that bumps the demo's version. Merging it releases the demo.
2. Remove `draft: true` from `content/projects/<slug>.md`.
3. Add `content/projects/<slug>.cs.md` and `.de.md` with a translated description, tagline and tags; copy an existing pair. Until they exist, the Czech and German Projects pages show the English card.

## Other tasks

- **See what's happening in every repo:** run `scripts/status.sh`. For this repo, demo-kit and each project, it lists the latest release, the open PRs, the PRs merged in the last day, and the branches with commits that aren't in main. Each branch is shown with its PR, if it has one. A branch whose PR has merged is often just a leftover. Then come the open issues, each with its status on the project board (unless that's Todo) and the PRs that will close it.
- **Redraw the mark:** run `python scripts/hopf-mark.py`. It draws four fibres of the Hopf fibration and writes the header SVG and `static/favicon.svg`.
- **Preview accent colours:** under `hugo server`, an Accent button at the bottom right of every page opens a panel of colour pairs (dark and light theme) with their contrast. It is left out of production builds.
- **Redraw the home page figure:** run `python scripts/phase-portrait.py`. It draws the phase portrait of a simple pendulum and writes `layouts/partials/phase-portrait.html`.

## Licence

The code is [MIT](LICENSE). The site's content (text and images) is not covered by that licence. The fonts are under the SIL Open Font License, except KaTeX's maths fonts and styles, which are MIT. The licence files are in `static/fonts/` and `static/fonts/katex/`.
