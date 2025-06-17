import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Canvas } from './components/Canvas';
import { getStickersForRegion } from './data/stickers';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f0f2f5;
`;

const CanvasRoute = () => {
  const { region } = useParams();
  const stickers = getStickersForRegion(region);
  
  console.log('CanvasRoute - Region:', region, 'Stickers:', stickers);
  
  if (!region || !['mustafabad', 'karnataka', 'harkeshnagar'].includes(region)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: '20px'
      }}>
        <h1>Invalid Region: {region || 'undefined'}</h1>
        <Link to="/" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Go Back</Link>
      </div>
    );
  }
  
  return <Canvas stickers={stickers} />;
};

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/:region" element={<CanvasRoute />} />
          <Route path="/" element={
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100vh',
              gap: '20px'
            }}>
              <h1>Select a Region</h1>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/mustafabad" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Mustafabad</Link>
                <Link to="/karnataka" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Karnataka</Link>
                <Link to="/harkeshnagar" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Harkeshnagar</Link>
              </div>
            </div>
          } />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;


//i actually have to make 3 webpages which share this same canvas but different stickers (that data i will input at the backend), the canvas will get updated in realtime so whatever user 1 does on the canvas other users will also be able to see it and drag the stickers they have in their panel and put it on canvas and use their features. 