# Download Monitor Chrome Extension

A Chrome extension that monitors and tracks user downloads with timestamps, providing detailed download history and analytics.

## Features

- 📥 **Real-time Download Monitoring**: Automatically tracks all downloads initiated through Chrome
- 🕒 **Timestamp Tracking**: Records exact start and end times for each download
- 📊 **Download Statistics**: Shows total downloads and daily counts
- 🔍 **Search Functionality**: Easily search through download history
- 📁 **File Information**: Displays filename, file size, download duration, and source URL
- 🗑️ **Delete Downloads**: Remove individual downloads from history and delete files
- 💾 **Data Export**: Export download history to CSV format
- 🧹 **History Management**: Clear download history when needed
- 🎨 **Modern UI**: Clean and intuitive interface

### Basic Usage

1. **Access the Extension**: Click the Download Monitor icon in your Chrome toolbar
2. **View Downloads**: See all your downloads listed with timestamps and details
3. **Search Downloads**: Use the search bar to find specific files
4. **Delete Individual Downloads**: Click the "🗑️ Delete" button to remove a download from history and delete the file
5. **Export Data**: Click "Export Data" to download your history as a CSV file
6. **Clear History**: Use "Clear History" to remove all tracked downloads

### Understanding the Interface

- **Header**: Shows the extension name and control buttons
- **Statistics**: Displays total downloads and today's download count
- **Search Bar**: Type to filter downloads by filename or URL
- **Download List**: Shows each download with:
  - 📁 Filename
  - 📅 Date and time
  - 📏 File size
  - ⏱️ Download duration
  - 🔗 Source URL
  - 🗑️ Delete button to remove download and file
  - Status indicator (completed, interrupted, in progress)

### Download Status Indicators

- **Completed**: Green badge - Download finished successfully
- **Interrupted**: Red badge - Download was stopped or failed
- **In Progress**: Yellow badge - Download is currently active

## Permissions Explained

This extension requires the following permissions:

- **downloads**: To monitor download events and access download information
- **downloads.shelf**: To remove downloads from Chrome's download shelf
- **storage**: To save download history locally in your browser

## Privacy

- All data is stored locally in your browser
- No information is sent to external servers
- Download history remains private to your browser instance
- Data can be cleared at any time using the "Clear History" button

### Data Storage

The extension stores download information including:
- Download ID
- Filename
- Source URL
- Start timestamp
- End timestamp (when completed)
- File size
- Download status
- Duration

### Automatic Cleanup

The extension automatically maintains the last 100 downloads to prevent excessive storage usage. Older downloads are automatically removed.

### Extension Not Working

1. Check that the extension is enabled in `chrome://extensions/`
2. Ensure the extension has the required permissions
3. Try disabling and re-enabling the extension
4. Reload the extension if you're in developer mode

### Downloads Not Appearing

1. Make sure you're downloading files through Chrome (not external download managers)
2. Check if the extension has the "downloads" permission
3. Try restarting Chrome and testing with a small file download

### Popup Not Opening

1. Right-click the extension icon and check if it's enabled
2. Try pinning the extension to the toolbar
3. Check the Chrome extensions page for any error messages


### Building from Source

1. Clone the repository
2. No build process required - the extension uses vanilla JavaScript
3. Load the extension in developer mode for testing

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with various download scenarios
5. Submit a pull request

## Version History

- **v1.0**: Initial release with basic download monitoring and history tracking

## Browser Compatibility

- Chrome (Manifest V3)
- Chromium-based browsers that support Manifest V3

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the project repository or contact the developer.

---

**Note**: This extension only monitors downloads initiated through Chrome. Downloads from external applications or direct file transfers will not be tracked.
