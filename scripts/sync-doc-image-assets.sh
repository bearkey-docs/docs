#!/usr/bin/env bash
set -euo pipefail

local_dir="${DOC_IMAGE_SYNC_LOCAL_DIR:-build/assets/images}"
remote_host="${BEARKEY_DOCS_IMAGE_HOST:-119.23.152.163}"
remote_user="${BEARKEY_DOCS_IMAGE_USER:-root}"
remote_dir="${BEARKEY_DOCS_IMAGE_REMOTE_DIR:-/var/www/bearkey-docs-assets/assets/images}"
private_key="${BEARKEY_DOCS_IMAGE_SSH_PRIVATE_KEY:-}"
password="${BEARKEY_DOCS_IMAGE_SSH_PASSWORD:-}"

if [[ -z "$private_key" && -z "$password" ]]; then
  echo "Skipping Bearkey image sync because no SSH private key or password secret is configured."
  exit 0
fi

if [[ ! -d "$local_dir" ]]; then
  echo "Image asset directory not found: $local_dir" >&2
  exit 1
fi

remote="${remote_user}@${remote_host}"
remote_dir_quoted="$(printf '%q' "$remote_dir")"
key_path=""

if [[ -n "$private_key" ]]; then
  key_path="${RUNNER_TEMP:-/tmp}/bearkey-docs-image-sync-key"
  printf '%s\n' "$private_key" > "$key_path"
  chmod 600 "$key_path"
else
  export SSHPASS="$password"
fi

run_ssh() {
  if [[ -n "$private_key" ]]; then
    ssh -i "$key_path" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new "$remote" "$@"
  else
    sshpass -e ssh -o StrictHostKeyChecking=accept-new "$remote" "$@"
  fi
}

sync_with_rsync() {
  if [[ -n "$private_key" ]]; then
    rsync -az --checksum --delete \
      -e "ssh -i $key_path -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" \
      "$local_dir/" "$remote:$remote_dir/"
  else
    sshpass -e rsync -az --checksum --delete \
      -e "ssh -o StrictHostKeyChecking=accept-new" \
      "$local_dir/" "$remote:$remote_dir/"
  fi
}

sync_with_tar() {
  run_ssh "mkdir -p $remote_dir_quoted && find $remote_dir_quoted -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

  if [[ -n "$private_key" ]]; then
    tar -C "$local_dir" -cf - . | ssh -i "$key_path" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new "$remote" "tar -C $remote_dir_quoted -xf -"
  else
    tar -C "$local_dir" -cf - . | sshpass -e ssh -o StrictHostKeyChecking=accept-new "$remote" "tar -C $remote_dir_quoted -xf -"
  fi
}

run_ssh "mkdir -p $remote_dir_quoted"

if command -v rsync >/dev/null 2>&1; then
  sync_with_rsync
else
  echo "rsync is not installed; falling back to tar-based sync."
  sync_with_tar
fi
