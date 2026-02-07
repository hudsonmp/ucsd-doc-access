# UCSD Document Access Tool

Copy Google Docs, Sheets, and Slides from UCSD workspace to your personal Google Drive.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Google Cloud Credentials

You need to create OAuth 2.0 credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Desktop app" as application type
   - Download the JSON file
   - Rename it to `credentials.json` and place it in this directory

### 3. Run the Script

```bash
python copy_doc.py
```

On first run, it will:
- Open a browser window for Google authentication
- Ask you to sign in with your hudsonmitchellpullman@gmail.com account
- Request permission to access your Google Drive
- Save authentication token for future use

### Usage

1. Run the script: `python copy_doc.py`
2. Paste the Google Doc/Sheet/Slides URL when prompted
3. Optionally provide a custom name for the copy
4. The copied file will appear in your personal Google Drive

### Supported URL Formats

- `https://docs.google.com/document/d/FILE_ID/edit`
- `https://docs.google.com/spreadsheets/d/FILE_ID/edit`
- `https://docs.google.com/presentation/d/FILE_ID/edit`

## Security Notes

- `credentials.json` contains sensitive information (gitignored)
- `token.pickle` stores your authentication token (gitignored)
- Never commit these files to version control
