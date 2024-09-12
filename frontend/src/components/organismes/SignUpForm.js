// frontend/src/components/organismes/SignUpForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpForm.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    motDePasse: '',
    confirmationMotDePasse: '',
  });
  const [accepterConditions, setAccepterConditions] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Vérification des caractères spéciaux ou des chiffres dans le nom ou le prénom
    if (name === 'prenom' || name === 'nom') {
      if (/[^a-zA-Z-]/.test(value)) {
        setErreur('Le nom ou le prénom ne peut pas contenir de chiffres ou de caractères spéciaux autres que le tiret.');
      } else {
        setErreur('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit appelé');
    
    if (!accepterConditions) {
      setErreur('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité.');
      return;
    }
    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    setErreur('');
    try {
      console.log('Envoi de la requête d\'inscription...');
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email: formData.email,
        password: formData.motDePasse,
        firstName: formData.prenom,
        lastName: formData.nom
      });
      
      console.log('Réponse complète du serveur:', response.data);
      
      if (response.data && response.data.user && response.data.user.id) {
        console.log('Inscription réussie, ID utilisateur:', response.data.user.id);
        // Redirection immédiate
        navigate('/signup-upload-image', { state: { userId: response.data.user.id } });
      } else {
        console.error('Erreur: Structure de réponse inattendue:', response.data);
        setErreur('Une erreur est survenue lors de l\'inscription: données utilisateur manquantes');
      }
    } catch (error) {
      console.error('Erreur complète lors de l\'inscription:', error.response?.data || error);
      if (error.response?.data?.error === 'L\'adresse email fournie semble être invalide ou inexistante.') {
        setErreur('L\'adresse email fournie semble être invalide ou inexistante. Veuillez vérifier et réessayer.');
      } else {
        setErreur(error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
      }
    }
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form-wrapper">
        <h2 className="signup-form-title">Inscription</h2>
        <p className="signup-form-subtitle">
          Veuillez remplir ce formulaire pour créer un compte !
        </p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form-input-group">
            <input
              name="prenom"
              type="text"
              required
              className="signup-form-input"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
            />
            <input
              name="nom"
              type="text"
              required
              className="signup-form-input"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="signup-form-input"
              placeholder="Adresse e-mail"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="motDePasse"
              type="password"
              autoComplete="new-password"
              required
              className="signup-form-input"
              placeholder="Mot de passe"
              value={formData.motDePasse}
              onChange={handleChange}
            />
            <input
              name="confirmationMotDePasse"
              type="password"
              autoComplete="new-password"
              required
              className="signup-form-input"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmationMotDePasse}
              onChange={handleChange}
            />
            {erreur && <p className="signup-form-error" style={{ color: 'red' }}>{erreur}</p>}
          </div>

          <div className="signup-form-checkbox-container">
            <input
              id="conditions"
              name="conditions"
              type="checkbox"
              className="signup-form-checkbox"
              checked={accepterConditions}
              onChange={() => setAccepterConditions(!accepterConditions)}
            />
            <label htmlFor="conditions" className="signup-form-checkbox-label">
              J'accepte les{" "}
              <Link to="#" className="text-indigo-600 hover:text-indigo-500">
                Conditions d'utilisation
              </Link>
              {" "}et la{" "}
              <Link to="#" className="text-indigo-600 hover:text-indigo-500">
                Politique de confidentialité
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="signup-form-submit-button"
          >
            S'inscrire
          </button>
        </form>
        <div className="signup-form-login-link">
          <Link to="/login">
            Vous avez déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;