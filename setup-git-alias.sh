#!/bin/bash
# Setup script to configure git alias for this project
# This script sets up the delete-merged-branch alias in the local git config
# Note: This alias works best when run inside Docker container where Unix tools are available

echo "Setting up git alias for this project..."

git config --local alias.delete-merged-branch "!f () { git branch --merged | grep -v '^\*' | grep -v 'develop' | grep -v 'master' | grep -v 'main' | xargs -r git branch -d; };f"

if [ $? -eq 0 ]; then
    echo "✓ Git alias 'delete-merged-branch' configured successfully!"
    echo ""
    echo "You can now use: git delete-merged-branch"
    echo "This will delete all merged branches except main, master, and develop."
    echo ""
    echo "Note: On Windows, run this inside Docker container:"
    echo "  docker-compose exec myapp bash -c 'cd /var/www/html/lang-note && git delete-merged-branch'"
else
    echo "✗ Failed to configure git alias"
    exit 1
fi
