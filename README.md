# UCSD Document Access Tool

Web-based tool to copy Google Docs, Sheets, and Slides from UCSD workspace to your personal Google Drive.

## 🌐 Web Application

This is a browser-based app that can be hosted on GitHub Pages!

### Features
- ✨ Clean, modern web interface
- 🔐 Secure Google OAuth authentication
- 📄 Copy Docs, Sheets, and Slides
- 🚀 No backend required - runs entirely in browser
- 📱 Mobile-friendly responsive design

## 🚀 Quick Start

### For You (App User):

1. **Get credentials from your UCSD friend** (see `SETUP.md` for what they need to do)
2. **Update `config.js`** with the Client ID and API Key they provide
3. **Deploy to GitHub Pages** (see `DEPLOYMENT.md`)
4. **Visit your GitHub Pages site** and start copying documents!

### For Your Friend (UCSD Account Holder):

See `SETUP.md` for detailed instructions on creating Google Cloud credentials.

**They need to provide you:**
- OAuth 2.0 Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
- API Key (optional but recommended)

## 📁 Files

- `index.html` - Main web interface
- `app.js` - Application logic and Google API integration
- `config.js` - Configuration file (add your credentials here)
- `SETUP.md` - Instructions for your friend to create credentials
- `DEPLOYMENT.md` - Instructions to deploy to GitHub Pages
- `copy_doc.py` - Legacy Python CLI version (optional)

## 🔒 Security

- OAuth Client ID is public and safe to commit
- API Key should be restricted to Google Drive API only
- Authentication happens in the browser using Google's secure OAuth flow
- You authenticate with YOUR personal Google account
- Your friend's UCSD credentials are only used to create the OAuth app, not stored anywhere

## 📖 How It Works

1. You sign in with your personal Google account (hudsonmitchellpullman@gmail.com)
2. The app requests permission to access your Google Drive
3. You paste a UCSD document URL
4. The app copies it to your personal Drive using the API

## 🛠️ Local Testing

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

Make sure your friend adds `http://localhost:8000` to the OAuth authorized origins!
