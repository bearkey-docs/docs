#!/usr/bin/env bash
set -euo pipefail

local_dir="${1:-build}"
remote_host="${DOCS_DEPLOY_HOST:-119.23.152.163}"
remote_user="${DOCS_DEPLOY_USER:-root}"
remote_base="${DOCS_DEPLOY_BASE:-/vdc/bearkey-docs}"
password="${DOCS_DEPLOY_PASSWORD:-${BEARKEY_DOCS_IMAGE_SSH_PASSWORD:-}}"
private_key="${DOCS_DEPLOY_PRIVATE_KEY:-${BEARKEY_DOCS_IMAGE_SSH_PRIVATE_KEY:-}}"
container_name="${DOCS_CONTAINER_NAME:-bearkey-docs-server}"
restart_container="${DOCS_RESTART_CONTAINER:-true}"

if [[ -z "$private_key" && -z "$password" ]]; then
  echo "Skipping: no SSH key or password configured."
  exit 0
fi
if [[ ! -d "$local_dir" ]]; then
  echo "Build directory not found: $local_dir" >&2
  exit 1
fi

release_dir="releases/${GITHUB_SHA:-local}"
remote="${remote_user}@${remote_host}"

run_ssh() {
  if [[ -n "$private_key" ]]; then
    ssh -i /dev/stdin -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new "$remote" "$@" <<<"$private_key"
  else
    SSHPASS="$password" sshpass -e ssh -o StrictHostKeyChecking=accept-new "$remote" "$@"
  fi
}

run_ssh "mkdir -p ${remote_base}/${release_dir}"

echo "Uploading build to ${remote}:${remote_base}/${release_dir}..."
if [[ -n "$private_key" ]]; then
  tar -C "$local_dir" -cf - . | ssh -i /dev/stdin -o IdentitiesOnly=yes \
    -o StrictHostKeyChecking=accept-new "$remote" \
    "tar -C ${remote_base}/${release_dir} -xf -" <<<"$private_key"
else
  tar -C "$local_dir" -cf - . | SSHPASS="$password" sshpass -e ssh \
    -o StrictHostKeyChecking=accept-new "$remote" \
    "tar -C ${remote_base}/${release_dir} -xf -"
fi

run_ssh "
set -e
ln -sfn ${remote_base}/${release_dir} ${remote_base}/current.new
mv -Tf ${remote_base}/current.new ${remote_base}/current
current_target=\$(readlink -f ${remote_base}/current)
test \"\$current_target\" = \"${remote_base}/${release_dir}\"
"

# Docker resolves a bind-mounted symlink when the container starts. Restarting
# the site container is therefore required after switching `current`, otherwise
# nginx keeps serving the previous release even though the upload succeeded.
if [[ \"$restart_container\" == \"true\" ]]; then
  run_ssh "
  set -e
  command -v docker >/dev/null 2>&1
  docker inspect ${container_name} >/dev/null 2>&1
  mount_source=\$(docker inspect ${container_name} --format '{{range .Mounts}}{{if eq .Destination \"/usr/share/nginx/html\"}}{{.Source}}{{end}}{{end}}')
  test \"\$mount_source\" = \"${remote_base}/current\"
  docker restart ${container_name} >/dev/null
  docker exec ${container_name} sh -c 'test -d /usr/share/nginx/html'
  echo 'Restarted ${container_name} on ${remote_host}'
  "
fi

run_ssh "
set -e
cd ${remote_base}/releases
ls -t | tail -n +3 | xargs -r rm -rf
echo 'Deployed: ${release_dir}'
echo 'Cleaned old releases'
"

echo "Deploy to ${remote_host} complete."
