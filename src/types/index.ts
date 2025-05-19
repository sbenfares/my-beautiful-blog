// Types pour l'application migrée vers Next.js

// Interface pour un tag
export interface Tag {
  id?: number;
  title: string;
}

// Interface pour un article de blog
export interface Post {
  id?: number;
  title: string;
  content: string;
  date?: string;
  author?: string;
  tags?: number[]; // Array d'IDs de tags
  tagObjects?: Tag[]; // Tags complets après jointure (pour l'affichage)
}

// Interface pour l'authentification
export interface User {
  id?: number;
  username: string;
  password: string;
}

// Interface pour la réponse de connexion
export interface LoginResponse {
  token: string;
  user: User;
}

// Interface pour les erreurs API
export interface ApiError {
  error: string;
  code?: number;
}

// Type pour la pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

// Type de réponse pour les listes paginées
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
