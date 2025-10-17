// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {

  // ======================================================
  // 1️⃣ Initialize and Load Quotes from Local Storage
  // ======================================================

  // Default quotes (will merge with stored ones)
  const defaultQuotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
  ];

  // Load quotes from local storage or use defaults
  let quotes = JSON.parse(localStorage.getItem('quotes')) || defaultQuotes;

  // ======================================================
  // 2️⃣ Select DOM Elements
  // ======================================================
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  // ======================================================
  // 3️⃣ Display a Random Quote
  // ======================================================
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.textContent = "No quotes available. Please add one!";
      return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  }

  // ======================================================
  // 4️⃣ Add New Quote & Save to Local Storage
  // ======================================================
  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();

    if (quoteText === "" || quoteCategory === "") {
      alert("Please enter both a quote and a category.");
      return;
    }

    // Add new quote to array
    quotes.push({ text: quoteText, category: quoteCategory });

    // Save updated quotes to Local Storage
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update UI
    alert("Quote added successfully!");
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }

  // ======================================================
  // 5️⃣ Load Quotes on Page Load
  // ======================================================
  function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    if (storedQuotes.length > 0) {
      quotes = storedQuotes;
    } else {
      quotes = defaultQuotes;
      localStorage.setItem('quotes', JSON.stringify(defaultQuotes));
    }
  }

  // ======================================================
  // 6️⃣ Attach Event Listeners
  // ======================================================
  newQuoteBtn.addEventListener('click', showRandomQuote);

  // Add quote button (if exists in HTML)
  const addBtn = document.querySelector('button[onclick="addQuote()"]');
  if (addBtn) addBtn.addEventListener('click', addQuote);

  // ======================================================
  // 7️⃣ Initialize App
  // ======================================================
  loadQuotes();
  showRandomQuote(); // Show one random quote on load
});
