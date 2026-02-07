# How to Get an Access Token (For Your Friend)

Your friend needs to generate an access token that you'll paste into `config.js`.

## Option 1: Quick & Easy (OAuth Playground)

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

2. Click the gear icon ⚙️ in the top right

3. Check "Use your own OAuth credentials"

4. Enter:
   - **OAuth Client ID:** (paste your client ID)
   - **OAuth Client secret:** (paste your client secret)

5. Close settings

6. In "Select & authorize APIs" section:
   - Scroll to **Drive API v3**
   - Check: `https://www.googleapis.com/auth/drive`

7. Click **"Authorize APIs"**

8. Sign in with **UCSD Google account**

9. Click **"Exchange authorization code for tokens"**

10. Copy the **Access token** that appears

11. Send you the access token

## Option 2: Using cURL (Command Line)

Your friend can run these commands:

### Step 1: Get authorization code

Visit this URL in a browser (logged into UCSD account):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=https://www.googleapis.com/auth/drive&access_type=offline
```

After authorizing, you'll be redirected to a URL that looks like:
```
https://hudson-documents-ucsd.vercel.app/?code=4/0Adeu5B...
```

Copy the `code` parameter value.

### Step 2: Exchange for access token

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=PASTE_CODE_HERE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI" \
  -d "grant_type=authorization_code"
```

This will return:
```json
{
  "access_token": "ya29.a0AfB_...",
  "expires_in": 3599,
  "refresh_token": "1//0gQ...",
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer"
}
```

Copy the `access_token` value.

## Adding the Token

Once you have the access token:

1. Open `config.js`
2. Replace `PASTE_ACCESS_TOKEN_HERE` with the actual token
3. Commit and push to GitHub
4. Redeploy on Vercel

## Important Notes:

- **Access tokens expire after ~1 hour**
- When it expires, you'll need to get a new one from your friend
- The token is visible in your source code (public on GitHub)
- Only use this for documents your friend's UCSD account has access to
- If you need a longer-lasting solution, you'd need a backend with refresh tokens
