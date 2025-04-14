const QRCode = require('qrcode');
const fs = require('fs');

// Define your dataset IDs
const datasetIds = ['dataset1', 'dataset2', 'dataset3', 'dataset4'];
const baseUrl = 'https://yourdomain.com/stickers'; // Change to your actual URL

// Generate QR codes for each dataset
datasetIds.forEach(datasetId => {
  const url = `${baseUrl}?dataset=${datasetId}`;
  
  // Generate QR code as an image file
  QRCode.toFile(`./public/qr-${datasetId}.png`, url, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300
  }, function(err) {
    if (err) throw err;
    console.log(`QR code for ${datasetId} created!`);
  });
});