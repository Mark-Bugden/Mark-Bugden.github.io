# Notes for agents

@README.md

- The site is in English, Czech and German. Any change to visible text needs the same change in all three; see "Languages" in the README for where each kind of text lives.
- Mark writes the English copy himself. Use his wording as given, and don't write new prose about him or his work.
- Other sessions work in this repo, demo-kit and the project repos at the same time. Run `scripts/status.sh` before you change or describe a project, and again before you report back, and don't rely on what you saw earlier. An open PR, or a branch with commits that aren't in main, usually means someone is working there.
- Don't open a pull request until `scripts/check.sh` passes: every failed CI run emails Mark. Set `git config core.hooksPath .githooks` in your clone, so the pre-push hook runs it, and never push with `--no-verify`.
