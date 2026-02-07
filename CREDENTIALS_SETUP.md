# Getting the Required Credentials

Your friend needs to generate OAuth tokens that the app will use.

## What Your Friend Needs to Provide:

1. **Client ID** (you already have this)
2. **Client Secret** (you already have this)
3. **Access Token** (NEW - needs to generate)
4. **Refresh Token** (NEW - needs to generate)

## How to Get Access & Refresh Tokens:

### Step 1: Create a Simple Script

Your friend should create a file called `get-tokens.js`:

```javascript
import { google } from 'googleapis';
import http from 'http';
import { URL } from 'url';

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = ['https://www.googleapis.com/auth/drive'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('Visit this URL to authorize:', authUrl);

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/callback')) {
    const url = new URL(req.url, 'http://localhost:3000');
    const code = url.searchParams.get('code');

    try {
      const { tokens } = await oauth2Client.getToken(code);

      console.log('\n=== ADD THESE TO VERCEL ENVIRONMENT VARIABLES ===\n');
      console.log('GOOGLE_ACCESS_TOKEN=' + tokens.access_token);
      console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
      console.log('\n=================================================\n');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Success! Check your terminal for the tokens.</h1>');

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 1000);
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.writeHead(500);
      res.end('Error getting tokens');
    }
  }
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
```

### Step 2: Run the Script

```bash
npm install googleapis
node get-tokens.js
```

### Step 3: Authorize

1. Visit the URL shown in the terminal
2. Sign in with the **UCSD Google account**
3. Grant permissions
4. The tokens will be printed in the terminal

### Step 4: Send You the Tokens

Your friend should send you:
- `GOOGLE_ACCESS_TOKEN`
- `GOOGLE_REFRESH_TOKEN`

## Adding to Vercel:

Once you have the tokens:

1. Go to [vercel.com](https://vercel.com/hudsonmp10/ucsd-doc-access)
2. Click **Settings** > **Environment Variables**
3. Add these 4 variables:
   - `GOOGLE_CLIENT_ID`: (your client ID)
   - `GOOGLE_CLIENT_SECRET`: (your client secret)
   - `GOOGLE_ACCESS_TOKEN`: (the token from your friend)
   - `GOOGLE_REFRESH_TOKEN`: (the token from your friend)
4. Click **Save**
5. Redeploy the app

## Security Notes:

- **NEVER** commit these tokens to GitHub
- The refresh token allows the app to get new access tokens automatically
- Only your friend's UCSD account needs to authorize once
- The app will use these credentials to access and copy documents
