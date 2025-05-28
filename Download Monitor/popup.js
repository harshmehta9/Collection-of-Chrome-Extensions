// Popup script for displaying download history
document.addEventListener('DOMContentLoaded', function() {
    loadDownloads();
    setupEventListeners();
    updateStats();
});

function setupEventListeners() {
    // Clear history button
    document.getElementById('clearBtn').addEventListener('click', clearHistory);
    
    // Export data button
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

function loadDownloads() {
    chrome.storage.local.get(['downloads'], (result) => {
        const downloads = result.downloads || [];
        displayDownloads(downloads);
        updateStats(downloads);
    });
}

function displayDownloads(downloads) {
    const downloadsList = document.getElementById('downloadsList');
    const noDownloads = document.getElementById('noDownloads');
    
    if (downloads.length === 0) {
        downloadsList.style.display = 'none';
        noDownloads.style.display = 'block';
        return;
    }
    
    downloadsList.style.display = 'block';
    noDownloads.style.display = 'none';
    
    // Sort downloads by timestamp (newest first)
    const sortedDownloads = downloads.sort((a, b) => b.timestamp - a.timestamp);
    
    downloadsList.innerHTML = sortedDownloads.map(download => createDownloadItem(download)).join('');
    
    // Add event listeners for delete buttons
    setupDeleteButtons();
}

function createDownloadItem(download) {
    const startTime = new Date(download.startTime);
    const filename = download.filename || extractFilenameFromUrl(download.url);
    const status = download.status || 'in_progress';
    const fileSize = formatFileSize(download.fileSize);
    const duration = download.duration || 'In progress...';
    
    return `
        <div class="download-item" data-download-id="${download.id}">
            <div class="download-header">
                <div class="download-title-section">
                    <div class="download-filename" title="${filename}">${truncateText(filename, 30)}</div>
                </div>
                <div class="download-actions">
                    <button class="delete-btn" data-download-id="${download.id}" title="Delete this download">🗑️ Delete</button>
                    <span class="download-status status-${status}">${status.replace('_', ' ')}</span>
                </div>
            </div>
            <div class="download-details">
                <div class="download-time">📅 ${formatDateTime(startTime)}</div>
                <div>📏 Size: ${fileSize}</div>
                <div>⏱️ Duration: ${duration}</div>
                <a href="${download.url}" class="download-url" target="_blank" title="${download.url}">
                    🔗 ${truncateText(download.url, 40)}
                </a>
            </div>
        </div>
    `;
}

function updateStats(downloads = null) {
    if (!downloads) {
        chrome.storage.local.get(['downloads'], (result) => {
            updateStats(result.downloads || []);
        });
        return;
    }
    
    const totalDownloads = downloads.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDownloads = downloads.filter(download => {
        const downloadDate = new Date(download.startTime);
        downloadDate.setHours(0, 0, 0, 0);
        return downloadDate.getTime() === today.getTime();
    }).length;
    
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('todayDownloads').textContent = todayDownloads;
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    chrome.storage.local.get(['downloads'], (result) => {
        const downloads = result.downloads || [];
        
        if (!searchTerm) {
            displayDownloads(downloads);
            return;
        }
        
        const filteredDownloads = downloads.filter(download => {
            const filename = (download.filename || extractFilenameFromUrl(download.url)).toLowerCase();
            const url = download.url.toLowerCase();
            return filename.includes(searchTerm) || url.includes(searchTerm);
        });
        
        displayDownloads(filteredDownloads);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all download history?')) {
        chrome.storage.local.set({ downloads: [] }, () => {
            loadDownloads();
            console.log('Download history cleared');
        });
    }
}

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const downloadId = parseInt(button.getAttribute('data-download-id'));
            deleteDownload(downloadId);
        });
    });
}

function deleteDownload(downloadId) {
    if (!confirm('Are you sure you want to delete this download from the history and remove the file?')) {
        return;
    }

    // Disable the delete button to prevent multiple clicks
    const deleteBtn = document.querySelector(`[data-download-id="${downloadId}"]`);
    if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = '🗑️ Deleting...';
    }

    // First, try to remove the file from Chrome's downloads
    chrome.downloads.removeFile(downloadId, () => {
        if (chrome.runtime.lastError) {
            console.warn('Could not remove file:', chrome.runtime.lastError.message);
            // Continue with removing from history even if file removal fails
        }
        
        // Remove from Chrome's download shelf
        chrome.downloads.erase({ id: downloadId }, () => {
            if (chrome.runtime.lastError) {
                console.warn('Could not erase from download shelf:', chrome.runtime.lastError.message);
            }
            
            // Remove from our local storage
            removeFromLocalHistory(downloadId);
        });
    });
}

function removeFromLocalHistory(downloadId) {
    chrome.storage.local.get(['downloads'], (result) => {
        const downloads = result.downloads || [];
        const updatedDownloads = downloads.filter(download => download.id !== downloadId);
        
        chrome.storage.local.set({ downloads: updatedDownloads }, () => {
            console.log('Download removed from history');
            loadDownloads(); // Refresh the display
        });
    });
}

function exportData() {
    chrome.storage.local.get(['downloads'], (result) => {
        const downloads = result.downloads || [];
        
        if (downloads.length === 0) {
            alert('No download data to export');
            return;
        }
        
        const csvContent = generateCSV(downloads);
        downloadCSV(csvContent, 'download-history.csv');
    });
}

function generateCSV(downloads) {
    const headers = ['Filename', 'URL', 'Start Time', 'End Time', 'Status', 'Duration', 'File Size'];
    const csvRows = [headers.join(',')];
    
    downloads.forEach(download => {
        const filename = (download.filename || extractFilenameFromUrl(download.url)).replace(/"/g, '""');
        const row = [
            `"${filename}"`,
            `"${download.url}"`,
            `"${download.startTime}"`,
            `"${download.endTime || 'N/A'}"`,
            `"${download.status || 'in_progress'}"`,
            `"${download.duration || 'N/A'}"`,
            `"${download.fileSize || 'Unknown'}"`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Utility functions
function extractFilenameFromUrl(url) {
    try {
        const pathname = new URL(url).pathname;
        return pathname.split('/').pop() || 'Unknown file';
    } catch {
        return 'Unknown file';
    }
}

function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 'Unknown') return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
