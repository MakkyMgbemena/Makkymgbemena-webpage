#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Committing latest changes"
git add -A
if git diff --cached --quiet; then
  echo "    Nothing new to commit."
else
  git commit -m "Deploy $(date +'%Y-%m-%d %H:%M')"
fi

echo "==> Pushing to GitHub (auto-deploys Hosting via Actions)"
git push origin main

echo "==> Deploying Cloud Functions"
firebase deploy --only functions --project makkymgbemena-webpage

echo "✅ Done. Site + functions are live."
