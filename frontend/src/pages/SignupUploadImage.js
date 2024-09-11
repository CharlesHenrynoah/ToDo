// frontend/src/pages/SignupUploadImage.js
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import './SignupUploadImage.css';

const SignupUploadImage = () => {
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    console.log('Aucun utilisateur trouvé, redirection vers /signup');
    return <Navigate to="/signup" />;
  }

  console.log('Utilisateur reçu dans SignupUploadImage:', user);

  return (
    <div className="signup-upload-image">
      <h1>Ajouter une photo de profil</h1>
      <p>Bienvenue, {user.firstName}!</p>
      {/* Ajoutez ici le formulaire d'upload d'image */}
    </div>
  );
};

export default SignupUploadImage;