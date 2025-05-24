// API Route pour l'authentification
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mon_secret_jwt';

export async function POST(request: Request) {
  try {
    const loginPayload = await request.json();

    const loginQuery = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    const values = [loginPayload.username, loginPayload.password];
    const result = await executeQuery(loginQuery, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
      );

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          password: user.password,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
