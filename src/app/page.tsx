'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { initGlobalState, applyDarkMode } from '@/lib/globals';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Initialiser l'état global
    initGlobalState();
    applyDarkMode();
    
    // Récupérer les articles
    fetchPosts();
  }, [currentPage]);
  
  useEffect(() => {
    // Vérification token stocké en local
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        window.globalState.isLoggedIn = true;
      }
      
      document.body.classList.add('logged-in');
    }
    
    // Définition du mode sombre
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiBaseUrl = typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/posts?page=${currentPage}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des articles');
      }
      
      const data = await response.json();
      
      const transformedPosts = data.data.map((post: Post) => ({
        ...post,
        date: post.date ? new Date(post.date).toLocaleDateString('fr-FR') : 'Date inconnue',
      }));
      
      setPosts(transformedPosts);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les articles');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (typeof window !== 'undefined') {
      window.globalState.darkMode = newDarkMode;
    }
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    
    if (typeof window !== 'undefined') {
      window.globalState.isLoggedIn = false;
      window.globalState.userData = null;
    }
    
    window.location.href = '/';
  };
  
  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <header className="header">
        <div className="container">
          <h1>My Beautiful Blog</h1>
          <nav>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              {isLoggedIn ? (
                <>
                  <li><Link href="/admin">Administration</Link></li>
                  <li><button onClick={handleLogout}>Déconnexion</button></li>
                </>
              ) : (
                <li><Link href="/login">Connexion</Link></li>
              )}
              <li>
                <button onClick={toggleDarkMode}>
                  {darkMode ? 'Mode clair' : 'Mode sombre'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container">
        <div className="post-list-container">
          <h2>Articles récents</h2>
          
          {isLoading && <p>Chargement...</p>}
          
          {error && <p className="error">{error}</p>}
          
          {!isLoading && !error && posts.length === 0 && (
            <p>Aucun article disponible</p>
          )}
          
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-meta">
                <span>Par {post.author}</span>
                <span>Le {post.date}</span>
              </div>
              {post.tagObjects && post.tagObjects.length > 0 && (
                <div className="post-tags">
                  {post.tagObjects.map((tag) => (
                    <span key={tag.id} className="tag">
                      {tag.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="pagination">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </button>
            
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 My Beautiful Blog</p>
        </div>
      </footer>
    </div>
  );
}
