document.addEventListener("DOMContentLoaded", function () {
  const notesContainer = document.getElementById("notes-container");
  const newNoteElement = document.getElementById("new-note");
  const categoryElement = document.getElementById("category");
  const saveButton = document.getElementById("save");
  const searchInput = document.getElementById("search");

  function displayNotes(notes) {
    notesContainer.innerHTML = "";
    if (!Array.isArray(notes)) {
      console.error("Expected notes to be an array, but got:", notes);
      return;
    }
    const fragment = document.createDocumentFragment();
    notes.forEach((note, index) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note";

      const noteText = document.createElement("span");
      noteText.textContent = `${note.text} [${note.category}]`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";
      deleteButton.addEventListener("click", () => {
        deleteNote(index);
      });

      noteElement.appendChild(noteText);
      noteElement.appendChild(deleteButton);
      fragment.appendChild(noteElement);
    });
    notesContainer.appendChild(fragment);
  }

  function getNotes(callback) {
    chrome.runtime.sendMessage({ action: "getNotes" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting notes:", chrome.runtime.lastError);
        callback([]);
      } else {
        callback(response || []);
      }
    });
  }

  function saveNote() {
    const noteText = newNoteElement.value.trim();
    const category = categoryElement.value.trim() || "Uncategorized";
    if (noteText) {
      const newNote = { text: noteText, category: category };
      chrome.runtime.sendMessage(
        { action: "saveNote", note: newNote },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error saving note:", chrome.runtime.lastError);
          } else {
            displayNotes(response || []);
            newNoteElement.value = "";
            categoryElement.value = "";
          }
        }
      );
    } else {
      console.warn("Cannot save empty note");
    }
  }

  function deleteNote(index) {
    chrome.runtime.sendMessage(
      { action: "deleteNote", index: index },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error deleting note:", chrome.runtime.lastError);
        } else {
          displayNotes(response || []);
        }
      }
    );
  }

  saveButton.addEventListener("click", saveNote);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  searchInput.addEventListener(
    "input",
    debounce(function () {
      const query = searchInput.value.toLowerCase();
      getNotes((notes) => {
        const filteredNotes = notes.filter(
          (note) =>
            note.text.toLowerCase().includes(query) ||
            note.category.toLowerCase().includes(query)
        );
        displayNotes(filteredNotes);
      });
    }, 300)
  );

  getNotes(displayNotes);
});
