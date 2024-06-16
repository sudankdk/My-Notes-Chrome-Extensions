# Chrome Notes Extension

This is a simple Chrome extension to manage notes. It allows users to create, and delete notes that are stored using the `chrome.storage.sync` API.

## Features

- Add new notes with a text and category.
- Delete notes.
- Search notes by text or category.

## Installation

1. Clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where you cloned the repository.

## Usage

1. Click the extension icon in the Chrome toolbar to open the popup.
2. Add a new note by entering text and selecting a category, then click "Save".
3. Delete notes using the buttons next to each note.
4. Use the search input to filter notes by text or category.

## Code Overview

- `background.js`: Handles storing and retrieving notes from `chrome.storage.sync`.
- `popup.js`: Manages the user interface for adding, editing, deleting, and searching notes.

## Contributing

Feel free to fork the repository and submit pull requests. If you find any bugs or have feature requests, please open an issue.
