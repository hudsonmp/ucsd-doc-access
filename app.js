// Frontend-only Google Drive copier using hardcoded access token

let gapi;

// Load Google API
function loadGoogleAPI() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            gapi = window.gapi;
            gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey: CONFIG.API_KEY || '',
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                });

                // Set the access token
                if (CONFIG.ACCESS_TOKEN && CONFIG.ACCESS_TOKEN !== 'PASTE_ACCESS_TOKEN_HERE') {
                    gapi.client.setToken({ access_token: CONFIG.ACCESS_TOKEN });
                }

                resolve();
            });
        };
        document.head.appendChild(script);
    });
}

function extractFileId(url) {
    const patterns = [
        /\/d\/([a-zA-Z0-9-_]+)/,
        /id=([a-zA-Z0-9-_]+)/,
        /\/folders\/([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
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

async function copyDocument() {
    const url = document.getElementById('docUrl').value.trim();
    const newName = document.getElementById('newName').value.trim();

    if (!url) {
        showStatus('Please enter a document URL', 'error');
        return;
    }

    // Check if access token is configured
    if (!CONFIG.ACCESS_TOKEN || CONFIG.ACCESS_TOKEN === 'PASTE_ACCESS_TOKEN_HERE') {
        showStatus('Error: Access token not configured. Check config.js', 'error');
        return;
    }

    const fileId = extractFileId(url);
    if (!fileId) {
        showStatus('Invalid URL. Could not extract file ID.', 'error');
        return;
    }

    document.getElementById('copyButton').disabled = true;
    document.getElementById('copyButton').textContent = 'Copying...';
    showStatus('Copying document...', 'info');
    hideResult();

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
        const copiedFile = await gapi.client.drive.files.copy({
            fileId: fileId,
            resource: {
                name: newName || `Copy of ${originalName}`
            },
            fields: 'id,name,webViewLink'
        });

        showStatus('Successfully copied!', 'success');
        showResult({
            id: copiedFile.result.id,
            name: copiedFile.result.name,
            url: copiedFile.result.webViewLink,
            originalName: originalName,
            type: getMimeTypeLabel(mimeType)
        });

        // Clear inputs
        document.getElementById('docUrl').value = '';
        document.getElementById('newName').value = '';

    } catch (error) {
        console.error('Error:', error);
        let errorMsg = 'Failed to copy document. ';

        if (error.status === 404) {
            errorMsg += 'File not found or not accessible.';
        } else if (error.status === 403) {
            errorMsg += 'Permission denied. Check if the access token has access to this file.';
        } else if (error.status === 401) {
            errorMsg += 'Access token expired or invalid. Please refresh the token in config.js';
        } else {
            errorMsg += error.message || 'Unknown error';
        }

        showStatus(errorMsg, 'error');
    } finally {
        document.getElementById('copyButton').disabled = false;
        document.getElementById('copyButton').textContent = 'Copy Document';
    }
}

function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove('hidden');
}

function hideResult() {
    const resultEl = document.getElementById('result');
    resultEl.classList.add('hidden');
}

function showResult(file) {
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = `
        <strong>✓ Copy Created!</strong><br>
        <strong>Original:</strong> ${file.originalName} (${file.type})<br>
        <strong>New Name:</strong> ${file.name}<br>
        <strong>Link:</strong> <a href="${file.url}" target="_blank" rel="noopener noreferrer">Open in new tab</a>
    `;
    resultEl.classList.remove('hidden');

    // Auto-open in new tab
    window.open(file.url, '_blank', 'noopener,noreferrer');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    showStatus('Loading...', 'info');

    try {
        await loadGoogleAPI();
        showStatus('Ready! Paste a document URL to copy.', 'success');
    } catch (error) {
        showStatus('Error loading Google API: ' + error.message, 'error');
    }

    document.getElementById('copyButton').addEventListener('click', copyDocument);

    // Allow Enter key to submit
    document.getElementById('docUrl').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') copyDocument();
    });

    document.getElementById('newName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') copyDocument();
    });
});
