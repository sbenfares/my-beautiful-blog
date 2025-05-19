// API Route pour les articles
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Récupération des paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const sqlQuery = `SELECT * FROM posts ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`;
    const result = await executeQuery(sqlQuery);
    
    // Récupérer les tags pour chaque post
    for (const post of result.rows) {
      if (post.tags && post.tags.length > 0) {
        const tagsQuery = `SELECT id, title FROM tags WHERE id = ANY(ARRAY[${post.tags.join(',')}])`;
        const tagsResult = await executeQuery(tagsQuery);
        post.tagObjects = tagsResult.rows;
      } else {
        post.tagObjects = [];
      }
    }
    
    // Requête distincte pour compter le total
    const countResult = await executeQuery('SELECT COUNT(*) FROM posts');
    const total = parseInt(countResult.rows[0].count);
    
    return NextResponse.json({
      data: result.rows,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Vérification du token d'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Récupération du token
    void authHeader.split(' ')[1];
    
    // Récupération du body
    const postData = await request.json();

    // Vérifier si des tags sont fournis
    const tags = postData.tags || [];

    const query = `
      INSERT INTO posts (title, content, author, date, tags)
      VALUES ($1, $2, $3, NOW(), '{' || $4 || '}')
      RETURNING *
    `;
    
    const result = await executeQuery(query, [
      postData.title,
      postData.content, 
      postData.author,
      tags
    ]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
