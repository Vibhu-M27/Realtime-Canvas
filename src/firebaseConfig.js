// filepath: c:\Users\Arora\realtimecanva\Realtimecanva\src\firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDXzT1tWT-jlKG2tHxEP9gt9RJ0VP10WE8",
  authDomain: "real-time-canvas.firebaseapp.com",
  databaseURL: "https://real-time-canvas-default-rtdb.firebaseio.com",
  projectId: "real-time-canvas",
  storageBucket: "real-time-canvas.firebasestorage.app",
  messagingSenderId: "270327376664",
  appId: "1:270327376664:web:d9795cf80c2d05dc574c6d",
  measurementId: "G-5NXZ980YN9"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };