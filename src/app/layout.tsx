import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Beautiful Blog',
  description: 'Un blog migré vers Next.js',
};

// Script côté client pour initialiser l'état global et appliquer le mode sombre
const InitScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Initialisation de l'état global
            if (typeof window !== 'undefined') {
              window.globalState = {
                isLoggedIn: false,
                userData: null,
                darkMode: localStorage.getItem('darkMode') === 'true',
                apiBaseUrl: '/api'
              };
              
              // Appliquer le mode sombre
              if (window.globalState.darkMode) {
                document.documentElement.classList.add('dark-mode');
              }
              
              // Gestion des événements de stockage
              window.addEventListener('storage', function(e) {
                if (e.key === 'darkMode') {
                  window.globalState.darkMode = e.newValue === 'true';
                  if (window.globalState.darkMode) {
                    document.documentElement.classList.add('dark-mode');
                  } else {
                    document.documentElement.classList.remove('dark-mode');
                  }
                }
              });
              
              // Gestion du redimensionnement
              const handleResize = function() {
                if (window.innerWidth < 768) {
                  document.body.classList.add('mobile');
                } else {
                  document.body.classList.remove('mobile');
                }
              };
              
              window.addEventListener('resize', handleResize);
              handleResize();
            }
          })();
        `,
      }}
    />
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <InitScript />
        {children}
      </body>
    </html>
  );
}
