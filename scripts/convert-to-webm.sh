#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://pub-57309283dfae43be93171f41b37f356c.r2.dev"
TMPDIR="$(mktemp -d "$PWD/convert-to-webm.XXXXXX")"

echo "Working in $TMPDIR"

convert_and_upload() {
    local name="$1"
    local mp4="$TMPDIR/${name}.mp4"
    local webm="$TMPDIR/${name}.webm"

    echo ""
    echo "==> $name"

    echo "  Downloading..."
    curl -fsSL "$BASE_URL/${name}.mp4" -o "$mp4"

    echo "  Converting to webm..."
    ffmpeg -i "$mp4" -c:v libvpx-vp9 -crf 33 -b:v 0 -an "$webm" -y -loglevel info -stats

    echo "  Uploading via upload2cfpublic..."
    zsh -ic "source ~/.zshrc && upload2cfpublic '$webm'"

    echo "  Done: ${BASE_URL}/${name}.webm"
}

# convert_and_upload "anna-neshyba-edited"
convert_and_upload "ethyca-animation-demo-video"
convert_and_upload "maxlifefoundation"
convert_and_upload "incontextlearning"
convert_and_upload "catandalex"
convert_and_upload "catnesh"
convert_and_upload "cosmicfronter-v0"
convert_and_upload "vyx"

echo ""
echo "All done. Cleaning up $TMPDIR"
rm -rf "$TMPDIR"
