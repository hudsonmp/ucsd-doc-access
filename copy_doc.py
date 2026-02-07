#!/usr/bin/env python3
"""
Google Drive Document Copier
Copies Google Docs, Sheets, and Slides from UCSD workspace to personal Google Drive
"""

import os
import re
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import pickle

SCOPES = ['https://www.googleapis.com/auth/drive']

def get_file_id_from_url(url):
    """Extract file ID from Google Drive URL"""
    patterns = [
        r'/d/([a-zA-Z0-9-_]+)',
        r'id=([a-zA-Z0-9-_]+)',
        r'/folders/([a-zA-Z0-9-_]+)'
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None

def authenticate():
    """Authenticate and return Google Drive service"""
    creds = None

    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                print("ERROR: credentials.json not found!")
                print("Please download your OAuth 2.0 credentials and save as 'credentials.json'")
                return None

            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('drive', 'v3', credentials=creds)

def copy_file(service, file_id, new_name=None):
    """Copy a Google Drive file"""
    try:
        original_file = service.files().get(fileId=file_id, fields='name,mimeType').execute()
        file_name = original_file.get('name')
        mime_type = original_file.get('mimeType')

        print(f"\nFound file: {file_name}")
        print(f"Type: {mime_type}")

        if new_name is None:
            new_name = f"Copy of {file_name}"

        body = {'name': new_name}

        copied_file = service.files().copy(fileId=file_id, body=body, fields='id,name,webViewLink').execute()

        print(f"\n✓ Successfully copied!")
        print(f"New file: {copied_file.get('name')}")
        print(f"Link: {copied_file.get('webViewLink')}")

        return copied_file

    except HttpError as error:
        print(f"\n✗ Error copying file: {error}")
        if error.resp.status == 404:
            print("File not found. Make sure you have access to the file.")
        elif error.resp.status == 403:
            print("Permission denied. Make sure you have permission to access this file.")
        return None

def main():
    print("=" * 60)
    print("Google Drive Document Copier")
    print("=" * 60)

    service = authenticate()
    if not service:
        return

    print("\nAuthenticated successfully!")

    url = input("\nEnter Google Doc/Sheet/Slides URL: ").strip()

    file_id = get_file_id_from_url(url)
    if not file_id:
        print("✗ Could not extract file ID from URL")
        return

    print(f"File ID: {file_id}")

    custom_name = input("\nEnter new name (or press Enter for default 'Copy of...'): ").strip()
    new_name = custom_name if custom_name else None

    copy_file(service, file_id, new_name)

if __name__ == '__main__':
    main()
