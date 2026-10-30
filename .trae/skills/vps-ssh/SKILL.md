---
name: vps-ssh
description: Run read-only commands on the user's VPS over SSH to inspect services, nginx, logs, disk and deploy paths. Use when asked to connect to the VPS or check a deployed site. Do not use for git push or local code edits.
---

# VPS over SSH

Connect to the user's own VPS and run remote commands from this machine. The SSH key is already installed on the VPS, so no password is needed.

## Connection facts

- Host — `root@76.13.126.149` (hostname `srv1333724`), port 22
- Key — `C:\Users\dante\.ssh\id_ed25519`, already authorized in root's `authorized_keys`
- Shell — every command runs as `root`; never prepend `sudo`

Base command. Put the remote command in quotes as a single line.

```powershell
ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new root@76.13.126.149 "<remote command>"
```

Run one command per invocation and chain remote steps with `;` inside the quoted string. Do not start an interactive shell session, and do not leave a command hanging waiting for input.
If the connection fails, report the error text verbatim instead of retrying the same command repeatedly.

## Known layout on the VPS

- `/var/www/liberenalos7` — static build served by nginx on port 8081
- `/var/www/ldn` — clone of `git@github.com:dant-dev22/ldn.git` (Next.js), pm2 process `ldn` on port 8090
- `/var/www/html` — default nginx web root
- `/eldojo/eldojo-front` — eldojo frontend builds (`dist-admin`, `dist-student`)
- `/etc/nginx/sites-available` and `sites-enabled` — site configs (`eldojo-public`, `eldojo-admin`, `eldojo-student`, `liberenalos7`)
- Ports 80/443 host the eldojo production site; port 8081 hosts liberenalos7

> `mascaritas_gdl` still has no directory/port assigned on the VPS. Confirm the target path and port before deploying it.

## Guardrails

- **Run `git push` only when the user explicitly asks for it in the current request**, and only for the repository and branch involved in that request. Never push as part of an unprompted workflow, never rewrite remote history, and never push to a branch the user did not name.
- Prefer read-only commands (`ls`, `cat`, `systemctl status`, `journalctl`, `df -h`, `nginx -T`, `ss -lntp`). Inspect before touching anything.
- **Ask the user for explicit confirmation before any command that modifies the remote VPS** — writes, moves, deletes, permission or ownership changes, nginx config edits, `systemctl restart|reload|stop`, package installs, firewall changes. State the exact command and its effect, then wait for a clear yes. Do not treat a previously granted approval as covering a new command.
- Never touch the eldojo configs or the 80/443 listeners when working on another site; use the site's own directory and port.
- Validate nginx changes with `nginx -t` before any reload, and keep a backup of a config file before editing it.
- Print command output as-is rather than summarizing secrets; never echo private key material or credentials from the server.
