// Script pour initialiser la base de données
import { initializeDatabase } from '../lib/initDb';

async function runInitialization() {
  console.log("Démarrage de l'initialisation de la base de données...");

  try {
    await initializeDatabase();
    console.log('Initialisation terminée avec succès');
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }

  process.exit();
}

runInitialization();
