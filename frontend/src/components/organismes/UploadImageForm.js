import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import axios from 'axios';

// Importation du fichier CSS
import './UploadImageForm.css'; // Assurez-vous que le chemin est correct

const UploadImageForm = ({ userId }) => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
  }, [setImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': []
    },
    multiple: false
  });

  const handleRemove = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!image || !userId) {
      console.error('No image or userId');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(image));
      formData.append('userId', userId);

      await axios.post('http://localhost:5000/api/users/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image uploaded successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="upload-image-container">
      <div className="form-container">
        <div className="text-center">
          <h2 className="title">Photo de profil</h2>
          <p className="subtitle">
            Veuillez télécharger une photo de profil pour compléter la configuration de votre compte.
          </p>
        </div>

        <div className="dropzone-container">
          <div className="image-preview">
            {image ? (
              <img src={image} alt="Profile" className="image" />
            ) : (
              <Upload className="upload-icon" />
            )}
          </div>

          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <Upload className="upload-icon" />
              <div className="text-sm text-gray-600">
                <label htmlFor="file-upload" className="upload-label">
                  <span>{isDragActive ? 'Déposez le fichier ici' : 'Téléchargez un fichier'}</span>
                </label>
                <p className="pl-1">ou glissez et déposez</p>
              </div>
              <p className="file-format">PNG, JPG jusqu'à 10MB</p>
            </div>
          </div>

          {image && (
            <button onClick={handleRemove} className="remove-button">
              <X className="remove-icon" /> Supprimer
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!image}
          className="submit-button"
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default UploadImageForm;
