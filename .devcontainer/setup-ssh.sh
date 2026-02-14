#!/bin/bash
# SSH Agent Forwarding Setup for Devcontainer
# Reference: https://zenn.dev/nayushi/articles/5d577c93e03a9b

set -e

echo "🔑 Setting up SSH agent forwarding..."

# Check if SSH_AUTH_SOCK is set by VSCode
if [ -n "$SSH_AUTH_SOCK" ]; then
    echo "✓ SSH_AUTH_SOCK is set: $SSH_AUTH_SOCK"
    
    # Test if agent is accessible
    if ssh-add -l &>/dev/null; then
        echo "✓ SSH agent is accessible and has keys loaded:"
        ssh-add -l
    elif [ $? -eq 1 ]; then
        echo "⚠ SSH agent is accessible but has no keys loaded"
        echo "Please run the following on your WSL2 host:"
        echo ""
        echo "  # Install keychain (if not installed)"
        echo "  sudo apt-get install keychain"
        echo ""
        echo "  # Add to ~/.bashrc"
        echo "  echo '/usr/bin/keychain -q --nogui \$HOME/.ssh/keys/github/id_rsa' >> ~/.bashrc"
        echo "  echo 'source \$HOME/.keychain/\$(hostname)-sh' >> ~/.bashrc"
        echo ""
        echo "  # Reload and test"
        echo "  source ~/.bashrc"
        echo "  ssh-add -l"
        echo "  ssh -T git@github.com"
        echo ""
        exit 1
    else
        echo "✗ SSH agent is not accessible (error code: $?)"
        echo "VSCode's automatic SSH forwarding may not be working."
        exit 1
    fi
else
    echo "✗ SSH_AUTH_SOCK is not set"
    echo "VSCode should automatically set this when SSH agent is running on host."
    exit 1
fi

# Test GitHub connection
echo ""
echo "🔍 Testing GitHub SSH connection..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✓ GitHub SSH authentication successful!"
    exit 0
else
    echo "✗ GitHub SSH authentication failed"
    echo "Please verify your SSH setup on WSL2 host."
    exit 1
fi
