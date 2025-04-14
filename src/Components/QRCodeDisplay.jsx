// import React from 'react';

// const QRCodeDisplay = () => {
//   const datasets = [
//     { id: 'dataset1', description: 'First Sticker Collection' },
//     { id: 'dataset2', description: 'Second Sticker Collection' },
//     { id: 'dataset3', description: 'Third Sticker Collection' },
//     { id: 'dataset4', description: 'Fourth Sticker Collection' },
//   ];

//   return (
//     <div className="qr-display-container">
//       <h1>Scan a QR Code to Use Stickers</h1>
//       <div className="qr-grid">
//         {datasets.map(dataset => (
//           <div key={dataset.id} className="qr-item">
//             <h2>{dataset.description}</h2>
//             <img 
//               src={`/qr-${dataset.id}.png`}
//               alt={`QR Code for ${dataset.description}`}
//               width="200"
//               height="200"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QRCodeDisplay;