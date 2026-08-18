#!/bin/sh
# Install user-level skills onto the Cloud Agent VM home directory.
# Source trees live under .cursor/cloud-home/skills/ (environment setup, not library code).
set -eu

root="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
src="$root/cloud-home/skills"
dest="${HOME}/.cursor/skills"

mkdir -p "$dest"

for skill in "$src"/*; do
  [ -d "$skill" ] || continue
  name="$(basename "$skill")"
  rm -rf "$dest/$name"
  cp -R "$skill" "$dest/$name"
done

find "$dest" -type f \( -name "*.mjs" -o -name "*.sh" \) -exec chmod +x {} +
