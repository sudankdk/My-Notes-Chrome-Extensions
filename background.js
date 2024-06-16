chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ notes: [] }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error initializing notes:", chrome.runtime.lastError);
    } else {
      console.log("Initialized with empty notes");
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== "object" || !message.action) {
    console.error("Invalid message received:", message);
    sendResponse({ error: "Invalid message" });
    return;
  }

  switch (message.action) {
    case "getNotes":
      getNotes(sendResponse);
      break;
    case "saveNote":
      if (
        !message.note ||
        typeof message.note !== "object" ||
        !message.note.text
      ) {
        sendResponse({ error: "Invalid note data" });
        return;
      }
      saveNote(message.note, sendResponse);
      break;
    case "deleteNote":
      if (typeof message.index !== "number" || message.index < 0) {
        sendResponse({ error: "Invalid index for deletion" });
        return;
      }
      deleteNote(message.index, sendResponse);
      break;
    default:
      console.error("Unknown action:", message.action);
      sendResponse({ error: "Unknown action" });
      return;
  }

  return true; // Will respond asynchronously.
});

function getNotes(sendResponse) {
  chrome.storage.sync.get("notes", (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving notes:", chrome.runtime.lastError);
      sendResponse({ error: "Failed to retrieve notes" });
    } else {
      sendResponse(result.notes || []);
    }
  });
}

function saveNote(note, sendResponse) {
  chrome.storage.sync.get("notes", (result) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error retrieving notes for saving:",
        chrome.runtime.lastError
      );
      sendResponse({ error: "Failed to save note" });
      return;
    }

    const notes = Array.isArray(result.notes) ? result.notes : [];
    notes.push(note);

    chrome.storage.sync.set({ notes: notes }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving note:", chrome.runtime.lastError);
        sendResponse({ error: "Failed to save note" });
      } else {
        sendResponse(notes);
      }
    });
  });
}

function deleteNote(index, sendResponse) {
  chrome.storage.sync.get("notes", (result) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error retrieving notes for deletion:",
        chrome.runtime.lastError
      );
      sendResponse({ error: "Failed to delete note" });
      return;
    }

    const notes = Array.isArray(result.notes) ? result.notes : [];
    if (index >= 0 && index < notes.length) {
      notes.splice(index, 1);
      chrome.storage.sync.set({ notes: notes }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error deleting note:", chrome.runtime.lastError);
          sendResponse({ error: "Failed to delete note" });
        } else {
          sendResponse(notes);
        }
      });
    } else {
      sendResponse({ error: "Invalid note index" });
    }
  });
}
