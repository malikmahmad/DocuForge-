# 🚀 GitHub Deployment Guide for DocuForge

Your project is ready to deploy! Follow these steps to push to GitHub.

---

## 📋 Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New"** button (top-left)
3. Fill in:
   - **Repository name:** `docuforge`
   - **Description:** `AI-Powered Professional Documentation Generator`
   - **Public/Private:** Choose your preference
   - **Add .gitignore:** None (already have one)
   - **Add license:** MIT License
4. Click **"Create repository"**

---

## 🔗 Step 2: Connect Local Repository to GitHub

Copy and paste these commands in PowerShell:

```powershell
cd "c:\Users\mahma\Downloads\docuforge"

# Replace YOUR_USERNAME with your actual GitHub username
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/docuforge.git
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/mahma/docuforge.git
git push -u origin main
```

---

## 🔑 Step 3: GitHub Authentication

### Option A: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click **"Generate new token"**
3. Select scopes: `repo`, `workflow`
4. Copy the token
5. When Git asks for password, paste the token

### Option B: GitHub CLI
```powershell
# If you have GitHub CLI installed
gh auth login
# Follow prompts to authenticate
git push -u origin main
```

---

## ✅ Step 4: Verify on GitHub

After push completes:
- Go to `github.com/YOUR_USERNAME/docuforge`
- You should see all your files
- README.md displays beautifully
- Green checkmarks on files

---

## 🔐 CI & Safe Pushes (Recommended)

To make sure pushing to GitHub never exposes secrets and that the project builds correctly on every push, the repository includes a GitHub Actions workflow that:

- Installs dependencies (`npm ci`)
- Runs the TypeScript lint/type-check (`npm run lint`)
- Builds client and server (`npm run build`)
- Fails the run if a `.env` file is committed
- Uploads the `dist` build as an artifact

This ensures that any accidental commit that includes sensitive data will be caught by CI and the build will fail locally and on GitHub until fixed.

### Add your `GEMINI_API_KEY` for production

Because you plan to host on your own `.tech` domain (not Vercel/Netlify/etc.), set the `GEMINI_API_KEY` on your server's environment. Example (Linux systemd service):

```bash
# /etc/systemd/system/docuforge.service (example)
[Unit]
Description=DocuForge
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/docuforge
Environment="GEMINI_API_KEY=your_production_key_here"
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

After creating the unit file:

```bash
sudo systemctl daemon-reload
sudo systemctl enable docuforge
sudo systemctl start docuforge
sudo journalctl -u docuforge -f
```

Make sure DNS for your `.tech` domain points to your server public IP (A record) and configure a reverse proxy (nginx) with TLS (Certbot/Let's Encrypt) to serve `dist` and proxy `/api` to the Node server.

If you'd like, I can add an `nginx` sample configuration and the `systemd` file to this repo as examples.
I added example files under the `deploy/` folder and a `deploy` GitHub Actions workflow that can securely copy the built `dist` to your server and restart the service. Files added:

- `deploy/docuforge.service` — example `systemd` unit (edit `Environment` or set it in the server's env)
- `deploy/nginx.conf` — example nginx proxy config for your `.tech` domain
- `.github/workflows/deploy.yml` — example deploy workflow (requires SSH secrets)

Secrets required for the deploy workflow (add these in GitHub Settings → Secrets → Actions):

- `SSH_HOST` — your server IP or hostname
- `SSH_USER` — user with SSH access (and sudo rights to install service)
- `SSH_PRIVATE_KEY` — private key for the `SSH_USER` (no passphrase recommended for automation)
- `SSH_PORT` — optional (defaults to 22)
- `REMOTE_PATH` — target temp path on server (e.g., `/tmp/docuforge-deploy`) — workflow will move files to `/var/www/docuforge` and restart the service

Security notes:

- The deploy action uses SSH keys stored as GitHub Secrets — do NOT store keys in the repo.  
- Ensure the `SSH_USER` has the minimal sudo privileges needed to move the systemd file and restart the service (or install the service as `root` manually).

If you want, I can further customize the workflow to run database migrations, install packages on the server, or perform zero-downtime restarts.

---

## 📦 Step 5: Add Topics (Optional but Good for Discoverability)

On GitHub repo page:
1. Click **"About"** (right sidebar)
2. Add topics: `documentation`, `ai`, `generator`, `saas`, `automation`
3. Click **"Save changes"**

---

## 🎯 Step 6: Setup GitHub Pages (Optional - for Project Website)

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main
4. Folder: /docs
5. Click Save

Now your project has a live website!

---

## 💰 Step 7: Monetization & Growth Strategy

### Phase 1: Build Audience (Months 1-3)
- ✅ GitHub stars (target: 100+ stars)
- ✅ ProductHunt launch
- ✅ Twitter/LinkedIn promotion
- ✅ Dev.to/Medium articles

### Phase 2: MVP SaaS (Months 3-6)
```
Free Tier:
- 5 docs/month
- Basic exports
- No API access

Pro Tier: $9/month
- 50 docs/month
- All export formats
- API access (100 req/month)
- Email support

Enterprise: Custom
- Unlimited docs
- Custom branding
- Priority support
- White-label option
```

### Phase 3: Monetize (Months 6+)
- Launch paid tiers
- API marketplace
- White-label licensing
- Consulting services

---

## 🎓 Student Developer Pack Benefits (GitHub)

Your student pack includes:
- ✅ Private repositories (unlimited)
- ✅ GitHub Pro free (expires 1 year after graduation)
- ✅ $50 GitHub credits for CI/CD
- ✅ Free Namecheap domain (.tech, .xyz, etc.)
- ✅ Digital Ocean $100 credit
- ✅ JetBrains IDEs free

---

## 🚀 Deployment Platforms (Free/Cheap with Student Pack)

### Option 1: Vercel (Best)
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import `docuforge` repository
4. Add environment variable: `GEMINI_API_KEY` using Vercel's dashboard (do NOT commit keys to the repo)
   
   **Security note:** If you have accidentally committed a secret (like `.env`), revoke the exposed key immediately and remove it from your git history. Recommended commands to remove the file from the repo index and push the change:

```powershell
git rm --cached .env
git commit -m "Remove committed .env (secret)"
git push origin main
```

To purge the secret from history, consider using the [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git filter-repo`. After rewriting history you will need to force-push and inform collaborators.
5. Deploy (automatic on every push)

**Cost:** Free tier sufficient for early stage

### Option 2: Railway.app
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Auto-deploys on push

**Cost:** $5/month free credit + usage

### Option 3: Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Connect GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

**Cost:** Free tier perfect for SPA

---

## 📊 Recommended Deployment Flow

```
GitHub (Code Repository)
        ↓
    Vercel (Recommended)
        ↓
   docuforge.vercel.app
```

---

## 💡 Quick Commands for Future Updates

```powershell
# Add changes
git add .

# Commit with message
git commit -m "Feature: Add XYZ"

# Push to GitHub
git push origin main

# View logs
git log --oneline -10

# Create new branch
git checkout -b feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature
```

---

## 🎯 Next Steps After GitHub Deployment

1. ✅ Add project to GitHub
2. ⏳ Launch on ProductHunt (after 100 stars)
3. ⏳ Write Medium/Dev.to articles
4. ⏳ Build landing page (docuforge.com)
5. ⏳ Launch paid SaaS tier
6. ⏳ Scale to $1K MRR
7. ⏳ Build community (Discord)

---

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Rails Guide: https://guides.rubyonrails.org

---

**Happy deploying! 🚀**

Your 4 months of hard work is about to change everything. Let's get DocuForge in front of the world!
