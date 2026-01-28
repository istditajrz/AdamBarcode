#!/usr/bin/env bash

git fetch
current="$(git describe --exact-match --tags)"
# List all tags in reverse date order
latest="$(git tag --sort -version:refname | head -n 1)"

if [ "$current" -eq "$latest" ]; then
	echo "Up to date."
	exit 0
fi
echo "Updating..."
git checkout tags/$latest
echo "Updated."
