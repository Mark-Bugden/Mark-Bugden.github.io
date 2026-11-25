# Notes for agents

@README.md

- The site is in English, Czech and German. Any change to visible text needs the same change in all three; see "Languages" in the README for where each kind of text lives.
- Mark writes the English copy himself. Use his wording as given, and don't write new prose about him or his work.
- Other sessions work in this repo, demo-kit and the project repos at the same time. Run `scripts/status.sh` before you change or describe a project, and again before you report back, and don't rely on what you saw earlier. An open PR, or a branch with commits that aren't in main, usually means someone is working there.
- Work on the site and the demos is tracked as issues on the Website project board: https://github.com/users/Mark-Bugden/projects/3. Each issue is in the repo where its change lands, and one that spans repos is in this one. Link your PR to its issue; `Fixes Mark-Bugden/<repo>#N` works from another repo. Add any issue you open to the board with `gh project item-add 3 --owner Mark-Bugden --url <issue URL>`.
- Don't open a pull request until `scripts/check.sh` passes: every failed CI run emails Mark. Set `git config core.hooksPath .githooks` in your clone, so the pre-push hook runs it, and never push with `--no-verify`.
