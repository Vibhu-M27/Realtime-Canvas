import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canva from './Components/Canva';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/canva/:qrCode" element={<Canva />} />
        <Route path="/canva" element={<Canva />} /> {/* Fallback route */}
      </Routes>
    </Router>
  );
}

export default App;

