// controllers/authController.js
const authService = require('../services/authService');
const supabase = require('../config/supabase');

exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const userData = { first_name: firstName, last_name: lastName };
    const data = await authService.signUp(email, password, userData);
    
    res.status(201).json({ 
      message: "Inscription réussie", 
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.signIn(email, password);
    res.json({ message: "Connexion réussie", session: data.session, user: data.user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.signOut = async (req, res) => {
  try {
    await authService.signOut();
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.resetPassword(email);
    res.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser();
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ message: "Aucun utilisateur connecté" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

