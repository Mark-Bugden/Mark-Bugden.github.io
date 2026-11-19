# mark-bugden.github.io

Mark Bugden's personal site: projects with interactive demos, background and publications, in English, Czech and German. It is built with Hugo. Each demo is a bundle that its own project repo publishes on a GitHub release, and the site fetches each project's latest release.

## Run it locally

You need Hugo extended 0.170.0, Node 20 or later, and the GitHub CLI signed in (`gh auth login`).

```sh
git clone https://github.com/Mark-Bugden/Mark-Bugden.github.io.git && cd Mark-Bugden.github.io
scripts/fetch-demos.sh
hugo server -D        # http://localhost:1313, draft write-ups included
```

## How it fits together

- **Demos.** [`data/projects.yaml`](data/projects.yaml) lists each demo's slug and repo. [`scripts/fetch-demos.sh`](scripts/fetch-demos.sh) does the following for each one:
  - downloads `demo-<slug>.zip` from the repo's latest release, or from the release in the entry's `tag`, if it has one
  - validates it with the demo-kit version it was built with (`kitVersion` in its manifest)
  - unpacks it into `static/demos/<slug>/`, which is gitignored

  The bundle contract is in the [demo-kit README](https://github.com/Mark-Bugden/demo-kit#readme).
- **Write-ups** live in `content/projects/<slug>.md`, with `demo: <slug>` in the front matter. A project is listed only when two things are true:
  - its manifest status is `in-progress` or `live`
  - its write-up is not a draft

  The build fails if a published write-up's bundle is missing, is still a stub, or disagrees with `data/projects.yaml`.
- **Styles** are all in [`assets/css/site.css`](assets/css/site.css). Its design tokens on `:root` hold every colour and typeface: dark, and light only when the visitor picks it with the header button. Demos keep the kit's own tokens on `[data-demo]`. The fonts (Space Grotesk, Inter and JetBrains Mono) are self-hosted in `static/fonts/`, each in a Latin and a Latin Extended file. Browsers fetch the Latin Extended files only for text that needs them, such as Czech.
- **Deploys.** [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every pull request and every push to `main`. It also runs when a project releases a demo, and once a day. It fetches and validates the bundles, builds with `hugo --minify --panicOnWarning`, and checks every link with lychee. On `main` it then deploys to GitHub Pages. Stub bundles are validated but not deployed.

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
- **Project write-ups and demos** are in English only for now.
  - `content/projects/<slug>.cs.md` and `.de.md` hold only front matter: a translated `title`, `description`, `tagline` and `tags`. The tagline and tags replace the manifest's English ones.
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
3. Add `content/projects/<slug>.cs.md` and `.de.md` with a translated title, description, tagline and tags; copy an existing pair. Until they exist, the Czech and German Projects pages show the English card.

## Other tasks

- **Redraw the mark:** run `python scripts/hopf-mark.py`. It draws four fibres of the Hopf fibration and writes the header SVG and `static/favicon.svg`.
- **Preview accent colours:** under `hugo server`, an Accent button at the bottom right of every page opens a panel of colour pairs (dark and light theme) with their contrast. It is left out of production builds.
- **Redraw the home page figure:** run `python scripts/phase-portrait.py`. It draws the phase portrait of a simple pendulum and writes `layouts/partials/phase-portrait.html`.

## Licence

The code is [MIT](LICENSE). The site's content (text and images) is not covered by that licence. The fonts are under the SIL Open Font License; the licence files are in `static/fonts/`.
