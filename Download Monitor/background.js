// Background service worker for monitoring downloads
chrome.runtime.onInstalled.addListener(() => {
  console.log('Download Monitor extension installed');
});

// Listen for download events
chrome.downloads.onCreated.addListener((downloadItem) => {
  const downloadInfo = {
    id: downloadItem.id,
    filename: downloadItem.filename,
    url: downloadItem.url,
    state: downloadItem.state,
    startTime: new Date().toISOString(),
    timestamp: Date.now(),
    fileSize: downloadItem.fileSize || 'Unknown'
  };

  // Store the download information
  storeDownloadInfo(downloadInfo);
  console.log('Download started:', downloadInfo);
});

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    updateDownloadStatus(delta.id, 'completed', new Date().toISOString());
    console.log('Download completed:', delta.id);
  } else if (delta.state && delta.state.current === 'interrupted') {
    updateDownloadStatus(delta.id, 'interrupted', new Date().toISOString());
    console.log('Download interrupted:', delta.id);
  }
});

// Listen for when downloads are erased (deleted)
chrome.downloads.onErased.addListener((downloadId) => {
  console.log('Download erased:', downloadId);
  // Remove from our local storage when erased from Chrome
  removeFromLocalStorage(downloadId);
});

// Function to store download information
function storeDownloadInfo(downloadInfo) {
  chrome.storage.local.get(['downloads'], (result) => {
    const downloads = result.downloads || [];
    downloads.push(downloadInfo);
    
    chrome.storage.local.set({ downloads: downloads }, () => {
      console.log('Download info stored');
    });
  });
}

// Function to update download status
function updateDownloadStatus(downloadId, status, endTime) {
  chrome.storage.local.get(['downloads'], (result) => {
    const downloads = result.downloads || [];
    const downloadIndex = downloads.findIndex(download => download.id === downloadId);
    
    if (downloadIndex !== -1) {
      downloads[downloadIndex].status = status;
      downloads[downloadIndex].endTime = endTime;
      downloads[downloadIndex].duration = calculateDuration(
        downloads[downloadIndex].startTime, 
        endTime
      );
      
      chrome.storage.local.set({ downloads: downloads }, () => {
        console.log('Download status updated');
      });
    }
  });
}

// Function to remove download from local storage when erased
function removeFromLocalStorage(downloadId) {
  chrome.storage.local.get(['downloads'], (result) => {
    const downloads = result.downloads || [];
    const updatedDownloads = downloads.filter(download => download.id !== downloadId);
    
    chrome.storage.local.set({ downloads: updatedDownloads }, () => {
      console.log('Download removed from local storage:', downloadId);
    });
  });
}

// Function to calculate download duration
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Function to clean up old downloads (optional - keeps last 100 downloads)
function cleanupOldDownloads() {
  chrome.storage.local.get(['downloads'], (result) => {
    const downloads = result.downloads || [];
    if (downloads.length > 100) {
      const recentDownloads = downloads.slice(-100);
      chrome.storage.local.set({ downloads: recentDownloads });
    }
  });
}

// Clean up old downloads every hour
setInterval(cleanupOldDownloads, 60 * 60 * 1000);
