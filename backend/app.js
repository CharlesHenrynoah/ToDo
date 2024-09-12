const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');

console.log("Chemin du fichier .env :", envPath);

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log("Contenu du fichier .env :");
  console.log(envContent);

  dotenv.config();

  console.log("Variables d'environnement chargées :");
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL || "Non définie");
  console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "Définie" : "Non définie");

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('Les variables d\'environnement SUPABASE_URL et SUPABASE_KEY doivent être définies');
    process.exit(1);
  }

  const app = express();

  app.use(cors());
  app.use(express.json());

  const PORT = process.env.PORT || 5000;

  app.get('/', (req, res) => {
    res.send('Backend is running!');
  });

  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Erreur lors de la lecture du fichier .env :", error);
}