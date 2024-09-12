const { createClient } = require('@supabase/supabase-js');

// Définition directe des variables d'environnement
const supabaseUrl = 'https://vbonzfkzzsjxdqrequrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib256Zmt6enNqeGRxcmVxdXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5MDM0MDgsImV4cCI6MjA0MTQ3OTQwOH0.3D2z3S0qu-2H7lRx_oOttmfsDQSxJ0U-9RhAYrNnoYc';

console.log("Création du client Supabase avec :");
console.log("URL:", supabaseUrl);
console.log("Key:", supabaseKey ? "Définie" : "Non définie");

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;