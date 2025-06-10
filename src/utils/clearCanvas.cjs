// const { initializeApp } = require('firebase/app');
// const { getDatabase, ref, remove } = require('firebase/database');

// // MUST use your exact project URL
// const firebaseConfig = {
//   databaseURL: "https://real-time-canvas.firebaseio.com" 
//   // ... other config fields
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// // Use the full path reference
// const canvasRef = ref(db, 'droppedImages');

// remove(canvasRef)
//   .then(() => console.log('Cleared successfully'))
//   .catch(err => console.error('Error:', err));