#!/usr/bin/env bash
# What is happening across the site's repos: this one, demo-kit and each project in
# data/projects.yaml. For each it lists the latest release, the open PRs, the PRs merged in the last
# day, the branches with commits that aren't in the default branch, and the open issues. Each issue
# shows its status on the project board, unless that's Todo, and the PRs that will close it. Other
# sessions work in these repos at the same time, and an open PR or an unmerged branch usually means
# one is working there. Run it before changing or describing a project, and again before reporting
# back.
#
# Usage: scripts/status.sh
# Needs the GitHub CLI, signed in (gh auth login).
set -euo pipefail
cd "$(dirname "$0")/.."

repos=("$(gh repo view --json nameWithOwner -q .nameWithOwner)" Mark-Bugden/demo-kit)
while read -r repo; do repos+=("$repo"); done < <(sed -n 's/^  repo: //p' data/projects.yaml | tr -d '\r')

query='
query($owner: String!, $name: String!, $base: String!) {
  repository(owner: $owner, name: $name) {
    nameWithOwner
    latestRelease { tagName publishedAt }
    tags: refs(refPrefix: "refs/tags/", first: 1, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) { nodes { name } }
    open: pullRequests(states: OPEN, first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes { number title headRefName updatedAt }
    }
    merged: pullRequests(states: MERGED, first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes { number title mergedAt }
    }
    branches: refs(refPrefix: "refs/heads/", first: 100) {
      nodes {
        name
        target { ... on Commit { committedDate } }
        compare(headRef: $base) { behindBy }
        associatedPullRequests(first: 1, orderBy: {field: UPDATED_AT, direction: DESC}) { nodes { number state } }
      }
    }
    issues(states: OPEN, first: 30, orderBy: {field: CREATED_AT, direction: ASC}) {
      totalCount
      nodes {
        number title
        projectItems(first: 5) { nodes { status: fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } } } }
        closedByPullRequestsReferences(first: 5, includeClosedPrs: false) { nodes { number repository { name nameWithOwner } } }
      }
    }
  }
}'

# compare() takes the branch as its base, so behindBy counts the branch's commits that the default
# branch doesn't have.
format='
def age: (now - fromdateiso8601) as $s
  | if $s < 3600 then "\($s / 60 | floor) min ago"
    elif $s < 172800 then "\($s / 3600 | floor) h ago"
    else "\($s / 86400 | floor) days ago" end;
.data.repository as $r
| ($r.branches.nodes | map(select((.compare.behindBy // 0) > 0)) | sort_by(.target.committedDate) | reverse) as $unmerged
| if $r.latestRelease then "   release  \($r.latestRelease.tagName), \($r.latestRelease.publishedAt | age)"
  elif ($r.tags.nodes | length) > 0 then "   release  none; newest tag \($r.tags.nodes[0].name)"
  else empty end,
  ($r.open.nodes[] | "   open PR  #\(.number) \(.title) (\(.headRefName), updated \(.updatedAt | age))"),
  ($r.merged.nodes | map(select((.mergedAt | fromdateiso8601) > now - 86400)) | sort_by(.mergedAt) | reverse | .[]
    | "   merged   #\(.number) \(.title) (\(.mergedAt | age))"),
  ($unmerged[] | "   branch   \(.name): \(.compare.behindBy) \(if .compare.behindBy == 1 then "commit" else "commits" end) not merged, last \(.target.committedDate | age), "
    + (.associatedPullRequests.nodes[0] | if . then "PR #\(.number) \(.state | ascii_downcase)" else "no PR" end)),
  ($r.issues.nodes[]
    | ([.projectItems.nodes[].status.name // empty | select(. != "Todo")]
      + [.closedByPullRequestsReferences.nodes[]
        | "PR \(if .repository.nameWithOwner == $r.nameWithOwner then "" else .repository.name end)#\(.number)"]) as $notes
    | "   issue    #\(.number) \(.title)" + if ($notes | length) > 0 then " (\($notes | join(", ")))" else "" end),
  if $r.issues.totalCount > ($r.issues.nodes | length) then "   issue    … and \($r.issues.totalCount - ($r.issues.nodes | length)) more" else empty end,
  if ($r.open.nodes | length) == 0 and ($unmerged | length) == 0 and $r.issues.totalCount == 0 then "   nothing open" else empty end'

for repo in "${repos[@]}"; do
  echo "== $repo"
  base=$(gh repo view "$repo" --json defaultBranchRef -q .defaultBranchRef.name)
  gh api graphql -F owner="${repo%%/*}" -F name="${repo#*/}" -F base="$base" -f query="$query" --jq "$format"
done
