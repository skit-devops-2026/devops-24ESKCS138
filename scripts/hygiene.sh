#!/usr/bin/env bash

# Repository hygiene checks for the Kisan Market project.

set -uo pipefail

fail=0

err() {
    echo "FAIL: $1"
    fail=1
}

ok() {
    echo "  ok: $1"
}

# Check README placeholders.
if grep -q '<your-roll-number>\|<your-name>\|<your-github-username>\|<Project Name>' README.md 2>/dev/null; then
    err "README.md still has unfilled placeholders"
else
    ok "README.md placeholders filled"
fi

# Check README author table.
rows=$(grep -cE '^\|[^|]+\|[^|]+\|[^|]+\|' README.md 2>/dev/null || echo 0)

if [ "$rows" -lt 3 ]; then
    err "README.md author table is incomplete"
else
    ok "author table present"
fi

# Check .gitignore.
if [ -f .gitignore ]; then
    ok ".gitignore present"
else
    err ".gitignore missing"
fi

# Check files larger than 5 MB.
big=$(git ls-files -z 2>/dev/null | xargs -0 -I{} du -k "{}" 2>/dev/null | awk '$1>5120{print $2}')

if [ -n "$big" ]; then
    err "files larger than 5 MB are tracked:"
    echo "$big"
else
    ok "no oversized files"
fi

# Check dependency, build and environment files.
bad=$(git ls-files 2>/dev/null | grep -E '^(node_modules|venv|\.venv|target|dist|build)/|(^|/)\.env$' || true)

if [ -n "$bad" ]; then
    err "these should not be in git:"
    echo "$bad" | head -20
else
    ok "no dependency or environment files tracked"
fi

echo
if [ "$fail" -eq 0 ]; then
    echo "Hygiene check passed."
else
    echo "Hygiene check failed. Fix the items above."
fi

exit "$fail"
