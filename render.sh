#!/bin/bash

set -e
set -x

find -type l -name node_modules -exec rm '{}' \;

mkdir p
rsync \
    --exclude '**/Gruntfile.js' \
    --exclude '**/gulpfile.js' \
    --exclude '**/package.json' \
    --exclude '.git/**' \
    --exclude '.venv/**' \
    --exclude 'node_modules/**' \
    --exclude 'p' \
    --exclude 'render.sh' \
    --exclude 'reveal4' \
    -a --copy-links --delete \
    ./ ./p/
