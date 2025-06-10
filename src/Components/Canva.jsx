// import React, { useState, useEffect, useRef } from 'react';
// import { ref, set, push, onValue, update } from 'firebase/database';
// import { database } from '../firebaseConfig';
// import { useParams } from 'react-router-dom';
// import './Canva.css';

// // Dialogue Box Component
// const DialogueBox = ({ message, position, onClose, isOverlap }) => {
//   return (
//     <div
//       className={`dialogue-box ${isOverlap ? 'overlap' : ''}`}
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//       }}
//     >
//       <p>{message}</p>
//       <button onClick={onClose}>Got It!</button>
//     </div>
//   );
// };

// // Original images array
// const allImages = [
//   '/t_halli_dataset/guiiu.png',
//   '/t_halli_dataset/a_L7A8980.png',
//   '/t_halli_dataset/a_L7A8976.png',
//   '/t_halli_dataset/a_L7A8970 copy.png',
//   '/t_halli_dataset/a_L7A8968 copy.png',
//   '/t_halli_dataset/a_L7A8966.png',
//   '/t_halli_dataset/a_L7A8964.png',
//   '/t_halli_dataset/a_L7A8956.png',
//   '/t_halli_dataset/a_L7A8951.png',
//   '/t_halli_dataset/a_L7A8948.png',
//   '/t_halli_dataset/a_L7A8939.png',
//   '/t_halli_dataset/a_L7A8936.png',
//   '/t_halli_dataset/a_L7A8901.png',
//   '/t_halli_dataset/a_L7A8877.png',
//   '/t_halli_dataset/a_L7A8863.png',
//   '/t_halli_dataset/a_L7A8828.png',
//   '/t_halli_dataset/a_L7A8800.png',
//   '/t_halli_dataset/a_L7A8777 copy.png',
//   '/t_halli_dataset/a_L7A8773.png',
//   '/t_halli_dataset/a_L7A8764.png',
//   '/t_halli_dataset/a_L7A8763.png',
//   '/park_dataset/IMG_4061.png',
//   '/park_dataset/IMG_4059.png',
//   '/park_dataset/IMG_4029.png',
//   '/park_dataset/IMG_4025.png',
//   '/park_dataset/IMG_4023.png',
//   '/park_dataset/IMG_4020.png',
//   '/park_dataset/IMG_4019.png',
//   '/park_dataset/IMG_4012.png',
//   '/park_dataset/IMG_4011.png',
//   '/park_dataset/IMG_3989.png',
//   '/park_dataset/IMG_3986.png',
//   '/park_dataset/IMG_3985.png',
//   '/park_dataset/IMG_3980.png',
//   '/park_dataset/IMG_3979.png',
//   '/mustafabad_dataset/IMG_0088-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0084-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0082-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0081-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0059-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0058-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0052-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0045-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0043-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0038-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0036-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0033-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0032-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0031-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0027-removebg-preview.png',
//   '/mustafabad_dataset/IMG_0018-removebg-preview.png',
//   'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
//   'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
//   'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'
// ];

// // Split images into batches
// const imageBatches = {
//   qr_1: allImages.slice(0, 21),
//   qr_2: allImages.slice(21, 35),
//   qr_3: allImages.slice(35, 51),
//   qr_4: allImages.slice(51, 54)
// };

// const Canva = () => {
//   const { qrCode = 'qr_1' } = useParams();
//   const [availableImages, setAvailableImages] = useState(imageBatches[qrCode] || imageBatches.qr_1);
//   const [droppedImages, setDroppedImages] = useState([]);
//   const [positions, setPositions] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [rotations, setRotations] = useState([]);
//   const [locked, setLocked] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [imageKeys, setImageKeys] = useState([]);
//   const [scale, setScale] = useState(1);
//   const [translate, setTranslate] = useState({ x: 0, y: 0 });
//   const [dragging, setDragging] = useState(false);
//   const [start, setStart] = useState({ x: 0, y: 0 });
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [tutorialStep, setTutorialStep] = useState('initial');
//   const [dialogue, setDialogue] = useState(null);

//   const sidebarImagesRef = useRef([]);
//   const controlsRef = useRef(null);
//   const canvasRef = useRef(null);

//   // Update available images when qrCode changes
//   useEffect(() => {
//     const batch = imageBatches[qrCode] || imageBatches.qr_1;
//     setAvailableImages(batch);
//   }, [qrCode]);

//   // Show initial dialogue box
//   useEffect(() => {
//     if (tutorialStep === 'initial' && sidebarImagesRef.current.length > 0) {
//       const randomIndex = Math.floor(Math.random() * sidebarImagesRef.current.length);
//       const imgElement = sidebarImagesRef.current[randomIndex];
//       if (imgElement) {
//         const rect = imgElement.getBoundingClientRect();
//         setDialogue({
//           message: 'Drag this sticker and drop it onto the canvas to start creating!',
//           position: {
//             x: rect.left + rect.width / 2,
//             y: rect.top - 10,
//           },
//           isOverlap: false,
//         });
//       }
//     }
//   }, [tutorialStep]);

//   // Real-time Firebase listener
//   useEffect(() => {
//     const imagesRef = ref(database, 'droppedImages');
//     const unsubscribe = onValue(imagesRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const newImages = [];
//         const newPositions = [];
//         const newSizes = [];
//         const newRotations = [];
//         const newLocked = [];
//         const newKeys = [];

//         Object.entries(data).forEach(([key, item]) => {
//           newImages.push(item.image);
//           newPositions.push(item.position);
//           newSizes.push(item.size || 80);
//           newRotations.push(item.rotation || 0);
//           newLocked.push(item.locked || false);
//           newKeys.push(key);
//         });

//         setDroppedImages(newImages);
//         setPositions(newPositions);
//         setSizes(newSizes);
//         setRotations(newRotations);
//         setLocked(newLocked);
//         setImageKeys(newKeys);
//       } else {
//         setDroppedImages([]);
//         setPositions([]);
//         setSizes([]);
//         setRotations([]);
//         setLocked([]);
//         setImageKeys([]);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const startDrag = (event) => {
//     setDragging(true);
//     setStart({
//       x: event.clientX - translate.x,
//       y: event.clientY - translate.y
//     });
//   };

//   const handleTouchStart = (e) => {
//     if (e.touches.length === 1) {
//       const touch = e.touches[0];
//       const simulatedEvent = {
//         clientX: touch.clientX,
//         clientY: touch.clientY,
//       };
//       startDrag(simulatedEvent);
//     }
//   };

//   const handleTouchMove = (e) => {
//     if (e.touches.length === 1) {
//       const touch = e.touches[0];
//       const simulatedEvent = {
//         clientX: touch.clientX,
//         clientY: touch.clientY,
//       };
//       onDrag(simulatedEvent);
//     }
//   };

//   const endDrag = () => {
//     setDragging(false);
//   };

//   const onDrag = (event) => {
//     if (!dragging) return;
//     setTranslate({
//       x: event.clientX - start.x,
//       y: event.clientY - start.y
//     });
//   };

//   const handleWheelZoom = (event) => {
//     event.preventDefault();
//     const zoomFactor = 0.1;
//     const newScale = event.deltaY > 0 ? scale - zoomFactor : scale + zoomFactor;
//     setScale(Math.max(0.5, Math.min(3, newScale)));
//   };

//   const onDragStart = (event, image) => {
//     event.dataTransfer.setData('image', image);
//   };

//   const onDrop = (event) => {
//     event.preventDefault();
//     const image = event.dataTransfer.getData('image');
//     const rect = canvasRef.current.getBoundingClientRect();

//     const clientX = event.clientX || (event.touches && event.touches[0].clientX);
//     const clientY = event.clientY || (event.touches && event.touches[0].clientY);
//     const x = (clientX - rect.left - translate.x) / scale;
//     const y = (clientY - rect.top - translate.y) / scale;
//     const newSize = 80; // Default size for new stickers

//     // Collision detection
//     const newBox = {
//       left: x - newSize / 2,
//       right: x + newSize / 2,
//       top: y - newSize / 2,
//       bottom: y + newSize / 2,
//     };

//     const hasOverlap = positions.some((pos, idx) => {
//       const size = sizes[idx];
//       const existingBox = {
//         left: pos.x - size / 2,
//         right: pos.x + size / 2,
//         top: pos.y - size / 2,
//         bottom: pos.y + size / 2,
//       };

//       return !(
//         newBox.right < existingBox.left ||
//         newBox.left > existingBox.right ||
//         newBox.bottom < existingBox.top ||
//         newBox.top > existingBox.bottom
//       );
//     });

//     if (hasOverlap) {
//       // Show overlap dialogue
//       setDialogue({
//         message: 'Oops! This spot is taken. Try dropping the sticker somewhere else.',
//         position: {
//           x: clientX,
//           y: clientY - 50, // Position above drop point
//         },
//         isOverlap: true,
//       });
//       return;
//     }

//     // Proceed with drop if no overlap
//     const newDroppedImages = [...droppedImages, image];
//     const newPositions = [...positions, { x, y }];
//     const newSizes = [...sizes, newSize];
//     const newRotations = [...rotations, 0];
//     const newLocked = [...locked, false];

//     setHistory([...history, {
//       images: [...droppedImages],
//       positions: [...positions],
//       sizes: [...sizes],
//       rotations: [...rotations],
//       locked: [...locked]
//     }]);

//     setDroppedImages(newDroppedImages);
//     setPositions(newPositions);
//     setSizes(newSizes);
//     setRotations(newRotations);
//     setLocked(newLocked);

//     const imagesRef = ref(database, 'droppedImages');
//     const newImageRef = push(imagesRef);
//     const newKey = newImageRef.key;
//     setImageKeys([...imageKeys, newKey]);

//     set(newImageRef, {
//       image,
//       position: { x, y },
//       size: newSize,
//       rotation: 0,
//       locked: false
//     });

//     // Show controls dialogue after first drop
//     if (tutorialStep === 'initial') {
//       setTutorialStep('dropped');
//       setShowSidebar(false);
//       setTimeout(() => {
//         if (controlsRef.current) {
//           const rect = controlsRef.current.getBoundingClientRect();
//           setDialogue({
//             message: 'Click a sticker to select it, then use these buttons to resize, rotate, or lock it!',
//             position: {
//               x: rect.left + rect.width / 2,
//               y: rect.top - 10,
//             },
//             isOverlap: false,
//           });
//         }
//       }, 500);
//     }

//     setShowSidebar(false);
//   };

//   const undoLastAction = () => {
//     if (history.length > 0) {
//       const lastState = history[history.length - 1];
//       setDroppedImages(lastState.images);
//       setPositions(lastState.positions);
//       setSizes(lastState.sizes);
//       setRotations(lastState.rotations);
//       setLocked(lastState.locked);
//       setHistory(history.slice(0, -1));

//       const imagesRef = ref(database, 'droppedImages');
//       set(imagesRef, lastState.images.reduce((acc, img, idx) => {
//         acc[imageKeys[idx]] = {
//           image: img,
//           position: lastState.positions[idx],
//           size: lastState.sizes[idx],
//           rotation: lastState.rotations[idx],
//           locked: lastState.locked[idx]
//         };
//         return acc;
//       }, {}));

//       if (tutorialStep === 'controls') {
//         setTutorialStep('undo');
//         setTimeout(() => {
//           if (controlsRef.current) {
//             const rect = controlsRef.current.getBoundingClientRect();
//             setDialogue({
//               message: 'Mistake? Use the Undo button to go back!',
//               position: {
//                 x: rect.left + rect.width / 2,
//                 y: rect.top - 10,
//               },
//               isOverlap: false,
//             });
//           }
//         }, 500);
//       }
//     }
//   };

//   const toggleSidebar = () => {
//     setShowSidebar((prev) => !prev);
//     setSelectedIndex(null);
//   };

//   const handleSizeChange = (index, increment) => {
//     if (locked[index]) return;

//     const newSizes = [...sizes];
//     newSizes[index] = Math.max(40, newSizes[index] + increment);
//     setSizes(newSizes);

//     const imageRef = ref(database, `droppedImages/${imageKeys[index]}`);
//     update(imageRef, { size: newSizes[index] });
//   };

//   const handleRotate = (index, degrees) => {
//     if (locked[index]) return;

//     const newRotations = [...rotations];
//     newRotations[index] += degrees;
//     setRotations(newRotations);

//     const imageRef = ref(database, `droppedImages/${imageKeys[index]}`);
//     update(imageRef, { rotation: newRotations[index] });
//   };

//   const toggleLock = (index) => {
//     const newLocked = [...locked];
//     newLocked[index] = !newLocked[index];
//     setLocked(newLocked);

//     const imageRef = ref(database, `droppedImages/${imageKeys[index]}`);
//     update(imageRef, { locked: newLocked[index] });
//   };

//   const handleSelectSticker = (index) => {
//     setSelectedIndex(index);
//     if (tutorialStep === 'dropped') {
//       setTutorialStep('controls');
//       setTimeout(() => {
//         if (controlsRef.current) {
//           const rect = controlsRef.current.getBoundingClientRect();
//           setDialogue({
//             message: 'Use these buttons to resize, rotate, or lock your sticker. Lock it to prevent changes!',
//             position: {
//               x: rect.left + rect.width / 2,
//               y: rect.top - 10,
//             },
//             isOverlap: false,
//           });
//         }
//       }, 500);
//     }
//   };

//   const closeDialogue = () => {
//     setDialogue(null);
//   };

//   return (
//     <div
//       className="canva-container"
//       onMouseDown={startDrag}
//       onMouseMove={onDrag}
//       onMouseUp={endDrag}
//       onWheel={handleWheelZoom}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={endDrag}
//     >
//       {showSidebar ? (
//         <div className="sidebar">
//           {availableImages.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               alt={`img-${index}`}
//               draggable
//               onDragStart={(event) => onDragStart(event, image)}
//               ref={(el) => (sidebarImagesRef.current[index] = el)}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="sidebar-controls" ref={controlsRef}>
//           <button onClick={toggleSidebar}>Show Sidebar</button>
//           <button onClick={undoLastAction}>Undo</button>
//           {selectedIndex !== null && (
//             <>
//               <button onClick={() => handleSizeChange(selectedIndex, 10)}>Increase Size</button>
//               <button onClick={() => handleSizeChange(selectedIndex, -10)}>Decrease Size</button>
//               <button onClick={() => handleRotate(selectedIndex, 15)}>Rotate +15°</button>
//               <button onClick={() => handleRotate(selectedIndex, -15)}>Rotate -15°</button>
//               <button onClick={() => toggleLock(selectedIndex)}>
//                 {locked[selectedIndex] ? 'Unlock' : 'Lock'}
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       <div className="canva-wrapper">
//         <div
//           ref={canvasRef}
//           className="canva-space"
//           onDrop={onDrop}
//           onDragOver={(e) => e.preventDefault()}
//           style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
//         >
//           {droppedImages.map((image, index) => (
//             <img
//               key={imageKeys[index] || index}
//               src={image}
//               alt={`dropped-img-${index}`}
//               onClick={() => handleSelectSticker(index)}
//               style={{
//                 position: 'absolute',
//                 left: `${positions[index].x}px`,
//                 top: `${positions[index].y}px`,
//                 width: `${sizes[index]}px`,
//                 transform: `rotate(${rotations[index]}deg)`,
//                 cursor: locked[index] ? 'not-allowed' : 'pointer'
//               }}
//             />
//           ))}
//         </div>
//       </div>
//       <div className="qr-indicator">
//         Access Level: {qrCode ? qrCode.toUpperCase() : 'QR_1'}
//       </div>

//       {dialogue && (
//         <DialogueBox
//           message={dialogue.message}
//           position={dialogue.position}
//           onClose={closeDialogue}
//           isOverlap={dialogue.isOverlap}
//         />
//       )}
//     </div>
//   );
// };

// export default Canva;


import React, { useState, useEffect, useRef } from 'react';
import { ref, set, push, onValue, update } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Canva.css';

// Dialogue Box Component
const DialogueBox = ({ message, position, onClose, isOverlap }) => {
  useEffect(() => {
    const disableImageInteractions = (img) => {
      // Disable right-click
      const contextMenuHandler = (e) => e.preventDefault();
      img.addEventListener('contextmenu', contextMenuHandler);

      // Prevent long press on mobile
      let pressTimer;
      const touchStartHandler = (e) => {
        pressTimer = setTimeout(() => {
          e.preventDefault();
        }, 500);
      };
      const clearTimer = () => clearTimeout(pressTimer);

      img.addEventListener('touchstart', touchStartHandler);
      img.addEventListener('touchend', clearTimer);
      img.addEventListener('touchmove', clearTimer);

      // Clean up function (optional if you unmount images dynamically)
      return () => {
        img.removeEventListener('contextmenu', contextMenuHandler);
        img.removeEventListener('touchstart', touchStartHandler);
        img.removeEventListener('touchend', clearTimer);
        img.removeEventListener('touchmove', clearTimer);
      };
    };

    // Apply to existing images
    const images = document.querySelectorAll('img');
    images.forEach(disableImageInteractions);

    // Watch for future images (dynamically added)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IMG') {
            disableImageInteractions(node);
          } else if (node.querySelectorAll) {
            const imgs = node.querySelectorAll('img');
            imgs.forEach(disableImageInteractions);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Optional cleanup for observer
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`dialogue-box ${isOverlap ? 'overlap' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <p>{message}</p>
      <button onClick={onClose}>Got It!</button>
    </div>
  );
};

// Original images array
const allImages = [
    '/t_halli_dataset/guiiu.png',
    '/t_halli_dataset/a_L7A8980.png',
    '/t_halli_dataset/a_L7A8976.png',
    '/t_halli_dataset/a_L7A8970 copy.png',
    '/t_halli_dataset/a_L7A8968 copy.png',
    '/t_halli_dataset/a_L7A8966.png',
    '/t_halli_dataset/a_L7A8964.png',
    '/t_halli_dataset/a_L7A8956.png',
    '/t_halli_dataset/a_L7A8951.png',
    '/t_halli_dataset/a_L7A8948.png',
    '/t_halli_dataset/a_L7A8939.png',
    '/t_halli_dataset/a_L7A8936.png',
    '/t_halli_dataset/a_L7A8901.png',
    '/t_halli_dataset/a_L7A8877.png',
    '/t_halli_dataset/a_L7A8863.png',
    '/t_halli_dataset/a_L7A8828.png',
    '/t_halli_dataset/a_L7A8800.png',
    '/t_halli_dataset/a_L7A8777 copy.png',
    '/t_halli_dataset/a_L7A8773.png',
    '/t_halli_dataset/a_L7A8764.png',
    '/t_halli_dataset/a_L7A8763.png',
    '/park_dataset/IMG_4061.png',
    '/park_dataset/IMG_4059.png',
    '/park_dataset/IMG_4029.png',
    '/park_dataset/IMG_4025.png',
    '/park_dataset/IMG_4023.png',
    '/park_dataset/IMG_4020.png',
    '/park_dataset/IMG_4019.png',
    '/park_dataset/IMG_4012.png',
    '/park_dataset/IMG_4011.png',
    '/park_dataset/IMG_3989.png',
    '/park_dataset/IMG_3986.png',
    '/park_dataset/IMG_3985.png',
    '/park_dataset/IMG_3980.png',
    '/park_dataset/IMG_3979.png',
    '/mustafabad_dataset/IMG_0088-removebg-preview.png',
    '/mustafabad_dataset/IMG_0084-removebg-preview.png',
    '/mustafabad_dataset/IMG_0082-removebg-preview.png',
    '/mustafabad_dataset/IMG_0081-removebg-preview.png',
    '/mustafabad_dataset/IMG_0059-removebg-preview.png',
    '/mustafabad_dataset/IMG_0058-removebg-preview.png',
    '/mustafabad_dataset/IMG_0052-removebg-preview.png',
    '/mustafabad_dataset/IMG_0045-removebg-preview.png',
    '/mustafabad_dataset/IMG_0043-removebg-preview.png',
    '/mustafabad_dataset/IMG_0038-removebg-preview.png',
    '/mustafabad_dataset/IMG_0036-removebg-preview.png',
    '/mustafabad_dataset/IMG_0033-removebg-preview.png',
    '/mustafabad_dataset/IMG_0032-removebg-preview.png',
    '/mustafabad_dataset/IMG_0031-removebg-preview.png',
    '/mustafabad_dataset/IMG_0027-removebg-preview.png',
    '/mustafabad_dataset/IMG_0018-removebg-preview.png',
    'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
    'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
    'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'
  ];

// Split images into batches
const imageBatches = {
  qr_1: allImages.slice(0, 21),
  qr_2: allImages.slice(21, 35),
  qr_3: allImages.slice(35, 51),
  qr_4: allImages.slice(51, 54)
};

const Canva = () => {
  const { qrCode = 'qr_1' } = useParams();
  const [availableImages, setAvailableImages] = useState(imageBatches[qrCode] || imageBatches.qr_1);
  const [droppedImages, setDroppedImages] = useState([]);
  const [positions, setPositions] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [texts, setTexts] = useState([]);
  const [locked, setLocked] = useState([]);
  const [history, setHistory] = useState([]);
  const [imageKeys, setImageKeys] = useState([]);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [tutorialStep, setTutorialStep] = useState('initial');
  const [dialogue, setDialogue] = useState(null);
  const [imageDataCache, setImageDataCache] = useState({});
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchAngle, setTouchAngle] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [draggingSticker, setDraggingSticker] = useState(false);
  const [draggingText, setDraggingText] = useState(false);
  const [editTextMode, setEditTextMode] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [lastValidPosition, setLastValidPosition] = useState([]);

  const sidebarImagesRef = useRef([]);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);

  useEffect(() => {
    const batch = imageBatches[qrCode] || imageBatches.qr_1;
    setAvailableImages(batch);
  }, [qrCode]);

  useEffect(() => {
    const cacheImages = async () => {
      const canvas = hiddenCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const cache = {};

      for (const image of allImages) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = image;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        if (img.complete && img.naturalWidth !== 0) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          cache[image] = imageData;
        }
      }
      setImageDataCache(cache);
    };

    cacheImages();
  }, []);

  useEffect(() => {
    if (tutorialStep === 'initial' && sidebarImagesRef.current.length > 0) {
      const randomIndex = Math.floor(Math.random() * sidebarImagesRef.current.length);
      const imgElement = sidebarImagesRef.current[randomIndex];
      if (imgElement) {
        const rect = imgElement.getBoundingClientRect();
        setDialogue({
          message: 'Drag this sticker and drop it onto the canvas to start creating!',
          position: {
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          },
          isOverlap: false,
        });
      }
    }
  }, [tutorialStep]);

  useEffect(() => {
    const imagesRef = ref(database, 'droppedImages');
    const unsubscribe = onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newImages = [];
        const newPositions = [];
        const newSizes = [];
        const newRotations = [];
        const newTexts = [];
        const newLocked = [];
        const newKeys = [];

        Object.entries(data).forEach(([key, item]) => {
          newImages.push(item.image);
          newPositions.push(item.position);
          newSizes.push(item.size || 60);
          newRotations.push(item.rotation || 0);
          newTexts.push(item.text || { content: '', position: { x: 0, y: 0 }, color: '#000000' });
          newLocked.push(item.locked || false);
          newKeys.push(key);
        });

        setDroppedImages(newImages);
        setPositions(newPositions);
        setSizes(newSizes);
        setRotations(newRotations);
        setTexts(newTexts);
        setLocked(newLocked);
        setImageKeys(newKeys);
        setLastValidPosition(newPositions);
      } else {
        setDroppedImages([]);
        setPositions([]);
        setSizes([]);
        setRotations([]);
        setTexts([]);
        setLocked([]);
        setImageKeys([]);
        setLastValidPosition([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const startDrag = (event) => {
    if (selectedIndex !== null || resizing || rotating || draggingSticker || draggingText || editTextMode) return;
    setDragging(true);
    setStart({
      x: event.clientX - translate.x,
      y: event.clientY - translate.y
    });
  };

  const handleTouchStart = (e) => {
    if (editTextMode) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const simulatedEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
      if (selectedIndex !== null) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (touch.clientX - rect.left - translate.x) / scale;
        const y = (touch.clientY - rect.top - translate.y) / scale;
        const stickerX = positions[selectedIndex].x;
        const stickerY = positions[selectedIndex].y;
        const size = sizes[selectedIndex];
        const halfSize = size / 2;

        const resizeHandleX = stickerX + halfSize;
        const resizeHandleY = stickerY + halfSize;
        if (Math.abs(x - resizeHandleX) < 20 && Math.abs(y - resizeHandleY) < 20) {
          setResizing(true);
          setStart({ x: touch.clientX, y: touch.clientY });
          return;
        }

        const rotateHandleX = stickerX;
        const rotateHandleY = stickerY - halfSize - 20;
        if (Math.abs(x - rotateHandleX) < 20 && Math.abs(y - rotateHandleY) < 20) {
          setRotating(true);
          setStart({ x: touch.clientX, y: touch.clientY });
          return;
        }

        const text = texts[selectedIndex];
        if (text.content) {
          const textX = stickerX + text.position.x;
          const textY = stickerY + text.position.y;
          if (Math.abs(x - textX) < 50 && Math.abs(y - textY) < 20) {
            setDraggingText(true);
            setStart({ x: touch.clientX, y: touch.clientY });
            return;
          }
        }

        if (x >= stickerX - halfSize && x <= stickerX + halfSize && y >= stickerY - halfSize && y <= stickerY + halfSize) {
          setDraggingSticker(true);
          setStart({ x: touch.clientX, y: touch.clientY });
          return;
        }
      }
      startDrag(simulatedEvent);
    } else if (e.touches.length === 2 && selectedIndex !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2
      );
      setTouchDistance(distance);

      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * (180 / Math.PI);
      setTouchAngle(angle);
    }
  };

  const handleTouchMove = (e) => {
    if (editTextMode) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const simulatedEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
      if (resizing) {
        handleResizeMove(simulatedEvent);
      } else if (rotating) {
        handleRotateMove(simulatedEvent);
      } else if (draggingSticker) {
        handleStickerDragMove(simulatedEvent);
      } else if (draggingText) {
        handleTextDragMove(simulatedEvent);
      } else {
        onDrag(simulatedEvent);
      }
    } else if (e.touches.length === 2 && selectedIndex !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2
      );
      const newAngle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * (180 / Math.PI);

      if (touchDistance) {
        const sizeFactor = newDistance / touchDistance;
        const newSize = sizes[selectedIndex] * sizeFactor;
        const newSizes = [...sizes];
        newSizes[selectedIndex] = Math.max(40, newSize);
        setSizes(newSizes);

        const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
        update(imageRef, { size: newSizes[selectedIndex] });
      }

      if (touchAngle !== null) {
        const angleDiff = newAngle - touchAngle;
        const newRotations = [...rotations];
        newRotations[selectedIndex] += angleDiff;
        setRotations(newRotations);

        const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
        update(imageRef, { rotation: newRotations[selectedIndex] });
      }

      setTouchDistance(newDistance);
      setTouchAngle(newAngle);
    }
  };

  const endDrag = () => {
    setDragging(false);
    setResizing(false);
    setRotating(false);
    setDraggingSticker(false);
    setDraggingText(false);
    setTouchDistance(null);
    setTouchAngle(null);
  };

  const onDrag = (event) => {
    if (!dragging || selectedIndex !== null || resizing || rotating || draggingSticker || draggingText || editTextMode) return;
    let newX = event.clientX - start.x;
    let newY = event.clientY - start.y;

    const canvasWidth = window.innerWidth * 5;
    const canvasHeight = window.innerHeight * 5;
    const viewportWidth = window.innerWidth - (showSidebar ? window.innerWidth * 0.2 : 0);
    const viewportHeight = window.innerHeight;
    const scaledCanvasWidth = canvasWidth * scale;
    const scaledCanvasHeight = canvasHeight * scale;

    newX = Math.min(viewportWidth * (1 - scale), Math.max(newX, -(scaledCanvasWidth - viewportWidth)));
    newY = Math.min(viewportHeight * (1 - scale), Math.max(newY, -(scaledCanvasHeight - viewportHeight)));

    setTranslate({ x: newX, y: newY });
  };

  const handleMouseDown = (event, type) => {
    if (selectedIndex === null || locked[selectedIndex] || editTextMode) return;
    if (type === 'resize') {
      setResizing(true);
    } else if (type === 'rotate') {
      setRotating(true);
    } else if (type === 'sticker') {
      setDraggingSticker(true);
    } else if (type === 'text') {
      setDraggingText(true);
    }
    setStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (editTextMode) return;
    if (resizing) {
      handleResizeMove(event);
    } else if (rotating) {
      handleRotateMove(event);
    } else if (draggingSticker) {
      handleStickerDragMove(event);
    } else if (draggingText) {
      handleTextDragMove(event);
    } else {
      onDrag(event);
    }
  };

  const handleResizeMove = (event) => {
    if (!resizing || selectedIndex === null || locked[selectedIndex]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (event.clientX - rect.left - translate.x) / scale;
    const stickerX = positions[selectedIndex].x;
    const stickerY = positions[selectedIndex].y;
    const newSize = Math.max(40, (newX - stickerX) * 2);
    const newSizes = [...sizes];
    newSizes[selectedIndex] = newSize;
    setSizes(newSizes);

    const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
    update(imageRef, { size: newSize });
  };

  const handleRotateMove = (event) => {
    if (!rotating || selectedIndex === null || locked[selectedIndex]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const stickerX = (positions[selectedIndex].x * scale + translate.x + rect.left);
    const stickerY = (positions[selectedIndex].y * scale + translate.y + rect.top);
    const angle = Math.atan2(
      event.clientY - stickerY,
      event.clientX - stickerX
    ) * (180 / Math.PI);
    const newRotations = [...rotations];
    newRotations[selectedIndex] = angle + 90;
    setRotations(newRotations);

    const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
    update(imageRef, { rotation: newRotations[selectedIndex] });
  };

  const handleStickerDragMove = (event) => {
    if (!draggingSticker || selectedIndex === null || locked[selectedIndex]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (event.clientX - rect.left - translate.x) / scale;
    const newY = (event.clientY - rect.top - translate.y) / scale;

    const viewportWidth = window.innerWidth - (showSidebar ? window.innerWidth * 0.2 : 0);
    const viewportHeight = window.innerHeight;
    const halfSize = sizes[selectedIndex] / 2;
    const constrainedX = Math.max(halfSize, Math.min(viewportWidth - halfSize, newX));
    const constrainedY = Math.max(halfSize, Math.min(viewportHeight - halfSize, newY));

    const newPosition = { x: constrainedX, y: constrainedY };

    const newImg = new Image();
    newImg.crossOrigin = "Anonymous";
    newImg.src = droppedImages[selectedIndex];
    const newWidth = sizes[selectedIndex];
    const newHeight = (newImg.naturalHeight / newImg.naturalWidth) * newWidth;
    const rotation = rotations[selectedIndex];

    const collisionResult = checkPixelCollision(constrainedX, constrainedY, newImg, newWidth, newHeight, rotation, selectedIndex);
    if (!collisionResult.overlaps) {
      const newPositions = [...positions];
      newPositions[selectedIndex] = newPosition;
      setPositions(newPositions);
      const newLastValidPosition = [...lastValidPosition];
      newLastValidPosition[selectedIndex] = newPosition;
      setLastValidPosition(newLastValidPosition);

      const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
      update(imageRef, { position: newPosition });
    } else {
      // Try to find a nearby valid position instead of reverting immediately
      const adjustedPosition = findNearbyValidPosition(constrainedX, constrainedY, newImg, newWidth, newHeight, rotation, selectedIndex);
      const newPositions = [...positions];
      newPositions[selectedIndex] = adjustedPosition;
      setPositions(newPositions);
      const newLastValidPosition = [...lastValidPosition];
      newLastValidPosition[selectedIndex] = adjustedPosition;
      setLastValidPosition(newLastValidPosition);

      const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
      update(imageRef, { position: adjustedPosition });
    }
  };

  const handleTextDragMove = (event) => {
    if (!draggingText || selectedIndex === null || locked[selectedIndex]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const stickerX = positions[selectedIndex].x;
    const stickerY = positions[selectedIndex].y;
    const newTextX = (event.clientX - rect.left - translate.x) / scale - stickerX;
    const newTextY = (event.clientY - rect.top - translate.y) / scale - stickerY;

    const newTexts = [...texts];
    newTexts[selectedIndex] = { ...newTexts[selectedIndex], position: { x: newTextX, y: newTextY } };
    setTexts(newTexts);

    const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
    update(imageRef, { text: newTexts[selectedIndex] });
  };

  const handleWheelZoom = (event) => {
    if (selectedIndex !== null || editTextMode) return;
    event.preventDefault();
    const zoomFactor = 0.1;
    const newScale = event.deltaY > 0 ? scale - zoomFactor : scale + zoomFactor;
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  const zoomIn = () => {
    const newScale = scale + 0.1;
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  const zoomOut = () => {
    const newScale = scale - 0.1;
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  const panCanvas = (direction) => {
    const panStep = 100;
    let newX = translate.x;
    let newY = translate.y;

    const canvasWidth = window.innerWidth * 5;
    const canvasHeight = window.innerHeight * 5;
    const viewportWidth = window.innerWidth - (showSidebar ? window.innerWidth * 0.2 : 0);
    const viewportHeight = window.innerHeight;
    const scaledCanvasWidth = canvasWidth * scale;
    const scaledCanvasHeight = canvasHeight * scale;

    switch (direction) {
      case 'up':
        newY += panStep;
        break;
      case 'down':
        newY -= panStep;
        break;
      case 'left':
        newX += panStep;
        break;
      case 'right':
        newX -= panStep;
        break;
      default:
        break;
    }

    newX = Math.min(viewportWidth * (1 - scale), Math.max(newX, -(scaledCanvasWidth - viewportWidth)));
    newY = Math.min(viewportHeight * (1 - scale), Math.max(newY, -(scaledCanvasHeight - viewportHeight)));

    setTranslate({ x: newX, y: newY });
  };

  const resetView = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const onDragStart = (event, image) => {
    event.dataTransfer.setData('image', image);
  };

  const onDrop = async (event) => {
    event.preventDefault();
    const image = event.dataTransfer.getData('image');
    const rect = canvasRef.current.getBoundingClientRect();

    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);

    let x = (clientX - rect.left - translate.x) / scale;
    let y = (clientY - rect.top - translate.y) / scale;
    const newSize = 60;

    const viewportWidth = window.innerWidth - (showSidebar ? window.innerWidth * 0.2 : 0);
    const viewportHeight = window.innerHeight;
    const halfSize = newSize / 2;
    x = Math.max(halfSize, Math.min(viewportWidth - halfSize, x));
    y = Math.max(halfSize, Math.min(viewportHeight - halfSize, y));

    const newImg = new Image();
    newImg.crossOrigin = "Anonymous";
    newImg.src = image;
    await new Promise((resolve) => {
      newImg.onload = resolve;
      newImg.onerror = resolve;
    });

    if (!newImg.complete || newImg.naturalWidth === 0) {
      setDialogue({
        message: 'Failed to load the sticker. Try another one.',
        position: { x: clientX, y: clientY - 50 },
        isOverlap: true,
      });
      return;
    }

    const newWidth = newSize;
    const newHeight = (newImg.naturalHeight / newImg.naturalWidth) * newSize;

    const checkBoundingBoxCollision = (testX, testY, newImgWidth, newImgHeight) => {
      for (let idx = 0; idx < droppedImages.length; idx++) {
        const existingPos = positions[idx];
        const existingSize = sizes[idx];
        const existingWidth = existingSize;
        const existingHeight = (newImg.naturalHeight / newImg.naturalWidth) * existingSize;

        const newLeft = testX - newImgWidth / 2;
        const newTop = testY - newImgHeight / 2;
        const existingLeft = existingPos.x - existingWidth / 2;
        const existingTop = existingPos.y - existingHeight / 2;

        const overlapRight = Math.min(newLeft + newImgWidth, existingLeft + existingWidth);
        const overlapBottom = Math.min(newTop + newImgHeight, existingTop + existingHeight);
        const overlapLeft = Math.max(newLeft, existingLeft);
        const overlapTop = Math.max(newTop, existingTop);

        if (overlapRight > overlapLeft && overlapBottom > overlapTop) {
          return { overlaps: true, idx, existingPos, existingWidth, existingHeight };
        }
      }
      return { overlaps: false };
    };

    const checkPixelCollision = (testX, testY, newImage, newImgWidth, newImgHeight, rotation = 0, excludeIndex = -1) => {
      const canvas = hiddenCanvasRef.current;
      const ctx = canvas.getContext('2d');

      // Step 1: Compute the bounding box of the rotated new image to set canvas size
      const rad = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const rotatedWidth = newImgWidth * cos + newImgHeight * sin;
      const rotatedHeight = newImgWidth * sin + newImgHeight * cos;

      // Set canvas size to accommodate the rotated image
      canvas.width = Math.ceil(rotatedWidth);
      canvas.height = Math.ceil(rotatedHeight);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Step 2: Draw the new image with rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(newImage, -newImgWidth / 2, -newImgHeight / 2, newImgWidth, newImgHeight);
      ctx.restore();
      const newData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      for (let idx = 0; idx < droppedImages.length; idx++) {
        if (idx === excludeIndex) continue;

        const existingImage = droppedImages[idx];
        const existingPos = positions[idx];
        const existingSize = sizes[idx];
        const existingRotation = rotations[idx];

        const existingImg = new Image();
        existingImg.crossOrigin = "Anonymous";
        existingImg.src = existingImage;

        const existingWidth = existingSize;
        const existingHeight = (existingImg.naturalHeight / existingImg.naturalWidth) * existingSize;

        // Compute bounding box of the rotated existing image
        const existingRad = (existingRotation * Math.PI) / 180;
        const existingCos = Math.abs(Math.cos(existingRad));
        const existingSin = Math.abs(Math.sin(existingRad));
        const existingRotatedWidth = existingWidth * existingCos + existingHeight * existingSin;
        const existingRotatedHeight = existingWidth * existingSin + existingHeight * existingCos;

        // Early bounding box check
        const maxSize = Math.max(rotatedWidth, existingRotatedWidth);
        if (
          Math.abs(testX - existingPos.x) > maxSize / 2 ||
          Math.abs(testY - existingPos.y) > maxSize / 2
        ) {
          continue;
        }

        // Draw the existing image with rotation
        canvas.width = Math.ceil(existingRotatedWidth);
        canvas.height = Math.ceil(existingRotatedHeight);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(existingRad);
        ctx.drawImage(existingImg, -existingWidth / 2, -existingHeight / 2, existingWidth, existingHeight);
        ctx.restore();
        const existingData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // Compute the overlapping region in canvas coordinates
        const newLeft = testX - rotatedWidth / 2;
        const newTop = testY - rotatedHeight / 2;
        const existingLeft = existingPos.x - existingRotatedWidth / 2;
        const existingTop = existingPos.y - existingRotatedHeight / 2;

        const overlapLeft = Math.max(newLeft, existingLeft);
        const overlapTop = Math.max(newTop, existingTop);
        const overlapRight = Math.min(newLeft + rotatedWidth, existingLeft + existingRotatedWidth);
        const overlapBottom = Math.min(newTop + rotatedHeight, existingTop + existingRotatedHeight);

        if (overlapRight <= overlapLeft || overlapBottom <= overlapTop) {
          continue;
        }

        // Check pixel-by-pixel in the overlap region
        for (let px = Math.floor(overlapLeft); px < Math.ceil(overlapRight); px++) {
          for (let py = Math.floor(overlapTop); py < Math.ceil(overlapBottom); py++) {
            // Convert to canvas coordinates for the new image
            const newPx = Math.floor(px - newLeft);
            const newPy = Math.floor(py - newTop);
            // Convert to canvas coordinates for the existing image
            const existingPx = Math.floor(px - existingLeft);
            const existingPy = Math.floor(py - existingTop);

            if (
              newPx >= 0 && newPx < canvas.width &&
              newPy >= 0 && newPy < canvas.height &&
              existingPx >= 0 && existingPx < canvas.width &&
              existingPy >= 0 && existingPy < canvas.height
            ) {
              const newIndex = (newPy * Math.ceil(rotatedWidth) + newPx) * 4 + 3; // Alpha channel
              const existingIndex = (existingPy * Math.ceil(existingRotatedWidth) + existingPx) * 4 + 3;

              if (newData[newIndex] > 0 && existingData[existingIndex] > 0) {
                return { overlaps: true, idx };
              }
            }
          }
        }
      }
      return { overlaps: false };
    };

    const findNearbyValidPosition = (startX, startY, newImg, newImgWidth, newImgHeight, rotation, excludeIndex) => {
      let bestPosition = { x: startX, y: startY };
      let minDistance = Infinity;
      let foundValid = false;

      const stepSize = 5; // Smaller step size for finer adjustments
      const maxSteps = 20; // Limit the search radius

      for (let step = 0; step <= maxSteps; step++) {
        const radius = step * stepSize;
        const angleStep = 45;
        for (let angle = 0; angle < 360; angle += angleStep) {
          const radian = (angle * Math.PI) / 180;
          const testX = startX + radius * Math.cos(radian);
          const testY = startY + radius * Math.sin(radian);

          const viewportWidth = window.innerWidth - (showSidebar ? window.innerWidth * 0.2 : 0);
          const viewportHeight = window.innerHeight;
          const halfSize = newImgWidth / 2;
          const constrainedX = Math.max(halfSize, Math.min(viewportWidth - halfSize, testX));
          const constrainedY = Math.max(halfSize, Math.min(viewportHeight - halfSize, testY));

          const collisionResult = checkPixelCollision(constrainedX, constrainedY, newImg, newImgWidth, newImgHeight, rotation, excludeIndex);
          if (!collisionResult.overlaps) {
            const distance = Math.sqrt((constrainedX - startX) ** 2 + (constrainedY - startY) ** 2);
            if (distance < minDistance) {
              minDistance = distance;
              bestPosition = { x: constrainedX, y: constrainedY };
              foundValid = true;
            }
          }
        }
        if (foundValid) break; // Stop searching once a valid position is found
      }

      return bestPosition;
    };

    const findNearestNonOverlappingPosition = (startX, startY, newImg, newImgWidth, newImgHeight) => {
      let bbResult = checkBoundingBoxCollision(startX, startY, newImgWidth, newImgHeight);
      if (!bbResult.overlaps) {
        return { x: startX, y: startY, found: true };
      }

      let pixelResult = checkPixelCollision(startX, startY, newImg, newImgWidth, newImgHeight, 0);
      if (!pixelResult.overlaps) {
        return { x: startX, y: startY, found: true };
      }

      const maxSearchRadius = 50;
      const radiusStep = 0.5;
      const angleStep = 45;

      for (let radius = radiusStep; radius <= maxSearchRadius; radius += radiusStep) {
        for (let angle = 0; angle < 360; angle += angleStep) {
          const radian = (angle * Math.PI) / 180;
          const testX = startX + radius * Math.cos(radian);
          const testY = startY + radius * Math.sin(radian);

          const constrainedX = Math.max(halfSize, Math.min(viewportWidth - halfSize, testX));
          const constrainedY = Math.max(halfSize, Math.min(viewportHeight - halfSize, testY));

          let bbResult = checkBoundingBoxCollision(constrainedX, constrainedY, newImgWidth, newImgHeight);
          if (!bbResult.overlaps) {
            return { x: constrainedX, y: constrainedY, found: true };
          }

          let pixelResult = checkPixelCollision(constrainedX, constrainedY, newImg, newImgWidth, newImgHeight, 0);
          if (!pixelResult.overlaps) {
            return { x: constrainedX, y: constrainedY, found: true };
          }
        }
      }

      return { x: startX, y: startY, found: false };
    };

    let finalPosition = { x, y, found: true };
    let bbResult = checkBoundingBoxCollision(x, y, newWidth, newHeight);
    if (bbResult.overlaps) {
      let pixelResult = checkPixelCollision(x, y, newImg, newWidth, newHeight, 0);
      if (pixelResult.overlaps) {
        finalPosition = findNearestNonOverlappingPosition(x, y, newImg, newWidth, newHeight);
        if (!finalPosition.found) {
          setDialogue({
            message: 'No nearby spot available! Try dropping elsewhere.',
            position: { x: clientX, y: clientY - 50 },
            isOverlap: true,
          });
          return;
        }
      }
    }

    x = finalPosition.x;
    y = finalPosition.y;

    const newDroppedImages = [...droppedImages, image];
    const newPositions = [...positions, { x, y }];
    const newSizes = [...sizes, newSize];
    const newRotations = [...rotations, 0];
    const newTexts = [...texts, { content: '', position: { x: 0, y: 0 }, color: '#000000' }];
    const newLocked = [...locked, false];
    const newLastValidPosition = [...lastValidPosition, { x, y }];

    setHistory([...history, {
      images: [...droppedImages],
      positions: [...positions],
      sizes: [...sizes],
      rotations: [...rotations],
      texts: [...texts],
      locked: [...locked]
    }]);

    setDroppedImages(newDroppedImages);
    setPositions(newPositions);
    setSizes(newSizes);
    setRotations(newRotations);
    setTexts(newTexts);
    setLocked(newLocked);
    setLastValidPosition(newLastValidPosition);

    const imagesRef = ref(database, 'droppedImages');
    const newImageRef = push(imagesRef);
    const newKey = newImageRef.key;
    setImageKeys([...imageKeys, newKey]);

    set(newImageRef, {
      image,
      position: { x, y },
      size: newSize,
      rotation: 0,
      text: { content: '', position: { x: 0, y: 0 }, color: '#000000' },
      locked: false
    });

    if (tutorialStep === 'initial') {
      setTutorialStep('dropped');
      setShowSidebar(false);
      setTimeout(() => {
        if (controlsRef.current) {
          const rect = controlsRef.current.getBoundingClientRect();
          setDialogue({
            message: 'Click a sticker to select it, then use these controls to edit it!',
            position: {
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
            },
            isOverlap: false,
          });
        }
      }, 500);
    }

    setShowSidebar(false);
  };

  const undoLastAction = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setDroppedImages(lastState.images);
      setPositions(lastState.positions);
      setSizes(lastState.sizes);
      setRotations(lastState.rotations);
      setTexts(lastState.texts || []);
      setLocked(lastState.locked);
      setLastValidPosition(lastState.positions);
      setHistory(history.slice(0, -1));

      const imagesRef = ref(database, 'droppedImages');
      set(imagesRef, lastState.images.reduce((acc, img, idx) => {
        acc[imageKeys[idx]] = {
          image: img,
          position: lastState.positions[idx],
          size: lastState.sizes[idx],
          rotation: lastState.rotations[idx],
          text: lastState.texts ? lastState.texts[idx] : { content: '', position: { x: 0, y: 0 }, color: '#000000' },
          locked: lastState.locked[idx]
        };
        return acc;
      }, {}));

      if (tutorialStep === 'controls') {
        setTutorialStep('undo');
        setTimeout(() => {
          if (controlsRef.current) {
            const rect = controlsRef.current.getBoundingClientRect();
            setDialogue({
              message: 'Mistake? Use the Undo button to go back!',
              position: {
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
              },
              isOverlap: false,
            });
          }
        }, 500);
      }
    }
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
    setSelectedIndex(null);
    setEditTextMode(false);
  };

  const addTextToSticker = () => {
    if (selectedIndex === null || locked[selectedIndex]) return;
    setEditTextMode(true);
    setTextContent(texts[selectedIndex].content || 'Enter text');
    setTextColor(texts[selectedIndex].color || '#000000');
  };

  const saveText = () => {
    if (selectedIndex === null) return;
    const newTexts = [...texts];
    newTexts[selectedIndex] = {
      content: textContent,
      position: newTexts[selectedIndex].position || { x: 0, y: 0 },
      color: textColor
    };
    setTexts(newTexts);

    const imageRef = ref(database, `droppedImages/${imageKeys[selectedIndex]}`);
    update(imageRef, { text: newTexts[selectedIndex] });

    setEditTextMode(false);
  };

  const handleSelectSticker = (index) => {
    setSelectedIndex(index);
    setEditTextMode(false);
    if (tutorialStep === 'dropped') {
      setTutorialStep('controls');
      setTimeout(() => {
        if (controlsRef.current) {
          const rect = controlsRef.current.getBoundingClientRect();
          setDialogue({
            message: 'Use these controls to resize, rotate, add text, or lock your sticker!',
            position: {
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
            },
            isOverlap: false,
          });
        }
      }, 500);
    }
  };

  const toggleLock = (index) => {
    const newLocked = [...locked];
    newLocked[index] = !newLocked[index];
    setLocked(newLocked);

    const imageRef = ref(database, `droppedImages/${imageKeys[index]}`);
    update(imageRef, { locked: newLocked[index] });
  };

  const closeDialogue = () => {
    setDialogue(null);
  };

  return (
    <div
      className="canva-container"
      onMouseDown={startDrag}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onWheel={handleWheelZoom}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={endDrag}
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
              ref={(el) => (sidebarImagesRef.current[index] = el)}
            />
          ))}
        </div>
      ) : (
        <div className="sidebar-controls" ref={controlsRef}>
          <button onClick={toggleSidebar}>Show Sidebar</button>
          <button onClick={undoLastAction}>Undo</button>
          {selectedIndex !== null && !editTextMode && (
            <>
              <button onClick={addTextToSticker}>Add Text</button>
              <button onClick={() => toggleLock(selectedIndex)}>
                {locked[selectedIndex] ? 'Unlock' : 'Lock'}
              </button>
            </>
          )}
          {editTextMode && selectedIndex !== null && (
            <div className="text-editor">
              <input
                type="text"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
              <button onClick={saveText}>Save Text</button>
            </div>
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
            <div
              key={imageKeys[index] || index}
              className={`sticker-wrapper ${selectedIndex === index ? 'selected' : ''}`}
              style={{
                position: 'absolute',
                left: `${positions[index].x}px`,
                top: `${positions[index].y}px`,
                transform: `rotate(${rotations[index]}deg)`,
                cursor: locked[index] ? 'not-allowed' : 'move'
              }}
            >
              <img
                src={image}
                alt={`dropped-img-${index}`}
                onMouseDown={(e) => handleMouseDown(e, 'sticker')}
                onClick={() => handleSelectSticker(index)}
                style={{
                  width: `${sizes[index]}px`,
                  display: 'block',
                }}
              />
              {texts[index].content && (
                <div
                  className="text-overlay"
                  style={{
                    position: 'absolute',
                    left: `${texts[index].position.x}px`,
                    top: `${texts[index].position.y}px`,
                    color: texts[index].color,
                    cursor: locked[index] ? 'not-allowed' : 'move'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'text')}
                >
                  {texts[index].content}
                </div>
              )}
              {selectedIndex === index && !locked[index] && !editTextMode && (
                <>
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => handleMouseDown(e, 'resize')}
                    style={{
                      position: 'absolute',
                      right: `-${sizes[index] / 2}px`,
                      bottom: `-${sizes[index] / 2}px`,
                    }}
                  />
                  <div
                    className="rotate-handle"
                    onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                    style={{
                      position: 'absolute',
                      top: `-${sizes[index] / 2 + 20}px`,
                      left: '0',
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-controls">
        <button onClick={() => panCanvas('up')}>↑</button>
        <div className="horizontal-nav">
          <button onClick={() => panCanvas('left')}>←</button>
          <button onClick={resetView}>Reset View</button>
          <button onClick={() => panCanvas('right')}>→</button>
        </div>
        <button onClick={() => panCanvas('down')}>↓</button>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>

      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
      <div className="qr-indicator">
        Access Level: {qrCode ? qrCode.toUpperCase() : 'QR_1'}
      </div>

      {dialogue && (
        <DialogueBox
          message={dialogue.message}
          position={dialogue.position}
          onClose={closeDialogue}
          isOverlap={dialogue.isOverlap}
        />
      )}
    </div>
  );
};

export default Canva;