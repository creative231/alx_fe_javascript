document.addEventListener('DOMContentLoaded', () => {
  // =====================================================
  // 1️⃣ Quotes Data Array
  // =====================================================
  let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
  ];

  // =====================================================
  // 2️⃣ Select DOM Elements
  // =====================================================
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const categoryFilter = document.getElementById('categoryFilter');
  const addQuoteSection = document.getElementById('addQuoteSection');

  // =====================================================
  // 3️⃣ Show Random Quote (based on selected category)
  // =====================================================
  function showRandomQuote() {
    let filteredQuotes = quotes;
    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category. Please add one!";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  }

  // =====================================================
  // 4️⃣ Create the Add Quote Form Dynamically
  // =====================================================
  function createAddQuoteForm() {
    const formTitle = document.createElement('h3');
    formTitle.textContent = "Add a New Quote";

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Quote';
    addBtn.addEventListener('click', addQuote);

    addQuoteSection.append(formTitle, quoteInput, categoryInput, addBtn);
  }

  // =====================================================
  // 5️⃣ Add a New Quote Dynamically
  // =====================================================
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
      alert("Please fill in both fields before adding a quote!");
      return;
    }

    // Add to array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Update category list dynamically
    if (![...categoryFilter.options].some(opt => opt.value.toLowerCase() === newQuoteCategory.toLowerCase())) {
      const newOption = document.createElement('option');
      newOption.value = newQuoteCategory;
      newOption.textContent = newQuoteCategory;
      categoryFilter.appendChild(newOption);
    }

    alert("Quote added successfully!");
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  }

  // =====================================================
  // 6️⃣ Populate Category Dropdown Dynamically
  // =====================================================
  function populateCategories() {
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  // =====================================================
  // 7️⃣ Event Listeners
  // =====================================================
  newQuoteBtn.addEventListener('click', showRandomQuote);
  categoryFilter.addEventListener('change', showRandomQuote);

  // =====================================================
  // 8️⃣ Initialize Application
  // =====================================================
  populateCategories();
  createAddQuoteForm();
  showRandomQuote(); // show one on load
});
