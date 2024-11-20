import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import QRForm from './Components/QRForm';
import ViewData from './Components/ViewData';
import UserDetails from './Components/UserDetails';
import EditQRForm from './Components/QrEditForm';

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();  // Now inside the Router

  // Trigger loading when route changes
  useEffect(() => {
    setLoading(true); // Show loading screen when route changes
    const timer = setTimeout(() => {
      setLoading(false); // Hide loading screen after a delay
    }, 3000); // Set to 1 second or however long you want the loading screen to appear

    // Cleanup the timer if the component unmounts or location changes
    return () => clearTimeout(timer);
  }, [location]);  // This effect runs every time the location (route) changes


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2><span style={{color:"#1fc45f"}}>Please Wait</span> Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<ViewData />} />
        <Route path="/qrform" element={<QRForm />} />
        <Route path="/user/:userId" element={<UserDetails />} />
        <Route path="/edit/:userId" element={<EditQRForm />} />

      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent /> {/* AppContent is now wrapped by Router */}
    </Router>
  );
};

export default App;
