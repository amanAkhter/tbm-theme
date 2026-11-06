#!/usr/bin/env bash
# Sample shell script demonstrating Carbonline syntax highlighting.

set -euo pipefail

APP_NAME="carbonline"
TARGET_DIR="${1:-/tmp/carbonline-dist}"
TIMESTAMP="$(date +%s)"

echo "[build] Packaging ${APP_NAME} at ${TIMESTAMP}..."

if [[ ! -d "${TARGET_DIR}" ]]; then
  mkdir -p "${TARGET_DIR}"
  echo "Created directory: ${TARGET_DIR}"
fi

for file in src/*.json; do
  if [[ -f "${file}" ]]; then
    base_name="$(basename "${file}")"
    echo "Processing config: ${base_name}"
    cp "${file}" "${TARGET_DIR}/${base_name}.bak"
  fi
done

echo "Successfully completed build for ${APP_NAME}."
exit 0

