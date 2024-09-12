// services/authService.js
const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

const authService = {
  async signUp(email, password, userData) {
    try {
      console.log('Début de l\'inscription pour:', email);
      console.log('Données utilisateur reçues:', userData);

      // Vérifier si l'email existe déjà
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      if (checkError) {
        console.error('Erreur lors de la vérification de l\'email:', checkError);
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Cette adresse email est déjà utilisée');
      }

      // Insérer les données de l'utilisateur dans votre table personnalisée
      console.log('Tentative d\'insertion dans la table users');
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: email,
          password_hash: await bcrypt.hash(password, 10),
        })
        .select();

      if (insertError) {
        console.error('Erreur lors de l\'insertion des données utilisateur:', insertError);
        throw insertError;
      }

      console.log('Données insérées avec succès:', insertData);

      if (!insertData || insertData.length === 0) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }

      const userId = insertData[0].user_id;
      console.log('ID utilisateur généré:', userId);

      // Créer l'utilisateur dans Supabase Auth
      console.log('Création de l\'utilisateur dans Supabase Auth');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            custom_user_id: userId
          }
        }
      });

      if (authError) {
        console.error('Erreur Supabase lors de l\'inscription:', authError);
        // Si l'inscription Supabase échoue, supprimez l'entrée de la table users
        await supabase.from('users').delete().eq('user_id', userId);
        throw authError;
      }

      console.log('Inscription réussie');
      return { user: { ...authData.user, id: userId } };
    } catch (error) {
      console.error('Erreur complète lors de l\'inscription:', error);
      throw error;
    }
  },

  async signIn(email, password) {
    // Connexion d'un utilisateur existant
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  },

  async signOut() {
    // Déconnexion de l'utilisateur
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    // Récupération de l'utilisateur actuellement connecté
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async resetPassword(email) {
    // Envoi d'un email de réinitialisation de mot de passe
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  async updatePassword(newPassword) {
    // Mise à jour du mot de passe de l'utilisateur connecté
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  },

  async createSession(userId) {
    const { data, error } = await supabase.auth.setSession({
      access_token: userId,
      refresh_token: userId
    });
    if (error) throw error;
    return data.session;
  },

  async debugUserTable() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log('Structure de la table users:', Object.keys(data[0]));
      } else {
        console.log('La table users est vide. Voici la structure attendue :');
        console.log(await this.getExpectedUserStructure());
        
        // Optionnel : Ajouter un utilisateur de test
        console.log('Ajout d\'un utilisateur de test...');
        const testUser = {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          password_hash: 'hashed_password_here', // Assurez-vous de hacher le mot de passe correctement
          profile_picture: null
        };
        const { data: insertedUser, error: insertError } = await supabase
          .from('users')
          .insert([testUser]);
        
        if (insertError) {
          console.error('Erreur lors de l\'ajout de l\'utilisateur de test:', insertError);
        } else {
          console.log('Utilisateur de test ajouté avec succès');
        }
      }
    } catch (error) {
      console.error('Erreur lors du débogage de la table users:', error);
    }
  },

  async getExpectedUserStructure() {
    return [
      'user_id',
      'first_name',
      'last_name',
      'email',
      'password_hash',
      'profile_picture',
      'created_at',
      'updated_at'
    ];
  }
};

// Appelez cette méthode au démarrage de votre serveur
authService.debugUserTable();

module.exports = authService;