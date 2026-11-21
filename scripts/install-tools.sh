#!/usr/bin/env bash
# Install the Hugo extended and lychee that CI uses into .tools/ (gitignored), checking each download
# against its pinned SHA-256. The pages workflow runs this too, so the versions and checksums are set
# here and nowhere else. A tool already in .tools/ at its pinned version is left alone.
#
# Usage: scripts/install-tools.sh, then put .tools/ on PATH (scripts/check.sh does both).
# Runs on Linux and on Windows (Git Bash), both x86-64. Anywhere else, install Hugo extended and
# lychee at these versions yourself, and put them on PATH.
#
# Needs: curl, sha256sum, tar, unzip.
set -euo pipefail
cd "$(dirname "$0")/.."

hugo_version=0.170.0
lychee_version=0.24.2

case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)
    hugo_asset="hugo_extended_${hugo_version}_linux-amd64.tar.gz"
    hugo_sha256=0930754ec22ad2dd1a252f8c31a5e57faccc9d15f1c3d381ddafcb96eeb8aef0
    lychee_asset=lychee-x86_64-unknown-linux-gnu.tar.gz
    lychee_sha256=1f4e0ef7f6554a6ed33dd7ac144fb2e1bbed98598e7af973042fc5cd43951c9a
    exe= ;;
  MINGW*-x86_64 | MSYS*-x86_64)
    hugo_asset="hugo_extended_${hugo_version}_windows-amd64.zip"
    hugo_sha256=56c2bc95f3fc0b6be060f0a4a23a0287fb3954c6595f6f170b49330366083df5
    lychee_asset=lychee-x86_64-pc-windows-msvc.zip
    lychee_sha256=32975d1493ee1a975d6bb41e4fb56fe419cb442ded628bb772ba2e614acfacad
    exe=.exe ;;
  *)
    echo "install-tools.sh: no pinned Hugo and lychee for $(uname -s) $(uname -m)." >&2
    echo "Install Hugo extended $hugo_version and lychee $lychee_version, and put them on PATH." >&2
    exit 1 ;;
esac

mkdir -p .tools
download=$(mktemp -d)
trap 'rm -rf "$download"' EXIT

# install <name> <url> <sha256>: download and verify the archive, and move the one binary in it,
# wherever the archive keeps it, into .tools/.
install() {
  local name=$1 url=$2 sha256=$3 archive="$download/${2##*/}"
  echo "== installing $name from $url"
  curl -fsSL -o "$archive" "$url"
  echo "$sha256  $archive" | sha256sum --check --quiet
  mkdir "$download/$name"
  case "$archive" in
    *.zip) unzip -q "$archive" -d "$download/$name" ;;
    *) tar -xzf "$archive" -C "$download/$name" ;;
  esac
  mv "$(find "$download/$name" -type f -name "$name$exe" | head -n 1)" ".tools/$name$exe"
}

if ! .tools/hugo$exe version 2>/dev/null | grep -q "^hugo v$hugo_version-"; then
  install hugo "https://github.com/gohugoio/hugo/releases/download/v$hugo_version/$hugo_asset" "$hugo_sha256"
fi
if ! .tools/lychee$exe --version 2>/dev/null | grep -qx "lychee $lychee_version"; then
  install lychee "https://github.com/lycheeverse/lychee/releases/download/lychee-v$lychee_version/$lychee_asset" "$lychee_sha256"
fi
.tools/hugo$exe version
.tools/lychee$exe --version
