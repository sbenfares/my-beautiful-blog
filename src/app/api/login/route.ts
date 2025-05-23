// API Route pour l'authentification
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import jwt from "jsonwebtoken";
import { verify } from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "mon_secret_jwt";
const JWT_ISSUER = "my-beautiful-blog";
const JWT_AUDIENCE = "my-beautiful-blog-admins";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const userQuery = "SELECT * FROM users WHERE username = $1";
    const userResult = await executeQuery(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        // ✅ pas de mot de passe renvoyé
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
