# Deploying to Vercel

## ⚠️ IMPORTANT: Update OAuth Settings First!

Before the app will work on Vercel, your friend needs to update the OAuth settings:

### Required Fix:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on the OAuth 2.0 Client ID
4. Under **"Authorized JavaScript origins"**, ADD:
   - `https://hudson-documents-ucsd.vercel.app`

Currently it only has `https://localhost:8000` which will only work locally!

5. Click **Save**

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your `ucsd-doc-access` repository
5. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
6. Click **"Deploy"**

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Deploy!

# To deploy to production
vercel --prod
```

## After Deployment

1. Your site will be live at: `https://hudson-documents-ucsd.vercel.app/`
2. Test it:
   - Click "Sign in with Google"
   - Authenticate with your hudsonmitchellpullman@gmail.com account
   - Paste a UCSD document URL
   - Copy it!

## Troubleshooting

### "Error: redirect_uri_mismatch" or OAuth errors

This means the JavaScript origin isn't configured correctly. Make sure:
- `https://hudson-documents-ucsd.vercel.app` is in **Authorized JavaScript origins**
- There's no trailing slash
- Wait 5 minutes after saving changes in Google Cloud Console

### Can't access UCSD documents

Make sure:
- You're using a valid UCSD Google Doc/Sheet/Slides URL
- The document sharing settings allow access
- You've authenticated with your personal Google account

## Local Testing

To test locally before deploying:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` (this will work because localhost is already authorized)
