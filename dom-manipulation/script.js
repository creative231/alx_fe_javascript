// Array of quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Don't wait. The time will never be just right.", category: "Motivation" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Happiness" },
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');

// -------------------
// Function: Populate categories dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = ''; // Clear previous options
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// -------------------
// Function: Show a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// -------------------
// Function: Dynamically create Add Quote form
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
// Function: Add new quote to the array and update DOM
function addQuote(text, category) {
  text = text.trim();
  category = category.trim();
  if (!text || !category) {
    alert('Please enter both quote and category.');
    return;
  }

  quotes.push({ text, category });
  populateCategories();
  alert('Quote added successfully!');
}

// -------------------
// Initial setup
populateCategories();
showRandomQuote();
createAddQuoteForm();

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categorySelect.addEventListener('change', showRandomQuote);
