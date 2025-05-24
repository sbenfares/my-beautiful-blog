// Variables globales

// État global accessible partout
interface GlobalState {
  isLoggedIn: boolean;
  userData: Record<string, unknown> | null;
  darkMode: boolean;
  apiBaseUrl: string;
}

// Définition de l'objet globalState dans window
declare global {
  interface Window {
    globalState: GlobalState;
  }
}

// Initialisation côté client uniquement
export function initGlobalState() {
  if (typeof window !== 'undefined') {
    window.globalState = {
      isLoggedIn: false,
      userData: null,
      darkMode: localStorage.getItem('darkMode') === 'true',
      apiBaseUrl: '/api',
    };
  }
}

export function applyDarkMode() {
  if (typeof window !== 'undefined') {
    if (window.globalState.darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}

const defaultExport = {};
export default defaultExport;
