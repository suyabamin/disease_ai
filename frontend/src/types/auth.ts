export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  location?: string;
  preferredLanguage: 'bn' | 'en';
  createdAt?: string;
  isDemoUser?: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  error: string | null;
}
