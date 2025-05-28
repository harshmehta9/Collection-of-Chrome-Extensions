# Text Highlighter Chrome Extension

A simple Chrome browser extension that allows users to highlight selected text on any webpage with a yellow background.

## Features

- Highlight any selected text on a webpage
- Simple one-click operation through browser action popup
- Yellow highlighting with black text for better readability
- Works on any website

## Files Structure

```
├── manifest.json          # Extension configuration and permissions
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality and script injection
├── content.js             # Text highlighting logic
└── icons/
    └── icon.png           # Extension icon
```

## How It Works

1. **User Interface**: The extension provides a popup ([popup.html](popup.html)) with a "Start Highlighter" button
2. **Script Injection**: When clicked, [popup.js](popup.js) injects the content script into the active tab
3. **Text Highlighting**: [content.js](content.js) captures the user's text selection and wraps it in a yellow-highlighted span element

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this extension folder
5. The Text Highlighter icon should appear in your browser toolbar

## Usage

1. Select any text on a webpage
2. Click the Text Highlighter extension icon
3. Click the "Start Highlighter" button in the popup
4. The selected text will be highlighted in yellow

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: 
  - `scripting`: Required to inject content scripts
  - `activeTab`: Required to access the current tab's content
- **Limitations**: Currently works best with single-element text selections

## Code Overview

- [`popup.js`](popup.js): Handles the extension popup and script execution
- [`content.js`](content.js): Contains the core highlighting functionality using DOM manipulation
- [`manifest.json`](manifest.json): Extension configuration with required permissions
- [`popup.html`](popup.html): Simple HTML interface for the extension popup
