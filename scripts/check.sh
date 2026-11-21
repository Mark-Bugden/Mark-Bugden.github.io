#!/usr/bin/env bash
# The checks that decide whether the pages workflow passes, so a change that would fail CI fails here
# first. It installs the pinned Hugo and lychee, fetches and validates every demo bundle, builds the
# site into public/ as production does, and checks the site's own links, offline. CI runs this same
# script, then reports external links without failing on them. The pre-push hook runs it before every
# push (.githooks/pre-push).
#
# Usage: scripts/check.sh
# Needs what scripts/fetch-demos.sh and scripts/install-tools.sh need.
set -euo pipefail
cd "$(dirname "$0")/.."

scripts/install-tools.sh
export PATH="$PWD/.tools:$PATH"

# Without --drop-stubs, so stub bundles stay in static/demos/ for `hugo server -D`. They are left out
# of public/ below instead.
scripts/fetch-demos.sh

rm -rf public
hugo --minify --panicOnWarning

# As in production, stub bundles are validated but not published.
for manifest in public/demos/*/manifest.json; do
  if [ "$(node -p "require('./$manifest').status")" = stub ]; then
    rm -rf "$(dirname "$manifest")"
    echo "== left the stub ${manifest%/manifest.json} out of the build"
  fi
done

# The site's own links: relative ones, and its absolute URLs (canonical, og:url, og:image), which the
# remap points at this build rather than at whatever is live. lychee wants a Windows path on Windows,
# which Git Bash's pwd -W gives.
root=$(pwd -W 2>/dev/null || pwd)
case "$root" in
  /*) site="file://$root/public" ;;
  *) site="file:///$root/public" ;;
esac
lychee --config lychee.toml --offline --root-dir "$root/public" \
  --remap "https://mark-bugden\.com/(.*) $site/\$1" \
  'public/**/*.html'
