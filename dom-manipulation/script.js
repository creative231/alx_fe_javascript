// ==============================
// Dynamic Quote Generator with Server Sync & Conflict Resolution
// ==============================

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // 1. Data Initialization
  // ==============================
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "Do what you can, with what you have, where you are.", category: "Wisdom" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');

  // Create container for notifications
  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.style.display = 'none';
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.color = '#fff';
  notification.style.zIndex = '1000';
  document.body.appendChild(notification);

  // ==============================
  // 2. Utility Functions
  // ==============================

  // Save quotes to Local Storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Display random quote in the DOM
  function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `
      <p><strong>Category:</strong> ${randomQuote.category}</p>
      <p>"${randomQuote.text}"</p>
    `;
  }

  // Show notification message
  function showNotification(message, color = '#28a745') {
    notification.textContent = message;
    notification.style.backgroundColor = color;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 4000);
  }

  // ==============================
  // 3. Add Quote Functionality
  // ==============================
  window.addQuote = function () {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
      alert("Please fill in both fields before adding a quote.");
      return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    showNotification("Quote added locally!", "#17a2b8");

    // Sync with server after local addition
    syncWithServer();

    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  };

  // ==============================
  // 4. Simulated Server Interaction
  // ==============================
  async function fetchServerQuotes() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const data = await response.json();
      // Simulate server-side quotes
      return data.map(post => ({
        text: post.title,
        category: "Server"
      }));
    } catch (error) {
      console.error("Error fetching server quotes:", error);
      return [];
    }
  }

  async function syncWithServer() {
    const serverQuotes = await fetchServerQuotes();

    // Conflict Resolution: Server takes precedence
    const combinedQuotes = [...serverQuotes, ...quotes.filter(q => q.category !== "Server")];

    // Remove duplicates based on quote text
    const uniqueQuotes = Array.from(new Map(combinedQuotes.map(q => [q.text, q])).values());

    // Detect and notify about updates
    if (uniqueQuotes.length !== quotes.length) {
      showNotification("Quotes synchronized with server data!", "#ffc107");
    }

    quotes = uniqueQuotes;
    saveQuotes();
    displayRandomQuote();
  }

  // ==============================
  // 5. Periodic Sync
  // ==============================
  setInterval(syncWithServer, 30000); // Sync every 30 seconds

  // ==============================
  // 6. Event Listeners
  // ==============================
  newQuoteBtn.addEventListener('click', displayRandomQuote);

  // Display a random quote on load
  displayRandomQuote();
  syncWithServer();
});
