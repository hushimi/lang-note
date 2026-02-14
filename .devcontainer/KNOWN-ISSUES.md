# Known Issues with Devcontainer

## SSH Agent Forwarding Broken in Cursor/VSCode + WSL2

### Issue
`ssh-add -l` and `git push` via SSH hang indefinitely inside the devcontainer, even though they work fine on the WSL2 host.

### Root Cause
Cursor/VSCode creates SSH socket files at `/tmp/cursor-remote-ssh-*.sock` but doesn't properly forward connections to the WSL2 host's SSH agent. The socket files exist but nothing responds on them.

**Evidence:**
```bash
# On WSL2 host - works fine
$ ssh-add -l
4096 SHA256:xxxx /home/user/.ssh/keys/github/id_rsa (RSA)

# Inside devcontainer - times out
$ timeout 3 ssh-add -l
Command timed out (exit code 124)

# Socket exists but is unresponsive
$ ls -la $SSH_AUTH_SOCK
lrwxrwxrwx 1 dev 64 Feb 14 09:16 /tmp/cursor-remote-ssh-*.sock -> /tmp/cursor-remote-ssh-*.sock=
```

### Why This Happens
- Cursor's SSH forwarding uses `socat` or similar to proxy the socket
- In WSL2, the socket forwarding chain breaks: WSL2 → Windows → Docker → Container
- The keychain-managed ssh-agent on WSL2 doesn't get properly forwarded
- This is a known limitation documented in various GitHub issues for both VSCode and Cursor

### Workaround: Use HTTPS Instead

**Recommended solution** - use GitHub with HTTPS and Personal Access Token:

```bash
# 1. Switch to HTTPS remote
cd /var/www/html/lang-note
git remote set-url origin https://github.com/hushimi/lang-note.git

# 2. Configure git to store credentials
git config --global credential.helper store

# 3. Push (you'll be prompted once for username and token)
git push -u origin main
# Username: your-github-username
# Password: your-personal-access-token (NOT your GitHub password!)

# 4. Credentials are now saved - future pushes work without prompts
git push
```

**Generate Personal Access Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Set scopes: Check `repo` (Full control of private repositories)
4. Generate token and **copy it immediately** (you won't see it again!)
5. Use the token as your password when git prompts you

**Advantages of HTTPS:**
- ✓ Works reliably in devcontainers
- ✓ No complex SSH forwarding needed
- ✓ Credentials stored securely with git credential helper
- ✓ Works the same on all platforms (WSL2, macOS, Linux, Windows)

### Alternative: Manual SSH Key in Container (Not Recommended)

You could copy SSH keys directly into the container, but this is **not recommended** because:
- ❌ Security risk (keys persist in container)
- ❌ Must manually update keys if they change
- ❌ Different keys on host vs container causes confusion
- ❌ Violates principle of least privilege

If you absolutely need SSH, this works but isn't ideal:

```bash
# Copy key to container (security risk!)
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cp /path/to/your/key ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Configure git to use it
git config core.sshCommand "ssh -i ~/.ssh/id_rsa -F /dev/null"
```

### Status
- **Issue reported:** 2026-02-14
- **Status:** Known limitation of Cursor/VSCode in WSL2
- **Tracking:** No official fix from Cursor team yet
- **Solution:** Use HTTPS (recommended)

### References
- [VSCode Remote SSH Known Issues](https://code.visualstudio.com/docs/remote/troubleshooting#_resolving-git-line-ending-issues-in-wsl-resulting-in-many-modified-files)
- [SSH Agent Forwarding in WSL2](https://zenn.dev/nayushi/articles/5d577c93e03a9b)
- [Similar issue in VSCode](https://github.com/microsoft/vscode-remote-release/issues/5146)
