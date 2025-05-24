// Connexion à la base de données (adaptée pour environnements multiples)
import { Client } from 'pg';
import { initializeDatabase } from './initDb';

let db: Client;
let dbInitialized = false;

// Fonction pour initialiser la connexion à la base de données
export async function connectToDB() {
  // Déterminer si on est en environnement de production
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // En production (Vercel), utiliser l'URL de connexion Neon
    db = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Nécessaire pour la connexion SSL à Neon
    });
  } else {
    // En développement, utiliser Docker
    db = new Client({
      host: 'localhost',
      port: 5432,
      database: 'blog',
      user: 'postgres',
      password: 'postgres',
    });
  }

  await db.connect();
  console.log(
    `Connecté à la base de données en mode ${isProduction ? 'production' : 'développement'}`,
  );

  // Initialiser la base de données (tables et données) si ce n'est pas déjà fait
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Base de données initialisée avec succès');
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de la base de données:",
        error,
      );
    }
  }
}

// Fonction pour exécuter une requête SQL
export async function executeQuery(
  query: string,
  params?: (string | number | boolean | Date | null | number[])[],
) {
  if (!db) {
    await connectToDB();
  }

  try {
    // Si des paramètres sont fournis, utiliser une requête paramétrée
    // Sinon, exécuter la requête brute
    if (params) {
      return await db.query(query, params);
    } else {
      return await db.query(query);
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error);
    throw error;
  }
}

// Export de l'instance db pour une utilisation directe
export { db };
