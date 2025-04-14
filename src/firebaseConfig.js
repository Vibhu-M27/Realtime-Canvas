// filepath: c:\Users\Arora\realtimecanva\Realtimecanva\src\firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCsqA05K7X4HDUALY4FSW5QT12HZnU_8AA",
    authDomain: "realtimecanva.firebaseapp.com",
    projectId: "realtimecanva",
    storageBucket: "realtimecanva.firebasestorage.app",
    messagingSenderId: "29040478753",
    appId: "1:29040478753:web:18bf95e066739cdeaf7160"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };