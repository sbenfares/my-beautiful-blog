// API Route pour les tags
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const result = await executeQuery('SELECT * FROM tags ORDER BY title');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
