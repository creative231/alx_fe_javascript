// Wait until the document has fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // ===========================================
  // 1. Initialize Quotes Data
  // ===========================================
  let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  ];

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const categorySelect = document.getElementById('categorySelect');

  // ===========================================
  // 2. Populate Category Dropdown
  // ===========================================
  function populateCategories() {
    // Get unique category names
    const categories = [...new Set(quotes.map(q => q.category))];
    categorySelect.innerHTML = '';

    // Add "All" option
    const allOption = document.createElement('option');
    allOption.value = "All";
    allOption.textContent = "All Categories";
    categorySelect.appendChild(allOption);

    // Add each category
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // ===========================================
  // 3. Show Random Quote
  // ===========================================
  function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;

    // Filter quotes by category if not "All"
    if (selectedCategory !== "All") {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
      return;
    }

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Display the quote
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  }

  // ===========================================
  // 4. Add New Quote
  // ===========================================
  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();

    if (quoteText === "" || quoteCategory === "") {
      alert("Please fill in both the quote and category fields.");
      return;
    }

    // Add new quote object
    quotes.push({ text: quoteText, category: quoteCategory });

    // Clear inputs
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    // Update categories dropdown
    populateCategories();

    alert("Quote added successfully!");
  }

  // ===========================================
  // 5. Event Listeners
  // ===========================================
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  categorySelect.addEventListener('change', showRandomQuote);

  // ===========================================
  // 6. Initial Load
  // ===========================================
  populateCategories();
});
