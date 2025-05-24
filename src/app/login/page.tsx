'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Page de connexion
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Vérification du token au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      if (typeof window !== 'undefined') {
        window.globalState.isLoggedIn = true;
      }

      // Rediriger vers l'admin si déjà connecté
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoginError(null);

      const apiBaseUrl =
        typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Identifiants incorrects');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setIsLoggedIn(true);

      if (typeof window !== 'undefined') {
        window.globalState.isLoggedIn = true;
        window.globalState.userData = data.user;
      }

      router.push('/admin');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setLoginError('Identifiants incorrects');
    }
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="container">
      <div className="login-container">
        <h2>Connexion</h2>

        <form onSubmit={handleLogin} className="login-form">
          {loginError && <p className="error">{loginError}</p>}

          <div className="form-group">
            <label htmlFor="username">Nom d&apos;utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Se connecter</button>
        </form>

        <div className="login-footer">
          <Link href="/">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  );
}
