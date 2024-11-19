#!/bin/bash
# https://phase.dev/blog/nextjs-public-runtime-variables/

# Define a list of mandatory environment variables to check
MANDATORY_VARS=()

# Define a list of optional environment variables (no check needed)
OPTIONAL_VARS=("NEXT_PUBLIC_PLAY_FANFARE" "NEXT_PUBLIC_PLAY_CLICKS" "NEXT_PUBLIC_ENABLE_CONFETTI" "NEXT_PUBLIC_ENABLE_OPENINGS" "NEXT_PUBLIC_OPENINGS_DEFAULT_VOLUME" "NEXT_PUBLIC_CUSTOM_SITE_URL")

## Infer NEXT_PUBLIC_APP_HOST from APP_HOST if not already set
#if [ -z "$NEXT_PUBLIC_APP_HOST" ] && [ ! -z "$APP_HOST" ]; then
#    export NEXT_PUBLIC_APP_HOST="$APP_HOST"
#fi

# Check if each mandatory variable is set
for VAR in "${MANDATORY_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "$VAR is not set. Please set it and rerun the script."
        exit 1
    fi
done

# Combine mandatory and optional variables for replacement
ALL_VARS=("${MANDATORY_VARS[@]}" "${OPTIONAL_VARS[@]}")

# Find and replace BAKED values with real values
find /app/public /app/.next -type f -name "*.js" |
while read file; do
  for VAR in "${ALL_VARS[@]}"; do
    if [ ! -z "${!VAR}" ]; then
        sed -i "s|BAKED_$VAR|${!VAR}|g" "$file"
    fi
  done
done