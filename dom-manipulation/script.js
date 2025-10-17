// Dynamic Quote Generator with localStorage, sessionStorage, and JSON import/export
document.addEventListener('DOMContentLoaded', () => {

  // -----------------------
  // Default quotes (fallback)
  // -----------------------
  const defaultQuotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
  ];

  // -----------------------
  // Select DOM elements
  // -----------------------
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const categoryFilter = document.getElementById('categoryFilter');
  const addQuoteSection = document.getElementById('addQuoteSection');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const importFileInput = document.getElementById('importFile');

  // -----------------------
  // Storage key
  // -----------------------
  const STORAGE_KEY = 'quotes';
  const SESSION_LAST_QUOTE = 'lastQuote'; // store last shown quote text in sessionStorage

  // -----------------------
  // In-memory quotes array (loaded from localStorage or defaults)
  // -----------------------
  let quotes = loadQuotesFromLocalStorage();

  // -----------------------
  // Helper: Save quotes to localStorage
  // -----------------------
  function saveQuotesToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    } catch (err) {
      console.error('Could not save quotes to localStorage:', err);
    }
  }

  // -----------------------
  // Helper: Load quotes from localStorage
  // -----------------------
  function loadQuotesFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // initialize with defaults and persist
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuotes));
        return [...defaultQuotes];
      }
      const parsed = JSON.parse(raw);
      // Validate structure: expect array of {text, category}
      if (!Array.isArray(parsed)) throw new Error('Invalid structure in localStorage (not an array)');
      const valid = parsed.filter(q => q && typeof q.text === 'string' && typeof q.category === 'string');
      return valid.length ? valid : [...defaultQuotes];
    } catch (err) {
      console.warn('Error loading localStorage quotes, using defaults:', err);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuotes));
      return [...defaultQuotes];
    }
  }

  // -----------------------
  // Populate category filter with unique categories
  // -----------------------
  function populateCategories() {
    // start with "All"
    categoryFilter.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All Categories';
    categoryFilter.appendChild(allOpt);

    const uniqueCats = [...new Set(quotes.map(q => q.category))];
    uniqueCats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  // -----------------------
  // Show a random quote (respects selected category)
  // -----------------------
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value || 'all';
    const pool = selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    if (!pool || pool.length === 0) {
      quoteDisplay.textContent = 'No quotes available for this category. Add some!';
      sessionStorage.removeItem(SESSION_LAST_QUOTE);
      return;
    }

    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    quoteDisplay.textContent = `"${q.text}" — ${q.category}`;

    // store last quote in sessionStorage (session-specific)
    try {
      sessionStorage.setItem(SESSION_LAST_QUOTE, JSON.stringify(q));
    } catch (err) {
      console.warn('Could not save last quote to sessionStorage:', err);
    }
  }

  // -----------------------
  // Restore last quote from sessionStorage if present
  // -----------------------
  function restoreLastQuoteFromSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_LAST_QUOTE);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.text && parsed.category) {
        quoteDisplay.textContent = `"${parsed.text}" — ${parsed.category}`;
        return true;
      }
    } catch (err) {
      // ignore invalid session value
    }
    return false;
  }

  // -----------------------
  // Create add-quote form dynamically
  // -----------------------
  function createAddQuoteForm() {
    addQuoteSection.innerHTML = ''; // clear

    const title = document.createElement('h3');
    title.textContent = 'Add a New Quote';
    addQuoteSection.appendChild(title);

    // Quote text input
    const quoteLabel = document.createElement('label');
    quoteLabel.htmlFor = 'newQuoteText';
    quoteLabel.textContent = 'Quote text:';
    const quoteInput = document.createElement('input');
    quoteInput.type = 'text';
    quoteInput.id = 'newQuoteText';
    quoteInput.placeholder = 'Enter a new quote';

    // Category input
    const catLabel = document.createElement('label');
    catLabel.htmlFor = 'newQuoteCategory';
    catLabel.textContent = 'Category:';
    const catInput = document.createElement('input');
    catInput.type = 'text';
    catInput.id = 'newQuoteCategory';
    catInput.placeholder = 'Enter quote category';

    // Add button
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = 'Add Quote';
    addBtn.addEventListener('click', () => {
      addQuoteFromInputs(quoteInput.value.trim(), catInput.value.trim());
      // clear after add
      quoteInput.value = '';
      catInput.value = '';
    });

    addQuoteSection.appendChild(quoteLabel);
    addQuoteSection.appendChild(quoteInput);
    addQuoteSection.appendChild(catLabel);
    addQuoteSection.appendChild(catInput);
    addQuoteSection.appendChild(document.createElement('br'));
    addQuoteSection.appendChild(addBtn);
  }

  // -----------------------
  // Add quote function (updates array & localStorage & UI)
  // -----------------------
  function addQuoteFromInputs(text, category) {
    if (!text || !category) {
      alert('Please provide both quote text and category.');
      return;
    }

    // Add to quotes array
    quotes.push({ text, category });

    // Update localStorage
    saveQuotesToLocalStorage();

    // Update categories UI
    populateCategories();

    // Notify user
    alert('Quote added and saved!');
  }

  // -----------------------
  // Export quotes to JSON file
  // -----------------------
  function exportQuotesToJson() {
    try {
      const payload = JSON.stringify(quotes, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotes.json';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // revoke the object URL after download
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Check console for details.');
    }
  }

  // -----------------------
  // Import quotes from a selected JSON file
  // -----------------------
  function importFromJsonFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        // Validate: must be array of {text, category}
        if (!Array.isArray(imported)) throw new Error('Imported JSON is not an array');

        const valid = imported.filter(item =>
          item && typeof item.text === 'string' && typeof item.category === 'string'
        );

        if (valid.length === 0) throw new Error('No valid quote objects found in file');

        // Merge: avoid duplicates by text+category
        const existingSet = new Set(quotes.map(q => q.text + '||' + q.category));
        let added = 0;
        valid.forEach(q => {
          const key = q.text + '||' + q.category;
          if (!existingSet.has(key)) {
            quotes.push({ text: q.text, category: q.category });
            existingSet.add(key);
            added++;
          }
        });

        // Persist and update UI
        if (added > 0) {
          saveQuotesToLocalStorage();
          populateCategories();
        }

        alert(`Imported ${valid.length} quote(s). ${added} new added (duplicates skipped).`);
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to import quotes: ' + err.message);
      }
    };

    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      alert('Could not read file.');
    };

    reader.readAsText(file);
  }

  // -----------------------
  // Event bindings
  // -----------------------
  newQuoteBtn.addEventListener('click', showRandomQuote);
  categoryFilter.addEventListener('change', showRandomQuote);
  exportJsonBtn.addEventListener('click', exportQuotesToJson);
  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      importFromJsonFile(file);
      // reset input so same file can be selected again if needed
      importFileInput.value = '';
    }
  });

  // -----------------------
  // Initialize UI
  // -----------------------
  populateCategories();
  createAddQuoteForm();

  // Try to restore last session quote; otherwise show random
  const restored = restoreLastQuoteFromSession();
  if (!restored) {
    // show a random quote on initial load
    showRandomQuote();
  }

}); // end DOMContentLoaded
