import React, { useState } from "react";
import QRCodeScanner from "../Components/QRCodeScanner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const LoginPage = () => {
  const [user] = useAuthState(auth);
  const [areaId, setAreaId] = useState(null);

  if (user) {
    return <h2>Logged in! Redirecting...</h2>;
  }

  return (
    <div>
      <h2>Scan QR Code to Login</h2>
      <QRCodeScanner onLogin={setAreaId} />
      {areaId && <p>Loading area: {areaId}</p>}
    </div>
  );
};

export default LoginPage;
