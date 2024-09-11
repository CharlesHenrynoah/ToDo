// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const supabase = require('../services/supabaseService'); // Assuming supabaseService is defined somewhere

router.post('/signup', authController.signUp);
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