// testDbConnection.js
const supabase = require('./config/supabase');

async function testConnection() {
  try {
    // Test de connexion basique
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      throw error;
    }
    
    console.log('Connexion à Supabase réussie.');
    console.log('Nombre d\'utilisateurs dans la table :', data.count);

    // Test de récupération d'un utilisateur (si la table n'est pas vide)
    if (data.count > 0) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1)
        .single();

      if (userError) {
        throw userError;
      }

      console.log('Exemple d\'utilisateur récupéré :', userData);
    }

  } catch (error) {
    console.error('Erreur lors du test de connexion :', error.message);
  }
}

testConnection();