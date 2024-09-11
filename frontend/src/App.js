import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import SignupUploadImage from './pages/SignupUploadImage';
import Login from './pages/Login'; // Importez le composant Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-upload-image" element={<SignupUploadImage />} />
        <Route path="/login" element={<Login />} /> {/* Ajoutez cette ligne */}
        {/* Autres routes */}
      </Routes>
    </Router>
  );
}

export default App;