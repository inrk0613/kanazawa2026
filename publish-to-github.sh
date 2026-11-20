#!/usr/bin/env bash
set -euo pipefail
if ! command -v gh >/dev/null 2>&1; then echo 'GitHub CLI (gh) が必要です。https://cli.github.com/'; exit 1; fi
if ! gh auth status >/dev/null 2>&1; then echo 'gh auth login を先に実行してください。'; exit 1; fi
repo_name='kanazawa-autumn-2026'
visibility='--private'
if [[ "${1:-}" == '--public' ]]; then visibility='--public'; fi
if gh repo view "$(gh api user --jq .login)/${repo_name}" >/dev/null 2>&1; then
 echo "同名のリポジトリが存在します。上書きを避けるため中止しました: ${repo_name}"; exit 1
fi
if [ ! -d .git ]; then git init -b main; fi
git add .
git commit -m 'feat: launch Kanazawa autumn journey PWA' || true
gh repo create "${repo_name}" "$visibility" --source=. --remote=origin --push
echo '作成が完了しました。GitHub Pagesは Settings > Pages > GitHub Actions で有効化してください。'
