# Railway Configuration for DocuForge

## 🚀 Quick Setup (2 Minutes)

### Step 1: Navigate to Variables
Open this link: **https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14/service/cde0cfa0-0fc3-459a-94ab-df176ad66e36/variables**

Or manually:
1. Go to railway.com
2. Click your project
3. Select "DocuForge" service  
4. Click "Variables" tab

### Step 2: Update/Add GEMINI_API_KEY

**Look for existing "GEMINI_API_KEY" variable:**
- Click the **⋮** (menu) button next to it
- Select **Edit**  
- Replace with: `<API key will be provided>`
- Click **Save**

**If GEMINI_API_KEY doesn't exist:**
- Click **"New Variable"**
- Name: `GEMINI_API_KEY`
- Value: `<API key will be provided>`
- Click **Create**

### Step 3: Verify NODE_ENV is set

Look for `NODE_ENV` variable:
- Should be: `production`
- If missing or wrong, create/update it

### Step 4: Redeploy

After setting variables:
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **Redeploy** button

**OR** push a new commit to GitHub (Railway auto-redeploys):
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin master
```

### Step 5: Test

Wait 2-3 minutes for deployment, then:
1. Open: **https://docuforge-production-4290.up.railway.app/**
2. Fill in test project details:
   - Title: "Test Documentation"
   - Description: "Testing the deployment"
   - Scale: "Startup"
3. Click **Generate Documentation**
4. Should see docs appear in 5-10 seconds

## ❌ If Still Getting 502 Error

**Check these:**
1. **API Key**: Visit https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14/service/cde0cfa0-0fc3-459a-94ab-df176ad66e36/variables
   - Is GEMINI_API_KEY set?
   - Is it complete (should start with `AQ.`)?

2. **Logs**: Check deployment logs
   - Go to: https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14/service/cde0cfa0-0fc3-459a-94ab-df176ad66e36
   - Look for error messages

3. **Recent Commits**: Ensure latest code was deployed
   - Should see timestamp of latest deployment
   - Should be from today

## 🔧 Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| GEMINI_API_KEY | `<your api key>` | ✅ YES |
| NODE_ENV | `production` | ✅ YES |
| PORT | `3000` | ⚠️ Auto-set by Railway |
| APP_URL | Domain URL | 🟡 Optional |

## 📝 Direct Links

- **Variables**: https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14/service/cde0cfa0-0fc3-459a-94ab-df176ad66e36/variables
- **Deployments**: https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14/service/cde0cfa0-0fc3-459a-94ab-df176ad66e36
- **Logs**: https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14/logs
- **Live App**: https://docuforge-production-4290.up.railway.app/

---

**Status**: ✅ Code deployed to Railway, waiting for environment configuration
