// Google API client
let gapiInited = false;
let gisInited = false;
let tokenClient;
let accessToken = null;

// Initialize Google API
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: CONFIG.API_KEY,
            discoveryDocs: CONFIG.DISCOVERY_DOCS,
        });
        gapiInited = true;
        maybeEnableButtons();
    } catch (err) {
        showStatus('Error loading Google API: ' + err.message, 'error');
    }
}

// Initialize Google Identity Services
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.CLIENT_ID,
        scope: CONFIG.SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorizeButton').disabled = false;
    }
}

// Handle authorization
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            showStatus('Authorization error: ' + resp.error, 'error');
            return;
        }
        accessToken = resp.access_token;
        gapi.client.setToken({access_token: accessToken});

        showStatus('Successfully authenticated!', 'success');
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('mainSection').classList.remove('hidden');
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

// Extract file ID from URL
function getFileIdFromUrl(url) {
    const patterns = [
        /\/d\/([a-zA-Z0-9-_]+)/,
        /id=([a-zA-Z0-9-_]+)/,
        /\/folders\/([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

// Copy the document
async function copyDocument() {
    const url = document.getElementById('docUrl').value.trim();
    const newName = document.getElementById('newName').value.trim();

    if (!url) {
        showStatus('Please enter a document URL', 'error');
        return;
    }

    const fileId = getFileIdFromUrl(url);
    if (!fileId) {
        showStatus('Invalid URL. Could not extract file ID.', 'error');
        return;
    }

    document.getElementById('copyButton').disabled = true;
    showStatus('Copying document...', 'info');

    try {
        // Get original file metadata
        const originalFile = await gapi.client.drive.files.get({
            fileId: fileId,
            fields: 'name,mimeType'
        });

        const originalName = originalFile.result.name;
        const mimeType = originalFile.result.mimeType;

        showStatus(`Found: ${originalName} (${getMimeTypeLabel(mimeType)})`, 'info');

        // Copy the file
        const copyRequest = {
            fileId: fileId,
            resource: {
                name: newName || `Copy of ${originalName}`
            },
            fields: 'id,name,webViewLink'
        };

        const copiedFile = await gapi.client.drive.files.copy(copyRequest);

        // Show success
        showStatus('Successfully copied!', 'success');
        showResult(copiedFile.result);

    } catch (error) {
        console.error('Error:', error);
        let errorMsg = 'Failed to copy document. ';

        if (error.status === 404) {
            errorMsg += 'File not found or you don\'t have access to it.';
        } else if (error.status === 403) {
            errorMsg += 'Permission denied. Make sure you have access to this file.';
        } else {
            errorMsg += error.message || 'Unknown error';
        }

        showStatus(errorMsg, 'error');
    } finally {
        document.getElementById('copyButton').disabled = false;
    }
}

// Helper functions
function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove('hidden');
}

function showResult(file) {
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = `
        <strong>✓ Copy Created!</strong><br>
        <strong>Name:</strong> ${file.name}<br>
        <strong>Link:</strong> <a href="${file.webViewLink}" target="_blank">Open in Google Drive</a>
    `;
    resultEl.classList.remove('hidden');
}

function getMimeTypeLabel(mimeType) {
    const types = {
        'application/vnd.google-apps.document': 'Google Doc',
        'application/vnd.google-apps.spreadsheet': 'Google Sheet',
        'application/vnd.google-apps.presentation': 'Google Slides',
        'application/vnd.google-apps.folder': 'Folder'
    };
    return types[mimeType] || 'File';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('authorizeButton').addEventListener('click', handleAuthClick);
    document.getElementById('copyButton').addEventListener('click', copyDocument);

    // Load Google API
    gapiLoaded();
});

// Load Google Identity Services
if (typeof google !== 'undefined') {
    gisLoaded();
} else {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = gisLoaded;
    document.head.appendChild(script);
}
