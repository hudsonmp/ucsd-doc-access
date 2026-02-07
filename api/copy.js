// Vercel serverless function to copy Google Drive documents
import { google } from 'googleapis';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, newName } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Extract file ID from URL
    const fileId = extractFileId(url);
    if (!fileId) {
      return res.status(400).json({ error: 'Invalid Google Drive URL' });
    }

    // Initialize Google Drive API with stored credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Get original file info
    const originalFile = await drive.files.get({
      fileId: fileId,
      fields: 'name,mimeType',
    });

    const originalName = originalFile.data.name;
    const mimeType = originalFile.data.mimeType;

    // Copy the file
    const copiedFile = await drive.files.copy({
      fileId: fileId,
      requestBody: {
        name: newName || `Copy of ${originalName}`,
      },
      fields: 'id,name,webViewLink',
    });

    return res.status(200).json({
      success: true,
      file: {
        id: copiedFile.data.id,
        name: copiedFile.data.name,
        url: copiedFile.data.webViewLink,
        originalName: originalName,
        type: getMimeTypeLabel(mimeType),
      },
    });

  } catch (error) {
    console.error('Error copying file:', error);

    let errorMessage = 'Failed to copy document';
    let statusCode = 500;

    if (error.code === 404) {
      errorMessage = 'Document not found or not accessible';
      statusCode = 404;
    } else if (error.code === 403) {
      errorMessage = 'Permission denied. Check if credentials have access to this document.';
      statusCode = 403;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(statusCode).json({
      error: errorMessage,
      details: error.message
    });
  }
}

function extractFileId(url) {
  const patterns = [
    /\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/folders\/([a-zA-Z0-9-_]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

function getMimeTypeLabel(mimeType) {
  const types = {
    'application/vnd.google-apps.document': 'Google Doc',
    'application/vnd.google-apps.spreadsheet': 'Google Sheet',
    'application/vnd.google-apps.presentation': 'Google Slides',
    'application/vnd.google-apps.folder': 'Folder',
  };
  return types[mimeType] || 'File';
}
