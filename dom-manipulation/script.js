// ======== Server Sync Section ========

// Fetch simulated quotes from JSONPlaceholder
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const serverQuotes = await response.json();
    return serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

// Merge local and server quotes (conflict resolution)
function mergeQuotes(serverQuotes, localQuotes) {
  const merged = [...serverQuotes];
  localQuotes.forEach(localQuote => {
    const exists = merged.some(serverQuote => serverQuote.text === localQuote.text);
    if (!exists) merged.push(localQuote);
  });
  return merged;
}

// Notify user of sync or conflict events
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.background = "#ffeb3b";
  notification.style.padding = "10px";
  notification.style.margin = "10px auto";
  notification.style.maxWidth = "600px";
  notification.style.borderRadius = "8px";
  notification.style.textAlign = "center";
  notification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
  document.body.prepend(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Sync local data with server periodically
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const mergedQuotes = mergeQuotes(serverQuotes, localQuotes);
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  populateCategories();
  filterQuotes();
  notifyUser("✅ Quotes synchronized with server!");
}

// Run initial sync on load and repeat every 30 seconds
document.addEventListener('DOMContentLoaded', syncWithServer);
setInterval(syncWithServer, 30000);
