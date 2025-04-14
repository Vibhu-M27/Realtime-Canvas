import React, { useState, useEffect, useRef } from 'react';
import { ref, set, push, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Canva.css';

// Original images array
const allImages = [
  'https://plus.unsplash.com/premium_photo-1737659209063-32e2b1a385a5?q=80&w=1935&auto=format',
  'https://images.unsplash.com/photo-1734760444698-ce341bfd1636?q=80&w=2127&auto=format',
  'https://media.istockphoto.com/id/2129922771/photo/abstract-wave-technology.jpg',
  'https://cdn.pixabay.com/photo/2022/07/01/14/22/chain-link-fence-7295711_1280.jpg',
  'https://cdn.pixabay.com/photo/2020/09/07/12/45/sphere-5551752_1280.jpg',
  'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D',
  'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
  'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
  'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'
];

// Split images into batches: 2-2-2-3
const imageBatches = {
  qr_1: allImages.slice(0, 2),    // First 2 images
  qr_2: allImages.slice(2, 4),    // Next 2 images
  qr_3: allImages.slice(4, 6),    // Next 2 images
  qr_4: allImages.slice(6, 9)     // Last 3 images
};

const Canva = () => {
  const { qrCode = 'qr_1' } = useParams(); // Default to qr_1 if no param
  const [availableImages, setAvailableImages] = useState(imageBatches[qrCode] || imageBatches.qr_1);
  
  const [droppedImages, setDroppedImages] = useState([]);
  const [positions, setPositions] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [locked, setLocked] = useState([]);
  const [history, setHistory] = useState([]);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const canvasRef = useRef(null);

  // Update available images when qrCode changes
  useEffect(() => {
    const batch = imageBatches[qrCode] || imageBatches.qr_1;
    setAvailableImages(batch);
  }, [qrCode]);

  // Load initial canvas data from Firebase
  useEffect(() => {
    const imagesRef = ref(database, 'droppedImages');
    const unsubscribe = onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newImages = [];
        const newPositions = [];
        const newSizes = [];
        const newRotations = [];
        const newLocked = [];

        Object.values(data).forEach(item => {
          newImages.push(item.image);
          newPositions.push(item.position);
          newSizes.push(item.size || 80);
          newRotations.push(item.rotation || 0);
          newLocked.push(item.locked || false);
        });

        setDroppedImages(newImages);
        setPositions(newPositions);
        setSizes(newSizes);
        setRotations(newRotations);
        setLocked(newLocked);
      }
    });

    return () => unsubscribe();
  }, []);

  const startDrag = (event) => {
    setDragging(true);
    setStart({
      x: event.clientX - translate.x,
      y: event.clientY - translate.y
    });
  };

  const endDrag = () => {
    setDragging(false);
  };

  const onDrag = (event) => {
    if (!dragging) return;
    setTranslate({
      x: event.clientX - start.x,
      y: event.clientY - start.y
    });
  };

  const handleWheelZoom = (event) => {
    event.preventDefault();
    const zoomFactor = 0.1;
    const newScale = event.deltaY > 0 ? scale - zoomFactor : scale + zoomFactor;
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  const onDragStart = (event, image) => {
    event.dataTransfer.setData('image', image);
  };

  const onDrop = (event) => {
    event.preventDefault();
    const image = event.dataTransfer.getData('image');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - translate.x) / scale;
    const y = (event.clientY - rect.top - translate.y) / scale;

    const newDroppedImages = [...droppedImages, image];
    const newPositions = [...positions, { x, y }];
    const newSizes = [...sizes, 80];
    const newRotations = [...rotations, 0];
    const newLocked = [...locked, false];

    setHistory([...history, {
      images: [...droppedImages],
      positions: [...positions],
      sizes: [...sizes],
      rotations: [...rotations],
      locked: [...locked]
    }]);

    setDroppedImages(newDroppedImages);
    setPositions(newPositions);
    setSizes(newSizes);
    setRotations(newRotations);
    setLocked(newLocked);

    const imagesRef = ref(database, 'droppedImages');
    const newImageRef = push(imagesRef);
    set(newImageRef, {
      image,
      position: { x, y },
      size: 80,
      rotation: 0,
      locked: false
    });

    setShowSidebar(false);
  };

  const undoLastAction = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setDroppedImages(lastState.images);
      setPositions(lastState.positions);
      setSizes(lastState.sizes);
      setRotations(lastState.rotations);
      setLocked(lastState.locked);
      setHistory(history.slice(0, -1));
    }
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
    setSelectedIndex(null);
  };

  const handleSizeChange = (index, increment) => {
    if (locked[index]) return;

    const newSizes = [...sizes];
    newSizes[index] = Math.max(40, newSizes[index] + increment);
    setSizes(newSizes);
  };

  const handleRotate = (index, degrees) => {
    if (locked[index]) return;

    const newRotations = [...rotations];
    newRotations[index] += degrees;
    setRotations(newRotations);
  };

  const toggleLock = (index) => {
    const newLocked = [...locked];
    newLocked[index] = !newLocked[index];
    setLocked(newLocked);
  };

  return (
    <div
      className="canva-container"
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onWheel={handleWheelZoom}
    >
      {showSidebar ? (
        <div className="sidebar">
          {availableImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`img-${index}`}
              draggable
              onDragStart={(event) => onDragStart(event, image)}
            />
          ))}
        </div>
      ) : (
        <div className="sidebar-controls">
          <button onClick={toggleSidebar}>Show Sidebar</button>
          <button onClick={undoLastAction}>Undo</button>
          {selectedIndex !== null && (
            <>
              <button onClick={() => handleSizeChange(selectedIndex, 10)}>Increase Size</button>
              <button onClick={() => handleSizeChange(selectedIndex, -10)}>Decrease Size</button>
              <button onClick={() => handleRotate(selectedIndex, 15)}>Rotate +15°</button>
              <button onClick={() => handleRotate(selectedIndex, -15)}>Rotate -15°</button>
              <button onClick={() => toggleLock(selectedIndex)}>
                {locked[selectedIndex] ? 'Unlock' : 'Lock'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="canva-wrapper">
        <div
          ref={canvasRef}
          className="canva-space"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
        >
          {droppedImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`dropped-img-${index}`}
              onClick={() => setSelectedIndex(index)}
              style={{
                position: 'absolute',
                left: `${positions[index].x}px`,
                top: `${positions[index].y}px`,
                width: `${sizes[index]}px`,
                transform: `rotate(${rotations[index]}deg)`,
                cursor: locked[index] ? 'not-allowed' : 'pointer'
              }}
            />
          ))}
        </div>
      </div>
      <div className="qr-indicator">
        Access Level: {qrCode ? qrCode.toUpperCase() : 'QR_1'}
      </div>
    </div>
  );
};

export default Canva;


