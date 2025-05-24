// Script d'initialisation de la base de données avec des tables et des données de test
import { Client } from 'pg';

// Connexion à la base de données
async function initializeDatabase() {
  // Déterminer si on est en environnement de production
  const isProduction = process.env.NODE_ENV === 'production';

  // Configurer le client en fonction de l'environnement
  let client;
  if (isProduction) {
    // En production (Vercel), utiliser l'URL de connexion Neon
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Nécessaire pour la connexion SSL à Neon
    });
    console.log('Initialisation avec la base de données Neon (production)');
  } else {
    // En développement, utiliser Docker
    client = new Client({
      host: 'localhost',
      port: 5432,
      database: 'blog',
      user: 'postgres',
      password: 'postgres',
    });
    console.log(
      'Initialisation avec la base de données locale (développement)',
    );
  }

  try {
    await client.connect();
    console.log('Connecté à la base de données pour initialisation');

    // Créer la table users si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      )
    `);

    // Vérifier si l'utilisateur admin existe déjà
    const userResult = await client.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin'],
    );

    // Ajouter l'utilisateur admin s'il n'existe pas
    if (userResult.rows.length === 0) {
      await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        ['admin', 'admin123'],
      );
      console.log('Utilisateur admin créé');
    }

    // Créer la table tags si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Ajouter des tags de test s'ils n'existent pas
    const tagTitles = ['JavaScript', 'React', 'NextJS', 'TypeScript', 'CSS'];
    for (const title of tagTitles) {
      const tagResult = await client.query(
        'SELECT * FROM tags WHERE title = $1',
        [title],
      );

      if (tagResult.rows.length === 0) {
        await client.query('INSERT INTO tags (title) VALUES ($1)', [title]);
        console.log(`Tag ${title} créé`);
      }
    }

    // Créer la table posts si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags INTEGER[] DEFAULT '{}'
      )
    `);

    // Vérifier s'il y a des articles
    const postsResult = await client.query('SELECT COUNT(*) FROM posts');

    // Ajouter des articles de test s'il n'y en a pas
    if (parseInt(postsResult.rows[0].count) === 0) {
      // Articles de test
      const testPosts = [
        {
          title: 'Article de test 15',
          content:
            "Ceci est le contenu de l'article de test numéro 15. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: 'user1',
          tags: [1, 3], // JavaScript, NextJS
        },
        {
          title: 'Article de test 18',
          content:
            "Ceci est le contenu de l'article de test numéro 18. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: 'admin',
          tags: [2, 4], // React, TypeScript
        },
        {
          title: 'Article de test 19',
          content:
            "Ceci est le contenu de l'article de test numéro 19. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: 'user1',
          tags: [3, 5], // NextJS, CSS
        },
        {
          title: 'Article de test 14',
          content:
            "Ceci est le contenu de l'article de test numéro 14. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: 'admin',
          tags: [1, 2, 5], // JavaScript, React, CSS
        },
      ];

      for (const post of testPosts) {
        await client.query(
          'INSERT INTO posts (title, content, author, tags) VALUES ($1, $2, $3, $4)',
          [post.title, post.content, post.author, post.tags],
        );
        console.log(`Article "${post.title}" créé`);
      }
    }

    console.log('Initialisation de la base de données terminée avec succès');
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error,
    );
  } finally {
    await client.end();
    console.log('Connexion à la base de données fermée');
  }
}

export { initializeDatabase };
