#!/bin/sh

# Replace runtime env vars and start next server
bash /app/scripts/replace-variables.sh &&
node server.js