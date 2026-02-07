# Setup Instructions for Your Friend (UCSD Account Holder)

Your friend needs to create Google Cloud credentials and share them with you.

## Steps for Your Friend:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with their UCSD Google account
3. Create a new project or select an existing one
4. Note the project name

### 2. Enable Google Drive API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google Drive API"**
3. Click on it and press **"Enable"**

### 3. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. If prompted to configure consent screen:
   - Choose **"Internal"** (for UCSD only) or **"External"** (for anyone)
   - Fill in app name: "UCSD Document Copier"
   - Add their email
   - Add scopes: `../auth/drive` (Google Drive API)
   - Save and continue
4. Back to Create OAuth client ID:
   - Application type: **"Web application"**
   - Name: "UCSD Doc Copier Web"
   - **Authorized JavaScript origins:**
     - `http://localhost:8000` (for local testing)
     - `https://YOUR_GITHUB_USERNAME.github.io` (replace with your actual GitHub Pages URL)
   - **Authorized redirect URIs:** (leave empty for now, not needed for implicit flow)
   - Click **"Create"**

### 4. Get the Client ID

1. After creating, you'll see a popup with:
   - **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - Client Secret (not needed for web apps, but shown)
2. Copy the **Client ID**

### 5. (Optional) Create API Key

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"API key"**
3. Copy the API key
4. Click "Restrict Key" and select "Google Drive API" only (recommended)

## What to Share with You:

Your friend should send you:

1. **OAuth 2.0 Client ID** (required)
   - Example: `123456789-abc123.apps.googleusercontent.com`
2. **API Key** (optional but recommended)
   - Example: `AIzaSyAbc123...`

## What You Need to Do:

1. Open `config.js` in this repository
2. Replace `YOUR_CLIENT_ID_HERE` with the Client ID
3. Replace `YOUR_API_KEY_HERE` with the API Key (if provided)
4. Commit and push to GitHub
5. Enable GitHub Pages (see DEPLOYMENT.md)

## Security Notes:

- The Client ID is safe to be public (it will be in your GitHub repo)
- The API Key should be restricted to only Google Drive API
- Never share the Client Secret (though it's not used in browser apps)
- The OAuth flow ensures users authenticate with their own Google account
