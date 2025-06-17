import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to create initial canvas document
export const createCanvas = async (canvasId) => {
  try {
    console.log('Creating/checking canvas:', canvasId);
    const canvasRef = doc(db, 'canvases', canvasId);
    const canvasDoc = await getDoc(canvasRef);
    
    if (!canvasDoc.exists()) {
      console.log('Canvas does not exist, creating new one');
      await setDoc(canvasRef, {
        items: [],
        lastUpdated: new Date().toISOString()
      });
      console.log('Canvas created successfully');
      return [];
    } else {
      console.log('Canvas exists, returning current items');
      return canvasDoc.data().items || [];
    }
  } catch (error) {
    console.error("Error creating canvas:", error);
    return [];
  }
};

// Function to update canvas state
export const updateCanvasState = async (canvasId, items) => {
  try {
    console.log('Updating canvas with items:', items);
    const canvasRef = doc(db, 'canvases', canvasId);
    await updateDoc(canvasRef, {
      items: items,
      lastUpdated: new Date().toISOString()
    });
    console.log('Canvas updated successfully');
  } catch (error) {
    console.error("Error updating canvas:", error);
  }
};

// Function to listen to canvas changes
export const subscribeToCanvas = (canvasId, callback) => {
  try {
    console.log('Setting up subscription for canvas:', canvasId);
    const canvasRef = doc(db, 'canvases', canvasId);
    
    return onSnapshot(canvasRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log('Received canvas update:', data.items);
          callback(data.items || []);
        } else {
          console.log('Canvas does not exist in subscription');
          callback([]);
        }
      },
      (error) => {
        console.error("Error in canvas subscription:", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up subscription:", error);
    callback([]);
    return () => {};
  }
};

// Function to get available stickers for a user
export const getAvailableStickers = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().availableStickers;
    }
  } catch (error) {
    console.error("Error getting stickers:", error);
  }
  return [];
};

export { db };
export const firebaseEnabled = true; 