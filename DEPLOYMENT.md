# Deployment to GitHub Pages

## Step 1: Update Configuration

1. Open `config.js`
2. Replace `YOUR_CLIENT_ID_HERE` with the Client ID from your friend
3. Replace `YOUR_API_KEY_HERE` with the API Key from your friend

## Step 2: Push to GitHub

```bash
# Add your changes
git add config.js

# Commit
git commit -m "Add Google API credentials"

# Create a GitHub repository (if not already created)
# Go to https://github.com/new and create a repo named "ucsd-doc-access"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/ucsd-doc-access.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll to **"Pages"** in the left sidebar
4. Under "Source":
   - Select **"Deploy from a branch"**
   - Choose **"main"** branch
   - Choose **"/ (root)"** folder
   - Click **"Save"**

5. Wait a few minutes for deployment
6. Your site will be available at:
   - `https://YOUR_USERNAME.github.io/ucsd-doc-access/`

## Step 4: Update OAuth Authorized Origins

After you have your GitHub Pages URL:

1. Your friend needs to go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **"APIs & Services"** > **"Credentials"**
3. Click on the OAuth 2.0 Client ID they created
4. Add to **"Authorized JavaScript origins"**:
   - `https://YOUR_USERNAME.github.io`
5. Click **"Save"**

## Usage

1. Visit your GitHub Pages URL
2. Click "Sign in with Google"
3. Authenticate with your `hudsonmitchellpullman@gmail.com` account
4. Paste any UCSD Google Doc/Sheet/Slides URL
5. Click "Copy Document"
6. The copy will appear in your personal Google Drive!

## Local Testing

To test locally before deploying:

```bash
# Start a local server
python3 -m http.server 8000

# Visit http://localhost:8000 in your browser
```

Make sure `http://localhost:8000` is added to the OAuth authorized origins.
