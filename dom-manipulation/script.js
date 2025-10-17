// Retrieve quotes from localStorage or initialize with defaults
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteBtn = document.getElementById('newQuote');

// Load the last selected category
let lastCategory = localStorage.getItem('lastCategory') || 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  filterQuotes(); // show quotes based on stored filter
  newQuoteBtn.addEventListener('click', showRandomQuote);
});

// ✅ Populate category dropdown dynamically
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = lastCategory;
}

// ✅ Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('lastCategory', selectedCategory);
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  displayQuotes(filtered);
}

// ✅ Display quotes in the DOM
function displayQuotes(quotesToShow) {
  quoteDisplay.innerHTML = '';
  if (quotesToShow.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }
  quotesToShow.forEach(q => {
    const quoteEl = document.createElement('p');
    quoteEl.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(quoteEl);
  });
}

// ✅ Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) return;
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// ✅ Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please fill in both fields!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Export quotes as JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch {
      alert('Invalid JSON file!');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
// Function to post a new quote to the mock server (simulation)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Quote sent to server:", result);
    showNotification('Quote successfully sent to server (simulated)', '#28a745');
  } catch (error) {
    console.error("Error posting quote to server:", error);
    showNotification('Failed to send quote to server', '#dc3545');
  }
}
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showNotification('New quote added locally!', '#17a2b8');

    // Post the new quote to the server (simulated)
    postQuoteToServer(newQuote);

    textInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
  } else {
    showNotification('Please enter both quote text and category.', '#ffc107');
  }
}
