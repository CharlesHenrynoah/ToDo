// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const supabase = require('../services/supabaseService'); // Assuming supabaseService is defined somewhere
const authService = require('../services/authService'); // Assuming authService is defined somewhere

router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log('Données reçues dans la route signup:', req.body);
    const result = await authService.signUp(email, password, { firstName, lastName });
    
    console.log('Résultat de l\'inscription:', result);

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: result.user.id,
        email: result.user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Personnalisation du message d'erreur
    if (error.message.includes('Error sending confirmation email')) {
      res.status(400).json({ error: 'L\'adresse email fournie semble être invalide ou inexistante.' });
    } else {
      res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' });
    }
  }
});

router.post('/signin', authController.signIn);
router.post('/signout', authController.signOut);
router.post('/reset-password', authController.resetPassword);

router.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    res.json({ message: 'Connexion à Supabase réussie', data });
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    res.status(500).json({ error: 'Erreur de connexion à Supabase' });
  }
});

module.exports = router;