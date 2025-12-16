// -------------------
// Mock server URL
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// -------------------
// Local quotes array
let localQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Don't wait. The time will never be just right.", category: "Motivation" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Happiness" },
];

// -------------------
// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');

// -------------------
// Populate categories dropdown
function populateCategories() {
  const categories = [...new Set(localQuotes.map(q => q.category))];
  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// -------------------
// Show random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = localQuotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// -------------------
// Dynamically create add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';
  textInput.type = 'text';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.type = 'text';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', () => {
    addQuote(textInput.value, categoryInput.value);
    textInput.value = '';
    categoryInput.value = '';
  });

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addBtn);

  document.body.appendChild(formContainer);
}

// -------------------
// Add quote to local storage and optionally post to server
function addQuote(text, category) {
  text = text.trim();
  category = category.trim();
  if (!text || !category) {
    alert('Please enter both quote and category.');
    return;
  }

  const newQuote = { text, category };
  localQuotes.push(newQuote);
  populateCategories();
  alert('Quote added successfully!');

  // Post the new quote to the server
  postQuoteToServer(newQuote);
}

// -------------------
// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Map first 10 posts to quotes for simulation
    const serverQuotes = serverData.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching server data:", error);
    return [];
  }
}

// -------------------
// Post a quote to the server (mock)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log("Quote synced to server:", data);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// -------------------
// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server data takes precedence if not already in local
  const newServerQuotes = serverQuotes.filter(sq =>
    !localQuotes.some(lq => lq.text === sq.text && lq.category === sq.category)
  );

  if (newServerQuotes.length > 0) {
    localQuotes = [...localQuotes, ...newServerQuotes];
    populateCategories();
    alert(`${newServerQuotes.length} new quote(s) fetched from server and added.`);
  }
}

// -------------------
// Initial setup
populateCategories();
showRandomQuote();
createAddQuoteForm();

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categorySelect.addEventListener('change', showRandomQuote);

// Periodically check for new quotes from the server every 10 seconds
setInterval(syncQuotes, 10000);
