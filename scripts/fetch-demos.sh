#!/usr/bin/env bash
# Fetch, unpack and validate every demo bundle listed in data/projects.yaml, from the project's latest
# release, or from the release its entry's `tag` names. Fails, never skips, if any bundle is missing or
# invalid. Each bundle is validated with the demo-kit version it was built with (its manifest's
# kitVersion), so a new kit release needs no change here.
#
# Usage: scripts/fetch-demos.sh [--drop-stubs]
#   --drop-stubs  after validating, delete bundles whose manifest status is "stub", so a production
#                 build does not publish them. Without it (local preview with `hugo server -D`),
#                 every bundle stays in static/demos/.
#
# Needs: node 20+, npm, git, gh (authenticated, or GH_TOKEN set), unzip.
set -euo pipefail
cd "$(dirname "$0")/.."

drop_stubs=false
case "${1:-}" in
  --drop-stubs) drop_stubs=true ;;
  "") ;;
  *) echo "usage: $0 [--drop-stubs]" >&2; exit 2 ;;
esac

# data/projects.yaml is a list of flat entries; print "slug repo tag" for each, with tag "-" when the
# entry has none.
entries=$(awk '
  function flush() {
    if (slug == "" && repo == "" && tag == "") return
    if (slug == "" || repo == "") { printf "data/projects.yaml: entry %d needs slug and repo\n", n > "/dev/stderr"; bad = 1 }
    else print slug, repo, (tag == "" ? "-" : tag)
    slug = repo = tag = ""
  }
  /^[ \t]*(#|$)/ { next }
  {
    sub(/[ \t]+#.*$/, "")
    if ($0 ~ /^- /) { flush(); n++; sub(/^- /, "") } else sub(/^[ \t]+/, "")
    key = $0; sub(/:.*/, "", key)
    value = $0; sub(/^[^:]*:[ \t]*/, "", value); gsub(/^["\047]|["\047]$/, "", value)
    if (key == "slug") slug = value; else if (key == "repo") repo = value; else if (key == "tag") tag = value
  }
  END { flush(); exit bad }
' data/projects.yaml)
[ -n "$entries" ] || { echo "data/projects.yaml lists no projects" >&2; exit 1; }

rm -rf static/demos
mkdir -p static/demos
download=$(mktemp -d)
trap 'rm -rf "$download"' EXIT

while read -r slug repo tag; do
  [[ "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "data/projects.yaml: bad slug \"$slug\"" >&2; exit 1; }
  [[ "$repo" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || { echo "$slug: bad repo \"$repo\"" >&2; exit 1; }
  if [ "$tag" = "-" ]; then
    tag=$(gh release view --repo "$repo" --json tagName --jq .tagName)
    echo "== $slug: $repo@$tag (latest release)"
  else
    echo "== $slug: $repo@$tag (held by data/projects.yaml)"
  fi
  [[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "$slug: tag \"$tag\" is not v<major>.<minor>.<patch>" >&2; exit 1; }

  gh release download "$tag" --repo "$repo" --pattern "demo-$slug.zip" --dir "$download" --clobber
  dir="static/demos/$slug"
  mkdir -p "$dir"
  unzip -q "$download/demo-$slug.zip" -d "$dir"
  kit=$(node -p "require('./$dir/manifest.json').kitVersion")
  [[ "$kit" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "$slug: the bundle's manifest says kitVersion \"$kit\"" >&2; exit 1; }
  npx --yes --package="github:Mark-Bugden/demo-kit#v$kit" -- demo-kit validate "$dir"

  manifest_slug=$(node -p "require('./$dir/manifest.json').slug")
  [ "$manifest_slug" = "$slug" ] || { echo "$slug: the bundle's manifest says slug \"$manifest_slug\"" >&2; exit 1; }
  status=$(node -p "require('./$dir/manifest.json').status")
  if $drop_stubs && [ "$status" = "stub" ]; then
    rm -rf "$dir"
    echo "   status is stub: validated, and dropped from this build"
  fi
done <<< "$entries"
