// Add service worker to the root of the public directory
let db;
const request = indexedDB.open('budget-tracker', 1);

function saveRecord(record) {
    const transaction = db.transaction(['new-transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new-transaction');
    budgetObjectStore.add(record);
}

function pullRecords() {

    // open a transaction on your pending db
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access your pending object store
    const budgetObjectStore = transaction.objectStore('new_transaction');
  
    // get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();
  
    getAll.onsuccess = function() {
      // if there was data in indexedDb's store, let's send it to the api server
      if (getAll.result.length > 0) {
        fetch('/api/transaction', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(serverResponse => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
  
            const transaction = db.transaction(['new_transaction'], 'readwrite');
            const budgetObjectStore = transaction.objectStore('new_transaction');
            // clear all items in your store
            budgetObjectStore.clear();
          })
          .catch(err => {
            // set reference to redirect back here
            console.log(err);
          });
      }
    };
  }
  

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new-transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {}
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

  // listen for app coming back online
window.addEventListener("online", pullRecords);
