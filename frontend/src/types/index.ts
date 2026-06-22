export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Book {
  id?: number;
  title: string;
  author?: string;
  image_url?: string;
  description?: string;
  genres?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  favorite_genres?: string;
  about_me?: string;
  user_id: number;
  created_at: string;
}
