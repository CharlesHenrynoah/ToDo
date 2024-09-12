import React from 'react';
import { useLocation } from 'react-router-dom';
import UploadImageForm from '../components/organismes/UploadImageForm';

const SignupUploadImage = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  console.log('SignupUploadImage rendu, userId:', userId);

  return (
    <div>
      <UploadImageForm userId={userId} />
    </div>
  );
};

export default SignupUploadImage;