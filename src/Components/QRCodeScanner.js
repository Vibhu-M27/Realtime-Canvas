import React, { useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { auth, signInWithCustomToken } from "../firebase";

const QRCodeScanner = ({ onLogin }) => {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);

  const handleScanSuccess = async (decodedText) => {
    try {
      const { areaId, token } = JSON.parse(decodedText);
      
      // Authenticate user in Firebase
      await signInWithCustomToken(auth, token);
      
      // Pass areaId to parent
      onLogin(areaId);
    } catch (err) {
      setError("Invalid QR Code");
    }
  };

  const handleScanFailure = (err) => {
    console.error(err);
  };

  React.useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );
      scannerRef.current.render(handleScanSuccess, handleScanFailure);
    }
  }, []);

  return (
    <div>
      <div id="reader"></div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QRCodeScanner;
