import Link from 'next/link';

// Page 404 personnalisée
export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <h2>Page non trouvée</h2>
        <p>La page que vous cherchez n&apos;existe pas.</p>
        <Link href="/">Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
