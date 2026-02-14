# SSH Setup Guide for Git Push from Devcontainer

## ⚠️ Current Issue

`git push` hangs because SSH agent forwarding from WSL2 → Devcontainer is not working properly.

**Symptoms:**
- ✓ `ssh -T git@github.com` works on WSL2 host
- ✗ `ssh -T git@github.com` hangs in devcontainer  
- ✗ `git push` hangs in devcontainer
- ✗ `ssh-add -l` hangs in devcontainer

## 🔧 Fix: Set up keychain on WSL2 Host

According to [this guide](https://zenn.dev/nayushi/articles/5d577c93e03a9b), VSCode's automatic SSH forwarding doesn't work properly with WSL2 unless you use `keychain`.

### Step 1: Install keychain on WSL2 (Not in devcontainer!)

Open a **WSL2 terminal** (PowerShell → `wsl` or Windows Terminal → Ubuntu):

```bash
sudo apt-get update
sudo apt-get install keychain
```

### Step 2: Configure keychain in ~/.bashrc on WSL2

Add these lines to your `~/.bashrc` on **WSL2 host**:

```bash
# SSH keychain for devcontainer forwarding
# Reference: https://zenn.dev/nayushi/articles/5d577c93e03a9b
if [ -f "$HOME/.ssh/keys/github/id_rsa" ]; then
    /usr/bin/keychain -q --nogui $HOME/.ssh/keys/github/id_rsa
    source $HOME/.keychain/$(hostname)-sh
fi
```

Or run this command to add it automatically:

```bash
cat >> ~/.bashrc << 'EOF'

# SSH keychain for devcontainer forwarding
if [ -f "$HOME/.ssh/keys/github/id_rsa" ]; then
    /usr/bin/keychain -q --nogui $HOME/.ssh/keys/github/id_rsa
    source $HOME/.keychain/$(hostname)-sh
fi
EOF
```

### Step 3: Reload bash on WSL2

```bash
source ~/.bashrc
```

You should see output like:
```
* keychain 2.8.5 ~ http://www.funtoo.org
* Found existing ssh-agent: 12345
* Known ssh key: /home/yourusername/.ssh/keys/github/id_rsa
```

### Step 4: Verify on WSL2 host

```bash
# Should list your GitHub key
ssh-add -l

# Should authenticate successfully
ssh -T git@github.com
# Expected: "Hi username! You've successfully authenticated..."
```

### Step 5: Restart VSCode

1. **Close VSCode completely** (not just the window - quit the application)
2. **Re-open VSCode**
3. **Reopen in Container** (or rebuild container)

VSCode will now forward the SSH agent that keychain is managing.

### Step 6: Test in Devcontainer

Inside the devcontainer, run:

```bash
# Should list your GitHub key (forwarded from WSL2)
ssh-add -l

# Should authenticate successfully
ssh -T git@github.com

# Should work now!
cd /var/www/html/lang-note
git push -u origin main
```

## 🎯 Why This Works

1. **keychain** solves WSL2's ssh-agent persistence issue
2. **VSCode** automatically forwards the SSH agent from WSL2 → Devcontainer
3. **No manual .ssh mounting** needed (which causes permission issues)

## 🆘 Troubleshooting

### If ssh-add -l still hangs in devcontainer:

1. Make sure keychain is running on WSL2:
   ```bash
   # On WSL2 host
   ps aux | grep keychain
   ps aux | grep ssh-agent
   ```

2. Make sure you **fully restarted VSCode** after setting up keychain

3. Check if `SSH_AUTH_SOCK` is set in devcontainer:
   ```bash
   echo $SSH_AUTH_SOCK
   # Should output: /tmp/cursor-remote-ssh-[something].sock
   ```

4. Try rebuilding the devcontainer:
   - Press `F1` → `Dev Containers: Rebuild Container`

### Alternative: Use HTTPS instead of SSH

If SSH forwarding continues to fail, use HTTPS with a Personal Access Token:

```bash
cd /var/www/html/lang-note

# Change to HTTPS
git remote set-url origin https://github.com/hushimi/lang-note.git

# Push (you'll be prompted for username and token)
git push -u origin main

# Generate token at: https://github.com/settings/tokens
# Required scope: repo
```

## 📚 References

- [VSCode SSH Agent Forwarding Docs](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)
- [WSL2 + Devcontainer SSH Guide (Japanese)](https://zenn.dev/nayushi/articles/5d577c93e03a9b)
- [WSL2 ssh-agent Issues](https://zenn.dev/kaityo256/articles/ssh_agent_on_wsl)
