'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tag } from '@/types';

export default function AdminPage() {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Vérification du token stocké en local
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirection vers la page de connexion si non connecté
      router.push('/login');
      return;
    }

    // Récupération des données utilisateur
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      try {
        const userDataObj = JSON.parse(userDataStr);
        setUserData(userDataObj);
        setIsLoggedIn(true);

        if (typeof window !== 'undefined') {
          window.globalState.isLoggedIn = true;
          window.globalState.userData = userDataObj;
        }
      } catch (err) {
        console.error(
          'Erreur lors de la lecture des données utilisateur:',
          err,
        );
      }
    }

    // Charger les tags au chargement du composant
    fetchTags();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fonction pour récupérer les tags
  const fetchTags = async () => {
    try {
      const apiBaseUrl =
        typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/tags`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tags');
      }

      const data = await response.json();
      setTags(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // Fonction pour gérer la sélection des tags
  const handleTagSelection = (tagId: number) => {
    setNewPostTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter((id) => id !== tagId);
      } else {
        return [...prevTags, tagId];
      }
    });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !userData) {
      alert('Vous devez être connecté pour créer un article');
      router.push('/login');
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const apiBaseUrl =
        typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          author: userData.username,
          tags: newPostTags,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'article");
      }

      setNewPostTitle('');
      setNewPostContent('');
      setNewPostTags([]);

      alert('Article créé avec succès !');

      window.location.href = '/';
    } catch (err) {
      console.error('Erreur:', err);
      setError("Erreur lors de la création de l'article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="admin-container">
        <h2>Administration</h2>

        {!isLoggedIn && (
          <div className="unauthorized">
            <p>Vous devez être connecté pour accéder à cette page</p>
            <button onClick={() => router.push('/login')}>
              Aller à la page de connexion
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="create-post-form">
            <h3>Créer un nouvel article</h3>

            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label htmlFor="title">Titre</label>
                <input
                  type="text"
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Contenu</label>
                <textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={10}
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-selection">
                  {tags.length === 0 ? (
                    <p>Chargement des tags...</p>
                  ) : (
                    tags.map((tag) => (
                      <label key={tag.id} className="tag-checkbox">
                        <input
                          type="checkbox"
                          checked={newPostTags.includes(tag.id!)}
                          onChange={() => handleTagSelection(tag.id!)}
                        />
                        <span className="tag-title">{tag.title}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Publication en cours...' : 'Publier'}
              </button>

              {error && <p className="error">{error}</p>}
            </form>
          </div>
        )}

        <div className="admin-footer">
          <Link href="/">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  );
}
