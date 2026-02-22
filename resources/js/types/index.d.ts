export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  google_id?: string;
  avatar?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    isLoggedIn: boolean;
    user: User | null;
  };
};
