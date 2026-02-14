# Devcontainer Setup for Lang Note

## SSH Configuration for Git Push

This devcontainer uses **automatic SSH agent forwarding** from the WSL2 host.

### Prerequisites (On WSL2 Host)

1. **Install keychain** (required for WSL2):
   ```bash
   sudo apt-get install keychain
   ```

2. **Configure keychain in ~/.bashrc**:
   ```bash
   # Add to ~/.bashrc on WSL2
   /usr/bin/keychain -q --nogui $HOME/.ssh/keys/github/id_rsa
   source $HOME/.keychain/$(hostname)-sh
   ```

3. **Reload shell**:
   ```bash
   source ~/.bashrc
   ```

4. **Test SSH connection** (on WSL2):
   ```bash
   ssh -T git@github.com
   ```

   Expected output: `Hi username! You've successfully authenticated...`

### How It Works

- VSCode automatically forwards your SSH agent from WSL2 into the devcontainer
- No manual `.ssh` directory mounting needed
- Git credentials (`.gitconfig`) are automatically copied on container start
- See: https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials

### Troubleshooting

If `git push` doesn't work:

1. **Check SSH agent on WSL2 host**:
   ```bash
   ssh-add -l
   ```
   Should show your GitHub key.

2. **Check SSH agent inside devcontainer**:
   ```bash
   ssh-add -l
   ```
   Should show the same key (forwarded from host).

3. **Test GitHub connection inside devcontainer**:
   ```bash
   ssh -T git@github.com
   ```

4. **If keys not showing**, restart devcontainer after setting up keychain on WSL2.

### Reference

- [VSCode SSH Agent Forwarding](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)
- [WSL2 + Devcontainer SSH Setup (Japanese)](https://zenn.dev/nayushi/articles/5d577c93e03a9b)
