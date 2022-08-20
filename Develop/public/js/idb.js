// Add service worker to the root of the public directory
let db;
const request = indexedDB.open('budget-tracker', 1);

function saveRecord(record) {
    const transation = db.transatcion(['transaction'], 'readwrite');
    const budgetObjectStore = transation.objectStore('transaction');
    budgetObjectStore.add(record);
}

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {}
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

// need to manually create a manifest.json file and add to the root of your public/ directory

