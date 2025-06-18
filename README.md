# Collaborative Sticker Canvas

A real-time collaborative canvas web app where users can drag and drop stickers onto a shared canvas. Each region (Mustafabad, Karnataka, Harkeshnagar) has its own set of stickers and a shared canvas that updates in real time for all users. The app is built with React, Vite, Firebase, and is deployed on Vercel.

---

## Quick Access

- [Mustafabad Canvas](https://realtime-canvas-nine.vercel.app/karnataka#/mustafabad)
- [Harkeshnagar Canvas](https://realtime-canvas-nine.vercel.app/karnataka#/harkeshnagar)
- [Karnataka Canvas](https://realtime-canvas-nine.vercel.app/karnataka#/karnataka)

---

## Features

### Core Functionality
- **Real-time Collaboration:** All users see live updates to the canvas, powered by Firebase Firestore.
- **Region-Specific Canvases:** Each region (`mustafabad`, `karnataka`, `harkeshnagar`) has its own canvas and unique set of stickers.
- **Drag & Drop Stickers:** Users can drag stickers from a sidebar and place them anywhere on the canvas.
- **Sticker Manipulation:** Stickers can be moved, resized, rotated, locked/unlocked, and deleted.
- **Undo Functionality:** Users can undo their last action on the canvas.
- **Responsive UI:** The interface adapts to desktop and mobile devices.
- **Sidebar:** A resizable sidebar displays all available stickers for the selected region.
- **Mini-map:** (If enabled in Canvas) Shows a zoomed-out view of the canvas for easier navigation.
- **HashRouter Routing:** Uses React Router's `HashRouter` for reliable client-side routing on static hosting.

### Backend & Real-time
- **Firebase Firestore:** Stores canvas state for each region and syncs changes in real time.
- **Canvas Document:** Each region's canvas is a Firestore document with an array of sticker items and a `lastUpdated` timestamp.
- **Live Subscriptions:** The app subscribes to Firestore updates and instantly reflects changes made by any user.

### Datasets
- **Stickers Dataset:** Each region has a curated set of stickers, defined in `src/data/stickers.js`. Each sticker has an `id`, `src` (image path), and `alt` text.
- **QR Codes:** The `public/QRs` folder contains QR codes for different regions, which can be used for quick access or sharing.

---

## Implementation Details

### Routing & Structure
- **HashRouter:** The app uses `HashRouter` from React Router, so URLs look like `/#/mustafabad`. This avoids 404 errors on static hosts.
- **Dynamic Routing:** The route `/:region` loads the canvas for the selected region, and `/` shows the region selection page.

### Canvas Logic
- **Canvas Component:** Handles rendering, drag-and-drop, sticker manipulation, and real-time updates.
- **Sidebar:** Shows all stickers for the current region, which can be dragged onto the canvas.
- **Real-time Sync:** Uses Firestore's `onSnapshot` to listen for changes and update the canvas for all users.

### Firebase Integration
- **Firestore Structure:**
  - `canvases/{region}`: Each region has a document storing the canvas state (`items` array).
  - `users/{userId}`: (Optional) Stores available stickers for each user.
- **Functions:**
  - `createCanvas`: Initializes a canvas document if it doesn't exist.
  - `updateCanvasState`: Updates the canvas with new sticker positions, etc.
  - `subscribeToCanvas`: Listens for real-time updates.

---

## Datasets

### Stickers (`src/data/stickers.js`)
- **mustafabad:** 16 stickers (e.g., `IMG_0088-removebg-preview.png`, `IMG_0084-removebg-preview.png`, ...)
- **karnataka:** 21 stickers (e.g., `guiiu.png`, `a_L7A8980.png`, ...)
- **harkeshnagar:** (stickers listed in the file, similar structure)
- Each sticker object:
  ```js
  {
    id: 'mustafabad-1',
    src: '/stickers/mustafabad/IMG_0088-removebg-preview.png',
    alt: 'Mustafabad Sticker 1'
  }
  ```

### QR Codes (`public/QRs`)
- `mustafabad_qr.png`
- `park_qr.png`
- `t_halli_qr.png`
- These can be used for quick access to specific canvases or for sharing.

---

## Project Structure

```
public/
  QRs/                # QR code images for regions
  stickers/           # Sticker images by region
src/
  app.jsx             # Main App component (uses HashRouter)
  components/
    Canvas.jsx        # Canvas logic and UI
  data/
    stickers.js       # Sticker datasets for each region
  firebase.js         # Firebase config and real-time logic
  main.jsx            # Entry point
vercel.json           # Vercel config for SPA routing
README.md             # Project documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deployment
- Deploy on Vercel.
- No special server configuration needed due to HashRouter.

---

## License

MIT 