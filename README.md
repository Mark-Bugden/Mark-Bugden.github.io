# mark-bugden.github.io

Mark Bugden's personal site: projects with interactive demos, background and publications. It is built with Hugo. Each demo is a bundle that its own project repo publishes on a GitHub release, and the site fetches it at a pinned tag.

## Run it locally

You need Hugo extended 0.170.0, Node 20 or later, and the GitHub CLI signed in (`gh auth login`).

```sh
git clone https://github.com/Mark-Bugden/Mark-Bugden.github.io.git && cd Mark-Bugden.github.io
scripts/fetch-demos.sh
hugo server -D        # http://localhost:1313, draft write-ups included
```

## How it fits together

- **Demos.** [`data/projects.yaml`](data/projects.yaml) lists each demo's slug, repo and release tag. [`scripts/fetch-demos.sh`](scripts/fetch-demos.sh) does the following for each one:
  - downloads `demo-<slug>.zip` from that release
  - validates it with the demo-kit pinned in [`package.json`](package.json)
  - unpacks it into `static/demos/<slug>/`, which is gitignored

  The bundle contract is in the [demo-kit README](https://github.com/Mark-Bugden/demo-kit#readme).
- **Write-ups** live in `content/projects/<slug>.md`, with `demo: <slug>` in the front matter. A project is listed only when two things are true:
  - its manifest status is `in-progress` or `live`
  - its write-up is not a draft

  The build fails if a published write-up's bundle is missing, is still a stub, or disagrees with `data/projects.yaml`.
- **Styles** are all in [`assets/css/site.css`](assets/css/site.css). Its design tokens on `:root` hold every colour and typeface: dark by default, and light when the OS prefers it or the visitor picks it with the header button. Demos keep the kit's own tokens on `[data-demo]`. The fonts (Space Grotesk, Inter and JetBrains Mono) are self-hosted in `static/fonts/`.
- **Deploys.** [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every pull request and every push to `main`. It fetches and validates the bundles, builds with `hugo --minify --panicOnWarning`, and checks every link with lychee. On `main` it then deploys to GitHub Pages. Stub bundles are validated but not deployed.

## Publish a project

1. In the project repo, set the manifest's `status` to `in-progress` or `live` and release a new tag.
2. Bump that project's `tag` in `data/projects.yaml`.
3. Remove `draft: true` from `content/projects/<slug>.md`.

## Other tasks

- **Update demo-kit:** change the tag in `package.json`, run `npm install`, and commit `package-lock.json`.
- **Redraw the mark:** run `python scripts/hopf-mark.py`. It draws four fibres of the Hopf fibration and writes the header SVG and `static/favicon.svg`.
- **Preview accent colours:** under `hugo server`, an Accent button at the bottom right of every page opens a panel of colour pairs (dark and light theme) with their contrast. It is left out of production builds.
- **Redraw the home page figure:** run `python scripts/phase-portrait.py`. It draws the phase portrait of a simple pendulum and writes `layouts/partials/phase-portrait.html`.

## Licence

The code is [MIT](LICENSE). The site's content (text and images) is not covered by that licence. The fonts are under the SIL Open Font License; the licence files are in `static/fonts/`.
