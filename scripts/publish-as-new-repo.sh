#!/usr/bin/env bash
# Publish the current branch as `main` on a brand-new empty GitHub/GitLab repo.
#
# Prerequisite: create an EMPTY repository on GitHub (no README, no .gitignore).
#
# Usage:
#   chmod +x scripts/publish-as-new-repo.sh
#   ./scripts/publish-as-new-repo.sh git@github.com:YOUR_USER/YOUR_NEW_REPO.git
#
# What it does:
#   1. Adds a remote named `new-origin` (or uses existing if URL matches).
#   2. Pushes the current branch to `main` on that remote.
#
# Afterward you can replace the old remote:
#   git remote remove origin
#   git remote rename new-origin origin
#   git branch -M main
#   git push -u origin main
#
set -euo pipefail

if [[ $# -lt 1 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
  sed -n '2,20p' "$0"
  exit 0
fi

NEW_URL="$1"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "Current branch: $CURRENT_BRANCH"
echo "New remote URL: $NEW_URL"

if git remote get-url new-origin &>/dev/null; then
  echo "Remote 'new-origin' already exists; updating URL."
  git remote set-url new-origin "$NEW_URL"
else
  git remote add new-origin "$NEW_URL"
fi

echo "Pushing $CURRENT_BRANCH -> new-origin/main ..."
git push -u new-origin "$CURRENT_BRANCH:main"

echo ""
echo "Done. Your new repo's default branch is 'main' with this codebase."
echo "Optional: rename local branch to main:  git branch -m $CURRENT_BRANCH main"
echo "Optional: switch origin to the new repo (see comments at top of this script)."
